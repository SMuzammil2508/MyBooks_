const express = require("express");
const fetch = require("node-fetch");
const Listing = require("../models/listings.js");

const router = express.Router();

const API_KEY = "AIzaSyBbly_QUlI30vYcRdPF7SFRAkxAG_qV7Nk";

router.post("/recommend", async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.json({ response: "Please enter a query." });

        const listings = await Listing.find({});

        const booksText = listings.map(b => `
Title: ${b.title}
Description: ${b.description || "No description"}
Category: ${b.category || "General"}
`).join("\n");

        const prompt = `
You are a smart book recommendation system.

User query: "${query}"

Available books:
${booksText}

Return the top 5 best matching books in ranked order.
`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log("FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

        res.json({ response: data });


    } catch (err) {
        console.error("Gemini error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
