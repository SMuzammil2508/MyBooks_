const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js"); // Ensure User model is loaded

// Standard fallback image if user doesn't provide one
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f";

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    // Fixed spelling: Friend had 'discription', we use 'description'
    description: {
      type: String,
      trim: true
    },

    image: {
      type: String,
      default: DEFAULT_IMAGE,
      set: (v) => (v && v.trim() !== "" ? v : DEFAULT_IMAGE)
    },

    price: {
      type: Number,
      min: 0,
      required: true
    },

    // ✅ YOUR FEATURE: Required for the "50% OFF" badge logic
    mrp: {
      type: Number,
      min: 0,
      default: 0
    },

    location: {
      type: String,
      trim: true,
      required: true
    },

    // Standardized: Friend had 'bookAuthor', we use 'author'
    author: {
      type: String,
      trim: true
    },

    // ✅ YOUR FEATURE: Categories for filtering
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

    // ✅ YOUR FEATURE: Maps support
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],   // Format: [lng, lat]
        required: true
      }
    },

    // 📧 Contact info (Can be auto-filled from Owner later)
    email: {
      type: String,
      trim: true
    },

    // ✅ FRIEND'S FEATURE: Links the book to a logged-in user
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // Relation to Reviews
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true } // Auto-adds createdAt and updatedAt
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