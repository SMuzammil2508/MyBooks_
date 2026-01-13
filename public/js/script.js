document.addEventListener("DOMContentLoaded", () => {
    
    /* -----------------------------
       1. Navbar Scroll Effect
    --------------------------------*/
    const navbar = document.querySelector(".site-header");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 30) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    /* -----------------------------
       2. Typing Animation (Type & Delete Loop)
    --------------------------------*/
    const typingElement = document.getElementById("typing-text");
    if (typingElement) {
        const text = "Read Smart.";
        let i = 0;
        let isDeleting = false;
        
        function typeEffect() {
            const currentText = typingElement.textContent;
            let typeSpeed = 100;

            if (!isDeleting && i < text.length) {
                // Typing...
                typingElement.textContent = text.substring(0, i + 1);
                i++;
            } else if (isDeleting && i > 0) {
                // Deleting...
                typingElement.textContent = text.substring(0, i - 1);
                i--;
                typeSpeed = 50; // Deleting is faster
            }

            // Logic to switch between Typing and Deleting
            if (!isDeleting && i === text.length) {
                // Finished typing. Pause before deleting.
                typeSpeed = 2000; 
                isDeleting = true;
            } else if (isDeleting && i === 0) {
                // Finished deleting. Pause before typing again.
                isDeleting = false;
                typeSpeed = 500;
            }

            setTimeout(typeEffect, typeSpeed);
        }

        typeEffect();
    }

    /* -----------------------------
       3. Unified Scroll Reveal (Fade Up)
    --------------------------------*/
    // Apply class="reveal" to any element you want to fade in
    const reveals = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => revealObserver.observe(el));


    /* -----------------------------
       4. Smart Counters (Only starts when visible)
    --------------------------------*/
    // Apply class="counter" and data-target="500" to numbers
    const counters = document.querySelectorAll(".counter");

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute("data-target");
                const speed = 200; // Higher = Slower
                
                const updateCount = () => {
                    const current = +counter.innerText;
                    const increment = target / speed;

                    if (current < target) {
                        counter.innerText = Math.ceil(current + increment);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
                observer.unobserve(counter); // Run only once
            }
        });
    }, { threshold: 0.5 }); // Start when 50% visible

    counters.forEach(c => counterObserver.observe(c));


    /* -----------------------------
       5. Auto Carousel (Infinite Scroll)
    --------------------------------*/
    const track = document.querySelector(".carousel-track");
    const container = document.querySelector(".carousel"); // Get the container

    if (track && container) {
        // Clone content to ensure seamless loop
        // (Only do this if you haven't already duplicated it manually in HTML)
        const content = track.innerHTML;
        // track.innerHTML += content; // Uncomment this if your loop isn't smooth

        let scrollAmount = 0;
        let speed = 0.5; // Adjust speed here

        function scrollCarousel() {
            scrollAmount += speed;
            
            // Check width dynamically
            const maxScroll = track.scrollWidth / 2; 

            // Reset smoothly
            if (scrollAmount >= maxScroll) {
                scrollAmount = 0;
            }

            track.style.transform = `translate3d(-${scrollAmount}px, 0, 0)`; // translate3d is smoother for GPU
            
            requestAnimationFrame(scrollCarousel);
        }
        scrollCarousel();
    }
});