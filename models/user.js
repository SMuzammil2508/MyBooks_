const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    // 🌍 NEW: Store the text address
    location: {
        type: String,
        required: false
    },
    // 📍 NEW: Store the coordinates (for "Near Me" search later)
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [Longitude, Latitude]
            required: false
        }
    },

    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing"
        }
    ]
});




const plugin = passportLocalMongoose.default || passportLocalMongoose;
userSchema.plugin(plugin);


module.exports = mongoose.model("User", userSchema);