const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); // ✅ Added Review model import

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f";

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    image: {
      type: String,
      default: DEFAULT_IMAGE,
      set: (v) => (v && v.trim() !== "" ? v : DEFAULT_IMAGE)
    },

    // 🔍 Helps debugging + UI badge later
    imageSource: {
      type: String,
      enum: ["google", "openlibrary", "fallback"],
      default: "fallback"
    },

    price: {
      type: Number,
      min: 0,
      required: true
    },

    // ✅ NEW: Required for the "50% OFF" badge logic
    mrp: {
      type: Number,
      min: 0,
      required: true
    },

    location: {
      type: String,
      trim: true,
      required: true
    },

    author: {
      type: String,
      trim: true
    },

    // 📧 NEW: Temporary Email field (Until we add Authentication)
    // This connects the Buyer to the Seller
    email: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Self-Help",
        "IIT-JEE",
        "NEET",
        "Engineering",
        "Academic",
        "Other"
      ],
      default: "Other"
    },

    // ✅ geometry must be its own field
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],   // [lng, lat]
      }
    },



    image: {
      type: String,
      default: DEFAULT_IMAGE,
      set: (v) => (v && v.trim() !== "" ? v : DEFAULT_IMAGE)
    },

    // 🔍 Helps debugging + UI badge later
    imageSource: {
      type: String,
      enum: ["google", "openlibrary", "fallback"],
      default: "fallback"
    },

    price: {
      type: Number,
      min: 0
    },

    location: {
      type: String,
      trim: true
    },

    // Relation to Reviews
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

// 🚀 Speeds up category filtering
listingSchema.index({ category: 1 });

// Middleware: Deletes all reviews if a Listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;