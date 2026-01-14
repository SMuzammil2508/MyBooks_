const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const {isLoggedIn,validateReview,isReviewAuthor} = require("../middlewear.js");
const Review = require("../models/review.js");
const { reviewSchema} = require("../schema.js");
const reviewController = require("../conntrollers/reviews.js");



 router.post("/",
   isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

 router.delete("/:reviewId",
   isLoggedIn,
   isReviewAuthor,
   wrapAsync(reviewController.distroyReview));

 module.exports = router;