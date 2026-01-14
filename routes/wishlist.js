const express = require("express");
const router = express.Router();
const User = require("../models/user");

// test route
router.get("/test", (req, res) => {
    res.send("Wishlist route working");
});

// delete wishlist item
router.delete("/:id", async (req, res) => {
    console.log("DELETE hit:", req.params.id);

    if (!req.user) {
        return res.status(401).json({ error: "Not logged in" });
    }

    await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: req.params.id }
    });

    res.json({ success: true });
});

// Must be logged in
router.post("/:listingId", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not logged in" });

    const user = await User.findById(req.user._id);
    const id = req.params.listingId;

    const index = user.wishlist.indexOf(id);

    let added;
    if (index === -1) {
        user.wishlist.push(id);
        added = true;
    } else {
        user.wishlist.splice(index, 1);
        added = false;
    }

    await user.save();

    res.json({ added });
});

async function removeFromWishlist(id, btn) {
    try {
        const res = await fetch(`/wishlist/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            // Remove card from UI
            const card = btn.closest(".listing-card");
            card.remove();
        } else {
            alert("Failed to remove from wishlist");
        }
    } catch (err) {
        console.error(err);
    }
}
router.delete("/:id", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
        bookId => bookId.toString() !== req.params.id
    );

    await user.save();
    res.send({ success: true });
});

async function removeFromWishlist(listingId, btn) {
    try {
        const res = await fetch(`/wishlist/${listingId}`, {
            method: "DELETE"
        });

        if (res.ok) {
            btn.closest(".listing-card").remove();
        }
    } catch (err) {
        console.error(err);
    }
}


module.exports = router;
