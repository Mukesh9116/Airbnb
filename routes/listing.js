const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError');
const { listingSchema } = require("../schema.js");
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
  .route("/")
  .get(wrapAsync(listingController.index)) // index route ----->>>>
  .post(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing)); // Create Route ===>>>

// New Routes ----->>>
router.get("/new", isLoggedIn, listingController.renderNewForm);


router
.route("/:id")
.get( wrapAsync(listingController.showListing)) // Show Route ===>>
.put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)
) // Update Route ===>>
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)
); // Delete Route ---->>




// Edit Route ===>>
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm)
);

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require('../utils/ExpressError');
// const { listingSchema } = require("../schema.js");
// const listing = require('../models/listing.js');
// const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// const listingController = require("../controllers/listings.js");

// const multer  = require('multer');
// const { storage } = require("../cloudConfig.js");
// const upload = multer({ storage });

// // INDEX + CREATE
// router.route("/")
//   .get(wrapAsync(listingController.index))
//   .post(
//     isLoggedIn,
//     upload.single("listing[image]"),
//     validateListing,
//     wrapAsync(listingController.createListing)
//   );

// // NEW FORM
// router.get("/new", isLoggedIn, listingController.renderNewForm);

// // SHOW + UPDATE + DELETE
// router.route("/:id")
//   .get(wrapAsync(listingController.showListing))
//   .put(
//     isLoggedIn,
//     isOwner,
//     upload.single('listing[image]'),
//     validateListing,
//     wrapAsync(listingController.updateListing)
//   )
//   .delete(
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.destroyListing)
//   );

// // EDIT FORM
// router.get("/:id/edit",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.renderEditForm)
// );

// module.exports = router;
