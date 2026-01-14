const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const Listing = require("../models/listings");

const router = express.Router();

const client = new GoogleGenAI({
    apiKey: "APIKEY"
});

router.post("/recommend", async (req, res) => {
    try {
        console.log("🔥 AI route hit");

        const { query } = req.body;
        if (!query) return res.json({ response: "No query provided" });
        if (query.length > 500) {
            return res.json({ response: "Message too long. Please keep it under 500 characters." });
        }

        const listings = await Listing.find({});

        const booksText = listings.map(b => `
Title: ${b.title}
Description: ${b.description || "No description"}
Category: ${b.category || "General"}
`).join("\n");

        const prompt = `
You are MyBooks AI, a friendly, intelligent book assistant inside a book marketplace.

The user said: "${query}"

Here are the books available on the platform:
${booksText}

Your job:
- Answer naturally like a helpful assistant.
- Recommend books when relevant.
- Explain WHY you recommend them.
- If no book matches, suggest alternatives or say none are available.
- Use a friendly tone.

Do NOT just return a list. Give a proper conversational response.
`;


        const result = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        });

        const text = result.candidates[0].content.parts[0].text;

        res.json({ response: text });

    } catch (err) {
        console.error("Gemini error:", err);
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
