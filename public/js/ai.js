function toggleAI() {
    const popup = document.getElementById("ai-popup");
    popup.style.display = popup.style.display === "flex" ? "none" : "flex";
}

const input = document.getElementById("aiQuery");
if (input) {
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            askAI();
        }
    });
}

async function askAI() {
    const input = document.getElementById("aiQuery");
    const messages = document.getElementById("ai-messages");

    const text = input.value.trim();
    if (!text) return;

    // Character limit (frontend)
    if (text.length > 300) {
        alert("Message too long. Max 300 characters.");
        return;
    }

    messages.innerHTML += `<div class="ai-user">${text}</div>`;
    input.value = "";

    const thinking = document.createElement("div");
    thinking.className = "ai-bot";
    thinking.textContent = "Thinking...";
    messages.appendChild(thinking);
    messages.scrollTop = messages.scrollHeight;

    try {
        const res = await fetch("/ai/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: text })
        });

        const data = await res.json();
        thinking.remove();

        messages.innerHTML += `<div class="ai-bot">${data.response || "No response"}</div>`;
        messages.scrollTop = messages.scrollHeight;

    } catch {
        thinking.remove();
        messages.innerHTML += `<div class="ai-bot">⚠️ Error contacting AI</div>`;
    }
}
