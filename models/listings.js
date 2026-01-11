 const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    location:String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;