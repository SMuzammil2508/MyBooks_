const express = require("express");
const router = express.Router({ mergeParams: true }); // Critical: Allows access to :id from app.js
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/reviews.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

// Post Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;