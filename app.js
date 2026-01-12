 const express = require("express");
 const app = express();

 const path=require("path");


 //added new line ---------------------------------------
 app.use(express.static(path.join(__dirname, "public")));


 const mongoose = require("mongoose");
 const Listing = require("./models/listings.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));


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

 
 //create route
 
app.get("/listings/new",async(req, res) =>{
    res.render("listings/new.ejs");
 });

 //post rooute
 app.post("/listings",async(req, res) =>{
    
 });

 //show route
 app.get("/listings/:id",async(req, res) =>{
    let { id } = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{ listing });
 });
 
 
 


//  app.get("/test",async (req, res) =>{
//     let sampleListing = new Listing({
//         title:"My NEW book",
//         discription:"Nice book",
//         price:123,
//         location:"mumbai",
//  });
//   await sampleListing.save();
//   console.log("done");
//   res.send("done");
//  })

 app.listen(8080,()=>{
    console.log("Server is listing on port  8080")
 });