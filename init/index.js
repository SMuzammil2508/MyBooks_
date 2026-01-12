// const mongoose =require("mongoose");
// const initData= require("./data.js");
// const Listing = require("../models/listings");

// const MONGO_URL="mongodb://127.0.0.1:27017/mybook123";
//  main().then(()=>{
//    console.log("connect to DB");
//  })
//  .catch((err) =>{
//     console.log(err)
//  })
// async function main(){
//  await mongoose.connect(MONGO_URL);
// }

// const initDB = async() =>{
//     await Listing.deleteMany({});
//     await Listing.insertMany(initData.data);
// };

// initDB();

const mongoose = require("mongoose");
const axios = require("axios");
const initData = require("./data.js");
const Listing = require("../models/listings");

const MONGO_URL = "mongodb://127.0.0.1:27017/mybook123";
const GOOGLE_API_KEY = "AIzaSyAsRJSy51AcRIKD7tmcvBuorZW9eybn9J4";

/* Connect to DB */
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to DB");
}


async function fetchBookImage(title) {
  try {
    const res = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: {
          q: title,           // 🔥 NOT intitle:
          maxResults: 1,
          printType: "books",
          key: GOOGLE_API_KEY
        }
      }
    );

    const image =
      res.data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;

    return (
      image ||
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
    );

  } catch (err) {
    console.log("Image fetch failed for:", title);
    return "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f";
  }
}


/* Initialize DB */
async function initDB() {
  await Listing.deleteMany({});
  console.log("🧹 Old listings removed");

  for (let book of initData.data) {
    const image = await fetchBookImage(book.title);

    await Listing.create({
      ...book,
      image
    });

    console.log(`📘 Added: ${book.title}`);
  }

  console.log("🎉 Database initialized with Google Books images");
}

/* Run */
main().then(initDB).then(() => mongoose.connection.close());
