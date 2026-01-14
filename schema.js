const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    // 1. The main listing object
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        author: Joi.string().required(), // We fixed this earlier
        category: Joi.string().required(),
        email: Joi.string().email().required(),
        mrp: Joi.number().required().min(0),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
    }).required(),

    // 2. Allow these fields to exist (they come from your hidden inputs)
    lat: Joi.any(),
    lng: Joi.any()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});