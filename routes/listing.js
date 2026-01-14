const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listings.js"); 
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// ✅ CORRECTED PATH: (plural 'listings.js')
const Listing = require("../models/listings.js"); 

// ---------------------------------------------------------
// 0. My Books Route (MUST be before /:id)
// ---------------------------------------------------------
router.get("/my-books", isLoggedIn, async (req, res) => {
    const myListings = await Listing.find({ owner: req.user._id });
    res.render("listings/my-books.ejs", { listings: myListings });
});

// ---------------------------------------------------------
// 1. Index & Create Routes ("/")
// ---------------------------------------------------------
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,         
    validateListing,    
    wrapAsync(listingController.createListing)
  );

// ---------------------------------------------------------
// 2. New Form Route ("/new")
// ---------------------------------------------------------
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ---------------------------------------------------------
// 3. Show, Update, Delete Routes ("/:id")
// ---------------------------------------------------------
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,            
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

// ---------------------------------------------------------
// 4. Edit Form Route ("/:id/edit")
// ---------------------------------------------------------
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;