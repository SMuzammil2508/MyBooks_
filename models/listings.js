//  const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title:{
//       type: String,
//       required:true
//     },
//     description:String,
//     image:{
//       type:String,
//       default:"https://unsplash.com/photos/a-painting-of-a-mans-face-on-a-canvas-3Hsqx6BaQjQ",
//       set: (v) => v === "" 
//       ? "https://unsplash.com/photos/a-painting-of-a-mans-face-on-a-canvas-3Hsqx6BaQjQ"
//       :v,
//     },
//     price:Number,
//     location:String,
// });

// const Listing = mongoose.model("Listing",listingSchema);
// module.exports = Listing;


const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); // ✅ Added Review model import

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f";

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: String,
      trim: true
    },

    description: {
      type: String,
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

    // ✅ Added Reviews Array
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

// ✅ Added Middleware: Deletes all reviews if a Listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;