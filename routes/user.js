const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js"); 
const userController = require("../controllers/users.js");

// ✅ CORRECTED PATHS:
const User = require("../models/user.js");
const Listing = require("../models/listings.js"); 

// ---------------------------------------------------------
// 1. Signup Routes
// ---------------------------------------------------------
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// ---------------------------------------------------------
// 2. Login Routes
// ---------------------------------------------------------
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl, 
        passport.authenticate("local", { 
            failureRedirect: "/login", 
            failureFlash: true 
        }),
        userController.login
    );

// ---------------------------------------------------------
// 3. Logout Route
// ---------------------------------------------------------
router.get("/logout", userController.logout);

// ---------------------------------------------------------
// 4. Profile Route
// ---------------------------------------------------------
router.get("/profile", isLoggedIn, async (req, res) => {
    // 1. Get User and Populate Wishlist
    const user = await User.findById(req.user._id).populate("wishlist");
    
    // 2. Find books sold by this user
    const myListings = await Listing.find({ owner: req.user._id });
    
    // 3. Attach listings to user object so EJS can use it
    user.listings = myListings; 
    
    res.render("users/profile.ejs", { currUser: user });
});

// ---------------------------------------------------------
// 5. Wishlist Routes
// ---------------------------------------------------------

// GET /wishlist - Show saved books
router.get("/wishlist", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.render("listings/wishlist.ejs", { listings: user.wishlist });
});

// DELETE /wishlist/:id - Remove book from wishlist
router.delete("/wishlist/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    
    // Remove the book ID from the wishlist array
    user.wishlist.pull(id);
    await user.save();
    
    req.flash("success", "Removed from wishlist");
    res.redirect("/wishlist");
});
// ---------------------------------------------------------
// 6. TOGGLE WISHLIST ROUTE (The missing piece!)
// ---------------------------------------------------------
router.post("/wishlist/:id/toggle", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        // Check if the book ID is already in the array
        const bookIndex = user.wishlist.indexOf(id);
        
        let wished = false;

        if (bookIndex === -1) {
            // Not in wishlist -> ADD IT
            user.wishlist.push(id);
            wished = true;
        } else {
            // Already in wishlist -> REMOVE IT
            user.wishlist.splice(bookIndex, 1);
            wished = false;
        }

        await user.save();

        // Send JSON back to the frontend script
        res.status(200).json({ success: true, wished: wished });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// module.exports = router;  <-- Keep this at the very end

module.exports = router;