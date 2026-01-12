 const express = require("express");
 const app = express();

 const path=require("path");

 const mongoose = require("mongoose");
 const Listing = require("./models/listings.js");
 const Review = require("./models/review.js");
 const methodOverride = require("method-override")

 const wrapAsync = require("./utils/wrapAsync.js");
 const ExpressError = require("./utils/ExpressError.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


 const MONGO_URL="mongodb://127.0.0.1:27017/mybook123";
 main().then(()=>{
   console.log("connect to DB");
 })
 .catch((err) =>{
    console.log(err)
 })
async function main(){
 await mongoose.connect(MONGO_URL);
}

 app.get("/",(req,res) =>{
    res.send("I am root");
 })

 //index route
 app.get("/listings",async(req ,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
    
 });

 
 //new route
 
app.get("/listings/new",async(req, res) =>{
    res.render("listings/new.ejs");
 });

 
 //show route
 app.get("/listings/:id",async(req, res) =>{
    let { id } = req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{ listing });
 });

 //post rooute
 app.post("/listings",async(req, res) =>{
   let listing = req.body.listing;
   const newListing = new Listing(listing);
   await newListing.save();
   res.redirect("/listings");
 });
 

 //Edit route
 app.get("/listings/:id/edit",async(req, res) =>{
    let { id } = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing });
 });
 

 //Update route
 app.put("/listings/:id",async(req,res) =>{
    let { id } = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
 })

 //delete route
 app.delete("/listings/:id",async(req,res) =>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
 })


 //revews

 app.post("/listings/:id/reviews",async(req,res) =>{
   let listing= await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`)
 });

 app.delete("/listings/:id/reviews/:reviewId",async(req,res) =>{
        let { id , reviewId} = req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}`);
 })



 app.use((req ,res , next) =>{
   next (new ExpressError(404 , "Page not Found"));
});

app.use((err, req , res , next) =>{
    let {statusCode=500, message="Somethig went Wrong"} = err; 
    res.status(statusCode).render("error.ejs",{ err});
   //  res.status(statusCode).send(message);
})

 app.listen(8080,()=>{
    console.log("Server is listing on port  8080")
 });