const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};




module.exports.signup = async (req, res) => {
    try {
        // 1. Grab all the data from the form
        let { username, email, password, location, lat, lng } = req.body;
        
        // 2. Create the User Object
        const newUser = new User({ 
            email, 
            username,
            location: location, // Save the text address
            geometry: {
                type: 'Point',
                // If coordinates exist, save them. If not, default to [0,0]
                coordinates: (lat && lng) ? [parseFloat(lng), parseFloat(lat)] : [0,0]
            }
        });

        // 3. Register the user
        const registeredUser = await User.register(newUser, password);
        
        // 4. Login immediately
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to MyBooks!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};