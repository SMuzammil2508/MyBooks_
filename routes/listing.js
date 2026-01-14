const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listings.js"); 
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// ---------------------------------------------------------
// 1. Index & Create Routes ("/")
// ---------------------------------------------------------
router
  .route("/")
  // GET /listings -> Show all books (and handle search)
  .get(wrapAsync(listingController.index))
  // POST /listings -> Create a new book
  .post(
    isLoggedIn,         // Check if user is logged in
    validateListing,    // Check if data is valid (Joi)
    wrapAsync(listingController.createListing)
  );

// ---------------------------------------------------------
// 2. New Form Route ("/new")
// ⚠️ MUST be defined BEFORE /:id, otherwise "new" is treated as an ID
// ---------------------------------------------------------
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ---------------------------------------------------------
// 3. Show, Update, Delete Routes ("/:id")
// ---------------------------------------------------------
router
  .route("/:id")
  // GET /listings/:id -> Show details
  .get(wrapAsync(listingController.showListing))
  // PUT /listings/:id -> Update listing
  .put(
    isLoggedIn,
    isOwner,            // Check if user owns this book
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  // DELETE /listings/:id -> Delete listing
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