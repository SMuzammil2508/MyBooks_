const Listing = require("../models/listings.js");

// ✅ INDEX (Merged with Search)
module.exports.index = async (req, res) => {
    const { search } = req.query;
    let allListings;

    if (search) {
        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } } // 🔍 Added Location Search
            ]
        });
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings, search: search || "" });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// 📍 CREATE LISTING (Updated for Maps)
module.exports.createListing = async (req, res) => {
    // 1. Get the text data
    let listing = req.body.listing;
    const newListing = new Listing(listing);

    // 2. Link the Owner
    newListing.owner = req.user._id;

    // 3. 🗺️ CAPTURE COORDINATES (From hidden inputs)
    let { lat, lng } = req.body;

    if (lat && lng) {
        newListing.geometry = {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)] // GeoJSON uses [Longitude, Latitude]
        };
    } else {
        // Fallback if map fails
        newListing.geometry = { type: 'Point', coordinates: [0, 0] };
    }

    // 4. Save
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};