const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Signup Routes
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// Login Routes
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl, // Middleware to remember where user wanted to go
        passport.authenticate("local", { 
            failureRedirect: "/login", 
            failureFlash: true 
        }),
        userController.login
    );

// Logout Route
router.get("/logout", userController.logout);

module.exports = router;