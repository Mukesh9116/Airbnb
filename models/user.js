const { string } = require("joi");
const mongoose = require("mongoose"); // Import Mongoose for MongoDB interactions
const Schema = mongoose.Schema;       // Extract Schema constructor from mongoose
const passportLocalMongoose = require("passport-local-mongoose"); // Import the plugin


const userSchema = new Schema({
    email:{
        type:String,
        require:true
    }
});

userSchema.plugin(passportLocalMongoose); // ye automatically username , hashing , salting and hashsalt ko add kar deta hai.



module.exports = mongoose.model("User",userSchema);