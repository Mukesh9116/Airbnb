if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}
const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const user = require('./models/user.js');
const app = express();
const port = process.env.PORT || 8080;
const dbUrl = process.env.ATLASDB_URL;

// MongoDB Connection
main().then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.log("Connection error:", err);
});

async function main() {
  await mongoose.connect(dbUrl);
}

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse form data if needed later
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));




const store = MongoStore.create({
  mongoUrl :dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24*60*60
});


store.on("error",() =>{
  console.log("ERROR in MANGO SESSION STORE",err);
});

const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 10000,
    maxAge:7 * 24 * 60 * 60 * 10000,
    httpOnly:true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);



// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Page not found!" } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
