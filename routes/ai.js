const express = require("express");
const router = express.Router();
const Listing = require("../models/listings"); // Ensure this path matches your project structure
// FIX: Using the package you successfully installed
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- CONFIGURATION ---
const API_KEY = "AIzaSyBYbB142QxUaHWFG6q2P0wcnETojOmwXVo"; // ⚠️ Hardcoded for now
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/recommend", async (req, res) => {
    try {
        console.log("🔥 AI route hit");

        const { query } = req.body;
        if (!query) return res.json({ response: "No query provided" });

        // 1. Fetch all books from your Database
        const listings = await Listing.find({});

        // 2. Prepare the list for the AI
        const booksText = listings.map(b => `
        - Title: ${b.title}
          Author: ${b.author || "Unknown"}
          Price: ₹${b.price}
          Category: ${b.category || "General"}
          Description: ${b.description}
        `).join("\n");

        // 3. Create the Prompt
        const prompt = `
        You are MyBooks AI, a smart assistant for a student book marketplace.
        
        The user asked: "${query}"

        Here are the books currently available on our platform:
        ${booksText}

        Instructions:
        - Recommend books from this list that match the user's need.
        - If you recommend a book, mention its Price and Author.
        - Explain WHY it is a good choice.
        - If no book matches, politely say so and suggest they check back later.
        - Be friendly and concise.
        `;

        // 4. Generate Answer
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 5. Send back to Frontend
        res.json({ response: text });

    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ error: "I am having trouble connecting to the AI brain right now." });
    }
});

module.exports = router;