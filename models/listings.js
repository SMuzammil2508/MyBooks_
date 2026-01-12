const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./review.js");

const listingSchema = new Schema({
    title:{
      type: String,
      required:true
    },
    discription:String,
    image:{
      type:String,
      default:"https://unsplash.com/photos/a-painting-of-a-mans-face-on-a-canvas-3Hsqx6BaQjQ",
      set: (v) => v === "" 
      ? "https://unsplash.com/photos/a-painting-of-a-mans-face-on-a-canvas-3Hsqx6BaQjQ"
      :v,
    },
    price:Number,
    bookAuthor:String,
    location:String,
     reviews:[{
      type:Schema.Types.ObjectId,
      ref:"Review",
     },
     ], 
});

listingSchema.post("findOneAndDelete",async(listing) =>{
   if (listing){
      await Review.deleteMany({_id: {$in:listing.reviews}});
   }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;