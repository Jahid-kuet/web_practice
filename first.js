const themeToggle = document.getElementById('themeToggle');
const themeOptions = document.getElementById('themeOptions');
const themeButtons = document.querySelectorAll('.theme-btn');

// Toggle dropdown visibility
themeToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  themeOptions.classList.toggle('active');
});

// Apply selected theme
themeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    document.body.setAttribute('data-theme', theme);
    themeOptions.classList.remove('active');

    // Icon change & color fix
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    themeToggle.style.color = theme === 'dark' ? 'white' : 'black';
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.theme-container')) {
    themeOptions.classList.remove('active');
  }
});

// Typing Effect
const typingText = document.getElementById("typingText");
const words = ["CSE Student", "Web Developer", "Programmer", "Tech Enthusiast"];
let wordIndex = 0;
let charIndex = 0;

function typeEffect() {
  if (charIndex < words[wordIndex].length) {
    typingText.textContent += words[wordIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeEffect, 100);
  } else {
    setTimeout(eraseEffect, 1500);
  }
}

function eraseEffect() {
  if (charIndex > 0) {
    typingText.textContent = words[wordIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseEffect, 50);
  } else {
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeEffect, 300);
  }
}

document.addEventListener("DOMContentLoaded", typeEffect);
// Initialize particles.js on hero background
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 60,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "#ffffff"
        },
        shape: {
          type: "circle"
        },
        opacity: {
          value: 0.5,
          random: false
        },
        size: {
          value: 3,
          random: true
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          out_mode: "out"
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab"
          },
          onclick: {
            enable: true,
            mode: "push"
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.7
            }
          },
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: true
    });
  }
});
// Add floating effect on social icons (optional)
const icons = document.querySelectorAll(".social-icons a");

icons.forEach((icon, i) => {
  icon.addEventListener("mouseover", () => {
    icon.style.transform = "translateX(6px) scale(1.2)";
  });
  icon.addEventListener("mouseout", () => {
    icon.style.transform = "translateX(0) scale(1)";
  });
});

// Fade-in effect on scroll in about section
document.addEventListener("DOMContentLoaded", function () {
  const fadeElements = document.querySelectorAll(".fade_in");
  const socialIcons = document.querySelector(".hero-social-icons");
  const aboutSection = document.querySelector("#about");

  function handleScroll() {
    // Fade in about section
    fadeElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight - 100) {
        el.classList.add("show");
      }
    });

    // Change social icons color when overlapping about section
    const aboutRect = aboutSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (aboutRect.top <= windowHeight / 1.2 && aboutRect.bottom >= 0) {
      socialIcons.classList.add("about-active");
    } else {
      socialIcons.classList.remove("about-active");
    }
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
//education
document.addEventListener("DOMContentLoaded", () => {
  const fadeInSections = document.querySelectorAll(".fade_in");
  const revealOnScroll = () => {
    fadeInSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        section.classList.add("show");
      }
    });
  };
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // Run on load
});
//technical skills
document.addEventListener('DOMContentLoaded', () => {
const cards = document.querySelectorAll('.skill-card');
const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
}
});
}, { threshold: 0.1 });


cards.forEach(card => {
card.classList.add('fade-in');
observer.observe(card);
});
});
//my works
// Fade-in animation when scrolling
document.addEventListener("scroll", () => {
  document.querySelectorAll(".project-card").forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      card.classList.add("visible");
    }
  });
});
//contact
// Fade-in animation on scroll
document.addEventListener("scroll", () => {
  document.querySelectorAll(".contact-info, .contact-form").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add("visible");
    }
  });
});









