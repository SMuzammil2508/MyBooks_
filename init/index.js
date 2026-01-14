const mongoose =require("mongoose");
const initData= require("./data.js");
const Listing = require("../models/listing");

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

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj) =>({...obj, owner:"69663833b37416bdaac67822"}))
    await Listing.insertMany(initData.data);
};

initDB();