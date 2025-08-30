// ==== Typing effect ====
const typingText = document.getElementById("typingText");
const roles = ["Mobile Engineer", "Full-Stack Developer", "AI Enthusiast"];
let roleIndex = 0;
let charIndex = 0;

function typeRole() {
    if (charIndex < roles[roleIndex].length) {
        typingText.textContent += roles[roleIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeRole, 120);
    } else {
        setTimeout(eraseRole, 2000);
    }
}
function eraseRole() {
    if (charIndex > 0) {
        typingText.textContent = roles[roleIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseRole, 50);
    } else {
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 500);
    }
}
typeRole();

// ==== Theme Toggle ====
const themeToggle = document.getElementById("themeToggle");
const themeOptions = document.getElementById("themeOptions");

themeToggle.addEventListener("click", () => {
    themeOptions.style.display =
        themeOptions.style.display === "flex" ? "none" : "flex";
});

document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", e => {
        const theme = e.target.dataset.theme;
        if (theme === "light") {
            document.documentElement.style.setProperty("--bg-color", "#f9f9f9");
            document.documentElement.style.setProperty("--text-color", "#333");
            document.documentElement.style.setProperty("--header-bg", "#fff");
            document.documentElement.style.setProperty("--card-bg", "#fff");
        } else if (theme === "dark") {
            document.documentElement.style.setProperty("--bg-color", "#1e1e1e");
            document.documentElement.style.setProperty("--text-color", "#f9f9f9");
            document.documentElement.style.setProperty("--header-bg", "#2a2a2a");
            document.documentElement.style.setProperty("--card-bg", "#2e2e2e");
        }
        themeOptions.style.display = "none";
    });
});

// ==== Image Modal Preview ====
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImage");
const closeModal = document.querySelector(".modal .close");

document.querySelectorAll(".project-card img, .cert-card img").forEach(img => {
    img.addEventListener("click", e => {
        modal.style.display = "block";
        modalImg.src = e.target.src;
    });
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});
window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
});

// ==== FADE-IN ON SCROLL ====
const faders = document.querySelectorAll(".fade-in");

const appearOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

// ==== Back To Top ====
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
// ==== Smooth Scroll for Nav Links ====
document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        target.scrollIntoView({ behavior: "smooth" });
    });
});

// ...existing code...

// Contact form validation and feedback
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".contact-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            // Only show message, don't actually send email for demo
            e.preventDefault();
            // Simple validation
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();
            if (!name || !email || !message) {
                showContactMessage("Please fill in all fields.", false);
                return;
            }
            // Show success message
            showContactMessage("Thank you for reaching out! I'll get back to you soon.", true);
            form.reset();
        });
    }

    function showContactMessage(msg, success) {
        let msgDiv = document.getElementById("contactMsg");
        if (!msgDiv) {
            msgDiv = document.createElement("div");
            msgDiv.id = "contactMsg";
            msgDiv.style.marginTop = "12px";
            msgDiv.style.fontWeight = "500";
            form.appendChild(msgDiv);
        }
        msgDiv.textContent = msg;
        msgDiv.style.color = success ? "#0077b5" : "#e53e3e";
    }
});

// ...existing code...