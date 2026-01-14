const express = require("express");
const router = express.Router()

const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner ,validateListing} = require("../middlewear.js");

const { listingSchema, reviewSchema} = require("../schema.js");
const listingControllers = require("../conntrollers/listings.js");


//index route
 router.get("/", wrapAsync(listingControllers.index));

 //new route
 
router.get("/new",
   isLoggedIn,
   wrapAsync(listingControllers.renderNewForm));

 //post rooute
   router.post("/",
      isLoggedIn,
    validateListing ,
     wrapAsync(listingControllers.createListings));

 //show route
  router.get("/:id",wrapAsync(listingControllers.showListings));

  


   //Edit route
    router.get("/:id/edit",
      isLoggedIn,
      isOwner,
      validateListing,
      wrapAsync(listingControllers.renderEditForm ));
      
   
    //Update route
    router.put("/:id",
      isLoggedIn,
      isOwner,
        validateListing ,
        wrapAsync(listingControllers.updateListings));
   
    //delete route
    router.delete("/:id",
      isOwner,
      wrapAsync(listingControllers.distroyListings));

    module.exports = router;