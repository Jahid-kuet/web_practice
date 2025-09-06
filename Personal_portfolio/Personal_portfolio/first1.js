// ==== Enhanced Portfolio JavaScript with Session Management ====

// === SESSION & STORAGE MANAGEMENT ===
class PortfolioSession {
    constructor() {
        this.storageKey = 'portfolio_session';
        this.initialize();
    }

    initialize() {
        // Track page views
        this.incrementPageViews();

        // Set visitor session
        if (!sessionStorage.getItem(this.storageKey)) {
            const sessionData = {
                visitTime: Date.now(),
                userAgent: navigator.userAgent,
                referrer: document.referrer,
                sessionId: this.generateSessionId()
            };
            sessionStorage.setItem(this.storageKey, JSON.stringify(sessionData));
        }

        // Load user preferences
        this.loadUserPreferences();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    incrementPageViews() {
        const views = parseInt(localStorage.getItem('portfolio_views') || '0') + 1;
        localStorage.setItem('portfolio_views', views.toString());
    }

    loadUserPreferences() {
        const prefs = JSON.parse(localStorage.getItem('portfolio_preferences') || '{}');

        // Apply theme preference
        if (prefs.theme) {
            this.applyTheme(prefs.theme);
        }

        // Apply font size preference
        if (prefs.fontSize) {
            document.documentElement.style.fontSize = prefs.fontSize;
        }

        // Apply reduced motion preference
        if (prefs.reducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        }
    }

    savePreference(key, value) {
        const prefs = JSON.parse(localStorage.getItem('portfolio_preferences') || '{}');
        prefs[key] = value;
        localStorage.setItem('portfolio_preferences', JSON.stringify(prefs));
    }

    applyTheme(theme) {
        const themes = {
            light: {
                '--bg-color': '#f8fafc',
                '--text-color': '#2d3748',
                '--header-bg': 'rgba(255, 255, 255, 0.95)',
                '--card-bg': '#ffffff'
            },
            dark: {
                '--bg-color': '#1a202c',
                '--text-color': '#f7fafc',
                '--header-bg': 'rgba(26, 32, 44, 0.95)',
                '--card-bg': '#2d3748'
            },
            auto: null // Will use system preference
        };

        if (theme === 'auto') {
            // Remove custom theme and use system preference
            Object.keys(themes.light).forEach(prop => {
                document.documentElement.style.removeProperty(prop);
            });
        } else if (themes[theme]) {
            Object.entries(themes[theme]).forEach(([property, value]) => {
                document.documentElement.style.setProperty(property, value);
            });
        }

        this.savePreference('theme', theme);
    }
}

// Initialize session management
const portfolioSession = new PortfolioSession();

// === PERFORMANCE MONITORING ===
class PerformanceMonitor {
    constructor() {
        this.startTime = performance.now();
        this.metrics = {};
        this.observe();
    }

    observe() {
        // Monitor page load time
        window.addEventListener('load', () => {
            this.metrics.pageLoadTime = performance.now() - this.startTime;
            console.log(`Page loaded in ${this.metrics.pageLoadTime.toFixed(2)}ms`);
        });

        // Monitor LCP (Largest Contentful Paint)
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    getMetrics() {
        return this.metrics;
    }
}

const performanceMonitor = new PerformanceMonitor();

// === ENHANCED TYPING EFFECT ===
class TypewriterEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.options = {
            typeSpeed: 120,
            deleteSpeed: 50,
            pauseTime: 2000,
            loop: true,
            cursor: true,
            ...options
        };

        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isWaiting = false;

        this.init();
    }

    init() {
        // The cursor is now handled by CSS ::after pseudo-element
        this.type();
    }

    type() {
        if (this.isWaiting) return;

        const currentText = this.texts[this.currentTextIndex];

        if (!this.isDeleting) {
            // Typing
            if (this.currentCharIndex < currentText.length) {
                this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
                this.currentCharIndex++;
                setTimeout(() => this.type(), this.options.typeSpeed + Math.random() * 50);
            } else {
                // Finished typing, wait then start deleting
                this.isWaiting = true;
                setTimeout(() => {
                    this.isWaiting = false;
                    this.isDeleting = true;
                    this.type();
                }, this.options.pauseTime);
            }
        } else {
            // Deleting
            if (this.currentCharIndex > 0) {
                this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
                this.currentCharIndex--;
                setTimeout(() => this.type(), this.options.deleteSpeed);
            } else {
                // Finished deleting, move to next text
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), 500);
            }
        }
    }

    destroy() {
        // Remove CSS cursor styling if needed
        this.element.style.borderRight = 'none';
        this.element.style.animation = 'none';
    }
}

// === INTERSECTION OBSERVER FOR ANIMATIONS ===
class AnimationObserver {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        this.init();
    }

    init() {
        // Observe elements with fade-in class
        document.querySelectorAll('.fade-in').forEach(el => {
            this.observer.observe(el);
        });

        // Observe elements with specific animation classes
        document.querySelectorAll('[data-animate]').forEach(el => {
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                if (element.classList.contains('fade-in')) {
                    element.classList.add('visible');
                }

                const animationType = element.dataset.animate;
                if (animationType) {
                    element.classList.add(`animate-${animationType}`);
                }

                // Unobserve after animation
                this.observer.unobserve(element);
            }
        });
    }

    destroy() {
        this.observer.disconnect();
    }
}

// === ENHANCED IMAGE LAZY LOADING ===
class LazyImageLoader {
    constructor() {
        this.imageObserver = new IntersectionObserver(
            (entries) => this.handleImageIntersection(entries),
            { threshold: 0.1, rootMargin: '50px' }
        );
        this.init();
    }

    init() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    handleImageIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                this.loadImage(img);
                this.imageObserver.unobserve(img);
            }
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // Create a new image to preload
        const imageLoader = new Image();

        imageLoader.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };

        imageLoader.onerror = () => {
            img.classList.add('error');
            console.warn(`Failed to load image: ${src}`);
        };

        imageLoader.src = src;
    }
}

// === SMOOTH SCROLL ENHANCEMENT ===
class SmoothScroller {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;

            this.smoothScrollTo(targetPosition);

            // Update URL without triggering scroll
            history.pushState(null, null, targetId);
        }
    }

    smoothScrollTo(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = Math.min(1000, Math.abs(distance) * 0.5);
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);

            window.scrollTo(0, run);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
}

// === THEME MANAGEMENT ===
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        const themeToggle = document.getElementById("themeToggle");
        const themeOptions = document.getElementById("themeOptions");

        if (themeToggle && themeOptions) {
            // Load saved theme
            const savedTheme = localStorage.getItem('portfolio_theme') || 'auto';
            this.setTheme(savedTheme);

            themeToggle.addEventListener("click", (e) => {
                e.stopPropagation();
                themeOptions.classList.toggle('show');
            });

            // Close theme options when clicking outside
            document.addEventListener('click', (e) => {
                if (!themeToggle.contains(e.target) && !themeOptions.contains(e.target)) {
                    themeOptions.classList.remove('show');
                }
            });

            // Theme selection
            document.querySelectorAll(".theme-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const theme = e.target.dataset.theme;
                    this.setTheme(theme);
                    themeOptions.classList.remove('show');
                });
            });
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        portfolioSession.applyTheme(theme);

        // Update theme toggle text and icon
        const themeToggle = document.getElementById("themeToggle");
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('i');
            const themeText = themeToggle.querySelector('span');

            if (themeIcon) {
                switch (theme) {
                    case 'light':
                        themeIcon.className = 'fas fa-sun';
                        break;
                    case 'dark':
                        themeIcon.className = 'fas fa-moon';
                        break;
                    case 'auto':
                        themeIcon.className = 'fas fa-adjust';
                        break;
                    default:
                        themeIcon.className = 'fas fa-palette';
                }
            }
        }

        // Update active theme button
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });

        // Save preference
        localStorage.setItem('portfolio_theme', theme);
    }
}

// === CONTACT FORM ENHANCEMENT ===
class ContactForm {
    constructor() {
        this.form = document.querySelector(".contact-form");
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener("submit", (e) => this.handleSubmit(e));

        // Add real-time validation
        this.form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) return;

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        this.showLoading();

        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            this.hideLoading();
            this.showMessage("Thank you for reaching out! I'll get back to you soon.", "success");
            this.form.reset();
        }, 2000);
    }

    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input[required], textarea[required]');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Show/hide error
        if (!isValid) {
            this.showFieldError(field, message);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--error)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';

        field.parentNode.appendChild(errorElement);
        field.style.borderColor = 'var(--error)';
    }

    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    }

    showLoading() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
    }

    hideLoading() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    }

    showMessage(message, type = 'info') {
        let msgElement = document.getElementById("contactMsg");

        if (!msgElement) {
            msgElement = document.createElement("div");
            msgElement.id = "contactMsg";
            msgElement.style.marginTop = "1rem";
            msgElement.style.padding = "0.75rem";
            msgElement.style.borderRadius = "0.5rem";
            msgElement.style.fontWeight = "500";
            this.form.appendChild(msgElement);
        }

        msgElement.textContent = message;
        msgElement.style.background = type === 'success' ?
            'rgba(81, 207, 102, 0.1)' : 'rgba(255, 107, 107, 0.1)';
        msgElement.style.color = type === 'success' ?
            'var(--success)' : 'var(--error)';
        msgElement.style.border = `1px solid ${type === 'success' ? 'var(--success)' : 'var(--error)'}`;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (msgElement.parentNode) {
                msgElement.remove();
            }
        }, 5000);
    }
}

// === BACK TO TOP BUTTON ===
class BackToTop {
    constructor() {
        this.button = document.getElementById("backToTop");
        this.init();
    }

    init() {
        if (!this.button) return;

        window.addEventListener("scroll", () => this.handleScroll());
        this.button.addEventListener("click", () => this.scrollToTop());
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const threshold = 300;

        if (scrolled > threshold) {
            this.button.style.display = "flex";
            this.button.style.opacity = "1";
        } else {
            this.button.style.opacity = "0";
            setTimeout(() => {
                if (window.pageYOffset <= threshold) {
                    this.button.style.display = "none";
                }
            }, 300);
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}

// === NAVIGATION ENHANCEMENTS ===
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById("navbar");
        this.navToggle = document.getElementById("navToggle");
        this.adminMenuBtn = document.getElementById("adminMenuBtn");
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupActiveNavigation();
        this.setupAdminAccess();
    }

    setupMobileMenu() {
        if (this.navToggle && this.navbar) {
            this.navToggle.addEventListener("click", () => {
                this.navbar.classList.toggle("active");
                this.navToggle.classList.toggle("open");

                // Prevent body scroll when menu is open
                document.body.style.overflow = this.navbar.classList.contains("active") ? "hidden" : "";
            });

            // Close menu when clicking nav links
            this.navbar.querySelectorAll("a").forEach(link => {
                link.addEventListener("click", () => {
                    if (window.innerWidth < 900) {
                        this.navbar.classList.remove("active");
                        this.navToggle.classList.remove("open");
                        document.body.style.overflow = "";
                    }
                });
            });

            // Close menu when clicking outside
            document.addEventListener("click", (e) => {
                if (!this.navbar.contains(e.target) && !this.navToggle.contains(e.target)) {
                    this.navbar.classList.remove("active");
                    this.navToggle.classList.remove("open");
                    document.body.style.overflow = "";
                }
            });
        }
    }

    setupActiveNavigation() {
        const navLinks = document.querySelectorAll("#navbar a");
        const sections = document.querySelectorAll("section[id]");

        if (navLinks.length === 0 || sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const currentSection = entry.target.id;
                        navLinks.forEach(link => {
                            link.classList.remove("active");
                            if (link.getAttribute("href") === `#${currentSection}`) {
                                link.classList.add("active");
                            }
                        });
                    }
                });
            },
            { threshold: 0.3, rootMargin: "-100px 0px -100px 0px" }
        );

        sections.forEach(section => observer.observe(section));
    }

    setupAdminAccess() {
        if (this.adminMenuBtn) {
            this.adminMenuBtn.addEventListener("click", () => {
                // Add loading state
                this.adminMenuBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                setTimeout(() => {
                    window.location.href = "admin.html";
                }, 500);
            });
        }
    }
}

// === IMAGE MODAL ENHANCEMENT ===
class ImageModal {
    constructor() {
        this.modal = document.getElementById("imgModal");
        this.modalImg = document.getElementById("modalImage");
        this.closeBtn = document.querySelector(".modal .close");
        this.init();
    }

    init() {
        if (!this.modal || !this.modalImg) return;

        // Add click listeners to images
        document.querySelectorAll(".project-card img, .cert-card img, [data-modal-image]").forEach(img => {
            img.addEventListener("click", (e) => this.openModal(e));
            img.style.cursor = "zoom-in";
        });

        // Close modal events
        if (this.closeBtn) {
            this.closeBtn.addEventListener("click", () => this.closeModal());
        }

        this.modal.addEventListener("click", (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.modal.classList.contains("active")) {
                this.closeModal();
            }
        });
    }

    openModal(e) {
        const img = e.target;
        this.modal.classList.add("active");
        this.modalImg.src = img.src;
        this.modalImg.alt = img.alt || "";

        // Prevent body scroll
        document.body.style.overflow = "hidden";

        // Add loading class
        this.modalImg.classList.add("loading");

        this.modalImg.onload = () => {
            this.modalImg.classList.remove("loading");
        };
    }

    closeModal() {
        this.modal.classList.remove("active");
        this.modalImg.src = "";
        document.body.style.overflow = "";
    }
}

// === INITIALIZE ALL COMPONENTS ===
document.addEventListener("DOMContentLoaded", function () {
    // Initialize typing effect
    const typingElement = document.getElementById("typingText");
    if (typingElement) {
        new TypewriterEffect(typingElement, [
            "Mobile Engineer",
            "Full-Stack Developer",
            "AI Enthusiast",
            "Problem Solver"
        ]);
    }

    // Initialize all components
    new AnimationObserver();
    new LazyImageLoader();
    new SmoothScroller();
    new ThemeManager();
    new ContactForm();
    new BackToTop();
    new NavigationManager();
    new ImageModal();

    // Hero image touch effect for mobile
    const heroImg = document.querySelector("#myimg img");
    if (heroImg) {
        heroImg.addEventListener("touchstart", () => {
            heroImg.classList.add("img-tap");
            setTimeout(() => heroImg.classList.remove("img-tap"), 400);
        });
    }

    // Add performance metrics to console (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setTimeout(() => {
            console.table(performanceMonitor.getMetrics());
        }, 3000);
    }
});

// === ERROR HANDLING ===
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);

    // Optional: Send error to analytics service
    // analytics.track('js_error', { message: e.message, filename: e.filename, lineno: e.lineno });
});

// === EXPOSE USEFUL UTILITIES ===
window.PortfolioUtils = {
    session: portfolioSession,
    performance: performanceMonitor,
    scrollTo: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },
    showNotification: (message, type = 'info') => {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      max-width: 300px;
    `;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }
};