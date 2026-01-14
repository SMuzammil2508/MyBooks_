// Frontend wishlist toggle (browser-safe)
function toggleWishlist(listingId, btn) {
    console.log("Wishlist clicked:", listingId);

    // Toggle UI instantly
    btn.classList.toggle("active");

    if (btn.classList.contains("active")) {
        btn.innerText = "❤️";
    } else {
        btn.innerText = "🤍";
    }

    // OPTIONAL: send to backend later
    /*
    fetch("/wishlist/" + listingId, {
      method: "POST"
    });
    */
}
async function toggleWishlist(listingId, btn) {
    try {
        const res = await fetch(`/wishlist/${listingId}`, {
            method: "POST"
        });

        const data = await res.json();

        if (data.added) {
            btn.innerText = "❤️";
            btn.classList.add("active");
        } else {
            btn.innerText = "🤍";
            btn.classList.remove("active");
        }
    } catch (err) {
        console.error(err);
    }
}


async function removeFromWishlist(listingId, btn) {
    console.log("Removing:", listingId);

    const res = await fetch(`/wishlist/${listingId}`, {
        method: "DELETE"
    });

    console.log("Status:", res.status);

    if (!res.ok) {
        alert("Failed to remove from wishlist");
        return;
    }

    btn.closest(".listing-card").remove();
}
