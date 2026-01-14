require('dotenv').config(); // Load environment variables if you have them
const mongoose = require("mongoose");
const axios = require("axios");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/mybook123";

// ⚠️ Make sure this Key is valid (the one you created recently)
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyAsRJSy51AcRIKD7tmcvBuorZW9eybn9J4";

/* Connect to DB */
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to DB");
}

/* 1. Function to Fetch Real Covers from Google */
async function fetchBookImage(title) {
  try {
    const res = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: {
          q: title,
          maxResults: 1,
          printType: "books",
          key: GOOGLE_API_KEY
        }
      }
    );

    // Try to get a high-quality image, fallback to thumbnail
    const imageLinks = res.data.items?.[0]?.volumeInfo?.imageLinks;
    let image = imageLinks?.thumbnail || imageLinks?.smallThumbnail;

    // Fix: Swap http for https and increase zoom for better quality
    if (image) {
      image = image.replace('http:', 'https:').replace('&edge=curl', '');
    }

    return (
      image ||
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
    );

  } catch (err) {
    console.log(`⚠️ Image fetch failed for: ${title}`);
    return "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f";
  }
}

function getRandomCoordinates() {
  const cities = [
    { lat: 19.0760, lng: 72.8777 }, // Mumbai
    { lat: 28.6139, lng: 77.2090 }, // Delhi
    { lat: 12.9716, lng: 77.5946 }, // Bangalore
    { lat: 18.5204, lng: 73.8567 }, // Pune
    { lat: 22.5726, lng: 88.3639 }, // Kolkata
    { lat: 13.0827, lng: 80.2707 }, // Chennai
  ];

  // Pick random city
  const city = cities[Math.floor(Math.random() * cities.length)];

  // Small random spread around city
  const randomOffset = () => (Math.random() - 0.5) * 0.3;

  return {
    lat: city.lat + randomOffset(),
    lng: city.lng + randomOffset()
  };
}

/* Initialize DB */

/* 2. Initialize DB with Images + NEW FIELDS (Email/MRP) */
async function initDB() {
  // Clear old data
  await Listing.deleteMany({});
  console.log("🧹 Old listings removed");

  for (let book of initData.data) {
    // A. Fetch the image
    const image = await fetchBookImage(book.title);
    // B. Create the listing with ALL required fields

    // 👇 MUST be inside loop
    const { lat, lng } = getRandomCoordinates();

    await Listing.create({
      ...book,
      image: image,
      geometry: {
        type: "Point",
        coordinates: [
          Number(lng.toFixed(6)),
          Number(lat.toFixed(6))
        ]
      },
      // ✅ FIX: Inject the missing fields required by your new Schema
      email: "demo.student@college.edu",
      mrp: book.price ? Math.floor(book.price * 1.5) : 500,
      category: "Academic",
      location: book.location || "Mumbai, India"
    });

    console.log(`📘 Added: ${book.title}`, lat, lng);
  }

  console.log("🎉 Database initialized with Google Images + Emails!");
}

/* Run */
main().then(initDB).then(() => {
  console.log("🚀 Script finished. Press Ctrl+C to exit.");
  // We keep the connection open for a moment to ensure console logs print
  setTimeout(() => mongoose.connection.close(), 2000);
});