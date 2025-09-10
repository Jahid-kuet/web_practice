// --- Modern Admin Panel with Session Management ---
document.addEventListener("DOMContentLoaded", function () {
    // Initialize session management
    initializeSession();

    // Initialize admin panel
    initializeAdminPanel();
});

// === SESSION MANAGEMENT ===
class SessionManager {
    constructor() {
        this.sessionKey = 'admin_session';
        this.cookieExpiry = 24 * 60 * 60 * 1000; // 24 hours
    }

    // Set session with cookie backup
    setSession(data) {
        const sessionData = {
            ...data,
            timestamp: Date.now(),
            expiry: Date.now() + this.cookieExpiry
        };

        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        this.setCookie(this.sessionKey, JSON.stringify(sessionData), 1);
    }

    // Get session from localStorage or cookie
    getSession() {
        let session = localStorage.getItem(this.sessionKey);

        if (!session) {
            session = this.getCookie(this.sessionKey);
            if (session) {
                localStorage.setItem(this.sessionKey, session);
            }
        }

        if (session) {
            const data = JSON.parse(session);
            if (Date.now() > data.expiry) {
                this.clearSession();
                return null;
            }
            return data;
        }
        return null;
    }

    // Clear session and cookies
    clearSession() {
        localStorage.removeItem(this.sessionKey);
        this.deleteCookie(this.sessionKey);
    }

    // Set cookie
    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
    }

    // Get cookie
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Delete cookie
    deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    // Check if user is logged in
    isLoggedIn() {
        const session = this.getSession();
        return session && session.loggedIn === true;
    }
}

const sessionManager = new SessionManager();

// === NOTIFICATION SYSTEM ===
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
    <span>${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;

    // Add notification styles if not exists
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
      }
      .notification-success { border-left: 4px solid #22c55e; }
      .notification-error { border-left: 4px solid #ef4444; }
      .notification-warning { border-left: 4px solid #f59e0b; }
      .notification-info { border-left: 4px solid #3b82f6; }
      .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        opacity: 0.5;
        margin-left: auto;
      }
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    if (duration > 0) {
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

function initializeSession() {
    const loginModal = document.getElementById("loginModal");

    // No client-side seeding of secrets; rely on server-side configuration

    // Check session on load
    if (sessionManager.isLoggedIn()) {
        loginModal.classList.remove("active");
        updateLastActiveTime();
    } else {
        loginModal.classList.add("active");
    }

    // Auto-logout on inactivity (30 minutes)
    let inactivityTimer;
    const inactivityTime = 30 * 60 * 1000; // 30 minutes

    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        updateLastActiveTime();
        inactivityTimer = setTimeout(() => {
            if (sessionManager.isLoggedIn()) {
                sessionManager.clearSession();
                showNotification('Session expired due to inactivity', 'warning');
                setTimeout(() => location.reload(), 2000);
            }
        }, inactivityTime);
    }

    // Track user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
        document.addEventListener(event, resetInactivityTimer, true);
    });

    // Update last active time
    function updateLastActiveTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        const element = document.getElementById('lastUpdated');
        if (element) {
            element.textContent = timeStr;
        }
    }
}

function initializeAdminPanel() {
    // Initialize theme toggle
    initializeThemeToggle();

    // Initialize login functionality
    initializeLogin();

    // Initialize navigation
    initializeNavigation();

    // Initialize CRUD operations
    initializeUsers();
    initializeSkills();
    initializeProjects();
    initializeCertifications();

    // Initialize password management
    initializePasswordManagement();

    // Load initial data
    // Sync from server first, then render dashboard
    if (typeof syncFromServer === 'function') {
        syncFromServer().finally(() => {
            loadDashboardData();
        });
    } else {
        loadDashboardData();
    }
}

// === THEME MANAGEMENT ===
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    if (!themeToggle) return;

    // Load saved theme
    const savedTheme = localStorage.getItem('admin_theme') || 'light';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('admin_theme', newTheme);
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Light';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Dark';
        }
    }
}

// === LOGIN MANAGEMENT ===
function initializeLogin() {
    const loginForm = document.getElementById("adminLoginForm");
    const loginMsg = document.getElementById("adminLoginMsg");
    const forgotPasswordModal = document.getElementById("forgotPasswordModal");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const forgotPasswordMsg = document.getElementById("forgotPasswordMsg");
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const backToLoginLink = document.getElementById("backToLoginLink");
    const loginModal = document.getElementById("loginModal");

    // Login Form Handler
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = loginForm.username.value.trim();
            const password = loginForm.password.value.trim();
            (async () => {
                const resp = await callWebMethod('AuthenticateAdmin', { username, password });
                if (!resp || resp.success !== true) {
                    loginMsg.innerHTML = '<i class="fas fa-times-circle"></i> Invalid username or password.';
                    loginMsg.style.color = "#ef4444";
                    loginMsg.style.background = "rgba(239, 68, 68, 0.1)";
                    showNotification(resp && resp.message ? resp.message : 'Invalid credentials', 'error');
                    return;
                }

                loginMsg.innerHTML = '<i class="fas fa-check-circle"></i> Login successful!';
                loginMsg.style.color = "#22c55e";
                loginMsg.style.background = "rgba(34, 197, 94, 0.1)";

                // Set client session
                sessionManager.setSession({
                    loggedIn: true,
                    username: username,
                    loginTime: Date.now()
                });

                // Prime cache from server
                try { await syncFromServer(); } catch(e) {}

                setTimeout(() => {
                    loginModal.classList.remove("active");
                    showNotification('Welcome back, Admin!', 'success');
                    loadDashboardData();
                }, 600);
            })();
        });
    }

    // Forgot Password Modal
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", (e) => {
            e.preventDefault();
            loginModal.classList.remove("active");
            forgotPasswordModal.classList.add("active");
            forgotPasswordForm.reset();
            forgotPasswordMsg.textContent = "";
        });
    }

    if (backToLoginLink) {
        backToLoginLink.addEventListener("click", (e) => {
            e.preventDefault();
            forgotPasswordModal.classList.remove("active");
            loginModal.classList.add("active");
            loginForm.reset();
            loginMsg.textContent = "";
        });
    }

    // Forgot Password Form Handler
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const secretKey = document.getElementById("secret-key").value.trim();
            const newPassword = document.getElementById("new-password").value.trim();
            const confirmPassword = document.getElementById("confirm-password").value.trim();

            if (newPassword.length < 4) {
                forgotPasswordMsg.innerHTML = '<i class="fas fa-times-circle"></i> Password must be at least 4 characters.';
                forgotPasswordMsg.style.color = "#ef4444";
                forgotPasswordMsg.style.background = "rgba(239, 68, 68, 0.1)";
                return;
            }

            if (newPassword !== confirmPassword) {
                forgotPasswordMsg.innerHTML = '<i class="fas fa-times-circle"></i> Passwords do not match.';
                forgotPasswordMsg.style.color = "#ef4444";
                forgotPasswordMsg.style.background = "rgba(239, 68, 68, 0.1)";
                return;
            }

            const resp = await callWebMethod('ResetPasswordWithSecret', { secretKey, newPassword });
            if (!resp || resp.success !== true) {
                forgotPasswordMsg.innerHTML = `<i class=\"fas fa-times-circle\"></i> ${resp && resp.message ? resp.message : 'Password reset failed'}`;
                forgotPasswordMsg.style.color = "#ef4444";
                forgotPasswordMsg.style.background = "rgba(239, 68, 68, 0.1)";
                return;
            }

            forgotPasswordMsg.innerHTML = '<i class="fas fa-check-circle"></i> Password reset successfully!';
            forgotPasswordMsg.style.color = "#22c55e";
            forgotPasswordMsg.style.background = "rgba(34, 197, 94, 0.1)";

            setTimeout(() => {
                forgotPasswordModal.classList.remove("active");
                loginModal.classList.add("active");
                showNotification('Password reset successfully! Please login with your new password.', 'success');
            }, 1200);
        });
    }
}

// === NAVIGATION ===
function initializeNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const contentSections = document.querySelectorAll(".content-section");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.getElementById("sidebar");
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");

    // Navigation switching
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const section = item.getAttribute("data-section");

            if (section) {
                // Remove active class from all nav items and sections
                navItems.forEach(nav => nav.classList.remove("active"));
                contentSections.forEach(sec => sec.classList.remove("active"));

                // Add active class to clicked nav item and corresponding section
                item.classList.add("active");
                const targetSection = document.getElementById(`${section}-section`);
                if (targetSection) {
                    targetSection.classList.add("active");

                    // Load section-specific data
                    switch (section) {
                        case 'dashboard':
                            loadDashboardData();
                            break;
                        case 'users':
                            renderUsersTable();
                            break;
                        case 'skills':
                            renderSkillsTable();
                            break;
                        case 'projects':
                            renderProjectsTable();
                            renderProjectsGrid();
                            break;
                        case 'certifications':
                            renderCertificationsTable();
                            break;
                    }
                }

                // Close mobile sidebar
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove("active");
                }
            }
        });
    });

    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", () => {
            sidebar.classList.add("active");
        });
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener("click", () => {
            sidebar.classList.remove("active");
        });
    }

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            (async () => {
                try { await callWebMethod('Logout', {}); } catch {}
                sessionManager.clearSession();
                showNotification('Logged out successfully', 'info');
                setTimeout(() => location.reload(), 800);
            })();
        });
    }
}

// === PASSWORD MANAGEMENT ===
function initializePasswordManagement() {
    const pwdModal = document.getElementById("pwdModal");
    const pwdForm = document.getElementById("pwdForm");
    const changePwdLink = document.getElementById("changePwdLink");
    const cancelPwdBtn = document.getElementById("cancelPwdBtn");
    const pwdMsg = document.getElementById("pwdMsg");

    if (changePwdLink) {
        changePwdLink.addEventListener("click", (e) => {
            e.preventDefault();
            pwdForm.reset();
            pwdMsg.textContent = "";
            pwdModal.classList.add("active");
        });
    }

    if (cancelPwdBtn) {
        cancelPwdBtn.addEventListener("click", () => {
            pwdModal.classList.remove("active");
        });
    }

    if (pwdForm) {
        pwdForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const oldPwd = document.getElementById("oldPwd").value.trim();
            const newPwd = document.getElementById("newPwd").value.trim();

            if (newPwd.length < 4) {
                pwdMsg.innerHTML = '<i class="fas fa-times-circle"></i> New password must be at least 4 characters.';
                pwdMsg.style.color = "#ef4444";
                pwdMsg.style.background = "rgba(239, 68, 68, 0.1)";
                return;
            }

            (async () => {
                const resp = await callWebMethod('ChangePassword', { currentPassword: oldPwd, newPassword: newPwd });
                if (!resp || resp.success !== true) {
                    pwdMsg.innerHTML = `<i class=\"fas fa-times-circle\"></i> ${resp && resp.message ? resp.message : 'Password update failed'}`;
                    pwdMsg.style.color = "#ef4444";
                    pwdMsg.style.background = "rgba(239, 68, 68, 0.1)";
                    return;
                }

                pwdMsg.innerHTML = '<i class="fas fa-check-circle"></i> Password updated successfully!';
                pwdMsg.style.color = "#22c55e";
                pwdMsg.style.background = "rgba(34, 197, 94, 0.1)";
                showNotification('Password updated. Please log in again with your new password.', 'success');

                try { await callWebMethod('Logout', {}); } catch {}
                sessionManager.clearSession();
                setTimeout(() => { window.location.reload(); }, 1200);
            })();
        });
    }
}

// === DATA STORAGE ===
class DataStore {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Initialize users if not exists
        if (!localStorage.getItem('admin_users')) {
            const defaultUsers = [
                { id: 1, name: "Jahid Hasan", email: "jahid@email.com", role: "Admin" },
                { id: 2, name: "Jane Doe", email: "jane@email.com", role: "Editor" }
            ];
            localStorage.setItem('admin_users', JSON.stringify(defaultUsers));
        }

        // Initialize skills if not exists
        if (!localStorage.getItem('admin_skills')) {
            const defaultSkills = [
                { id: 1, name: "JavaScript", category: "Programming Languages", proficiency: "Expert", icon: "fab fa-js-square", imageUrl: "img/java-script.png" },
                { id: 2, name: "Python", category: "Programming Languages", proficiency: "Advanced", icon: "fab fa-python", imageUrl: "img/python.png" },
                { id: 3, name: "React", category: "Frameworks & Libraries", proficiency: "Advanced", icon: "fab fa-react", imageUrl: "" },
                { id: 4, name: "Node.js", category: "Frameworks & Libraries", proficiency: "Intermediate", icon: "fab fa-node-js", imageUrl: "" }
            ];
            localStorage.setItem('admin_skills', JSON.stringify(defaultSkills));
        }

        // Initialize projects if not exists
        if (!localStorage.getItem('admin_projects')) {
            const defaultProjects = [
                {
                    id: 1,
                    title: "E-commerce API",
                    category: "Web API",
                    technologies: "Node.js, Express, MongoDB",
                    status: "Completed",
                    image: "img/ecommerce_api.jpg",
                    liveUrl: "",
                    githubUrl: "",
                    description: "RESTful API for e-commerce platform with user authentication, product management, and order processing."
                },
                {
                    id: 2,
                    title: "Face Detection System",
                    category: "AI/ML",
                    technologies: "Python, OpenCV, TensorFlow",
                    status: "In Progress",
                    image: "img/face_detection.png",
                    liveUrl: "",
                    githubUrl: "",
                    description: "Real-time face detection and recognition system using deep learning techniques."
                }
            ];
            localStorage.setItem('admin_projects', JSON.stringify(defaultProjects));
        }

        // Initialize certifications if not exists
        if (!localStorage.getItem('admin_certifications')) {
            const defaultCerts = [
                {
                    id: 1,
                    title: "Dean's List Achievement",
                    type: "Achievement",
                    issuer: "KUET",
                    date: "2023-12-15",
                    expiryDate: "",
                    image: "img/deans1.jpg",
                    verificationUrl: "",
                    description: "Academic excellence recognition for outstanding performance."
                }
            ];
            localStorage.setItem('admin_certifications', JSON.stringify(defaultCerts));
        }
    }

    get(key) {
        const data = localStorage.getItem(`admin_${key}`);
        return data ? JSON.parse(data) : [];
    }

    set(key, data) {
        localStorage.setItem(`admin_${key}`, JSON.stringify(data));
        this.updateActivity(`Updated ${key}`);
    }

    add(key, item) {
        const data = this.get(key);
        const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
        item.id = newId;
        data.push(item);
        this.set(key, data);
        return item;
    }

    update(key, id, updatedItem) {
        const data = this.get(key);
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updatedItem };
            this.set(key, data);
            return data[index];
        }
        return null;
    }

    delete(key, id) {
        const data = this.get(key);
        const filteredData = data.filter(item => item.id !== id);
        this.set(key, filteredData);
        return true;
    }

    updateActivity(action) {
        const activities = JSON.parse(localStorage.getItem('admin_activities') || '[]');
        activities.unshift({
            action,
            timestamp: new Date().toLocaleString()
        });
        // Keep only last 10 activities
        activities.splice(10);
        localStorage.setItem('admin_activities', JSON.stringify(activities));
    }
}

const dataStore = new DataStore();

// ===== Server Integration & Live Refresh =====
async function callWebMethod(method, payload) {
    try {
        const res = await fetch(`admin.aspx/${method}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin',
            body: JSON.stringify(payload || {})
        });
        const status = res.status;
        let text = await res.text();
        // If the response looks like HTML (e.g., redirected login page), treat as auth error
        if (!res.ok || (text && /<\s*html[\s>]/i.test(text))) {
            return { success: false, requireAuth: true, message: 'Authentication required or server error.' };
        }
        // WebForms PageMethods often return { d: "...json..." } or { d: { ... } }
        try {
            const parsed = JSON.parse(text);
            if (parsed && typeof parsed === 'object' && parsed.hasOwnProperty('d')) {
                if (typeof parsed.d === 'string') {
                    try { return JSON.parse(parsed.d); } catch { return { success: false, message: parsed.d }; }
                }
                return parsed.d;
            }
            return parsed;
        } catch (e) {
            // Some WebMethods already serialize to JSON string
            try { return JSON.parse(text); } catch { return { success: false, message: text }; }
        }
    } catch (err) {
        return { success: false, message: err.message || 'Request failed' };
    }
}

function broadcastChange(section) {
    try { if (window.notifyDataChanged) window.notifyDataChanged(section || 'all'); } catch (e) {}
}

async function syncFromServer() {
    // Skills
    try {
        const sk = await callWebMethod('GetAllSkills', {});
        if (sk && sk.success && sk.data) {
            const skills = sk.data.map(s => ({
                id: s.SkillID,
                name: s.SkillName,
                category: s.CategoryName,
                proficiency: s.SkillLevel,
                imageUrl: s.IconImage,
                icon: s.IconImage,
                description: s.SkillDescription || '',
                displayOrder: s.DisplayOrder || 0,
                isActive: s.IsActive === true || s.IsActive === 1
            }));
            localStorage.setItem('admin_skills', JSON.stringify(skills));
        }
    } catch {}

    // Projects
    try {
        const pj = await callWebMethod('GetAllProjects', {});
        if (pj && pj.success && pj.data) {
            const projects = pj.data.map(p => ({
                id: p.ProjectID,
                title: p.ProjectTitle,
                description: p.ProjectDescription || '',
                image: p.ProjectImage || '',
                githubUrl: p.GitHubLink || '',
                liveUrl: p.LiveDemoLink || '',
                technologies: p.TechStack || '',
                category: p.ProjectType || 'Web Development',
                status: (p.IsCompleted ? 'Completed' : 'In Progress'),
                isFeatured: !!p.IsFeatured,
                displayOrder: p.DisplayOrder || 0
            }));
            localStorage.setItem('admin_projects', JSON.stringify(projects));
        }
    } catch {}

    // Certifications
    try {
        const cf = await callWebMethod('GetAllCertifications', {});
        if (cf && cf.success && cf.data) {
            const certs = cf.data.map(c => ({
                id: c.CertID,
                title: c.CertTitle,
                description: c.CertDescription || '',
                image: c.CertImage || '',
                issuer: c.IssuingOrganization || '',
                date: c.IssueDate || '',
                expiryDate: c.ExpiryDate || '',
                verificationUrl: c.CertificateLink || '',
                type: c.CertType || 'Certification',
                credentialId: c.CredentialID || '',
                isFeatured: !!c.IsFeatured,
                displayOrder: c.DisplayOrder || 0
            }));
            localStorage.setItem('admin_certifications', JSON.stringify(certs));
        }
    } catch {}
}

// Patch DataStore methods to persist to server and live-refresh
(function(){
    const origAdd = dataStore.add.bind(dataStore);
    const origUpdate = dataStore.update.bind(dataStore);
    const origDelete = dataStore.delete.bind(dataStore);

    dataStore.add = async function(key, item){
        try {
            if (key === 'skills') {
                const payload = {
                    skillName: item.name,
                    categoryName: item.category,
                    skillLevel: item.proficiency,
                    iconImage: item.imageUrl || item.icon || '',
                    skillDescription: item.description || '',
                    displayOrder: item.displayOrder || 0
                };
                const r = await callWebMethod('AddSkill', payload);
                if (!r || r.success !== true) throw new Error(r && r.message || 'Add skill failed');
            } else if (key === 'projects') {
                const payload = {
                    projectTitle: item.title,
                    projectDescription: item.description || '',
                    projectImage: item.image || '',
                    gitHubLink: item.githubUrl || '',
                    liveDemoLink: item.liveUrl || '',
                    techStack: item.technologies || '',
                    projectType: item.category || 'Web Development',
                    startDate: '',
                    endDate: '',
                    isCompleted: (item.status || '').toLowerCase() === 'completed',
                    isFeatured: !!item.isFeatured,
                    displayOrder: item.displayOrder || 0
                };
                const r = await callWebMethod('AddProject', payload);
                if (!r || r.success !== true) throw new Error(r && r.message || 'Add project failed');
            } else if (key === 'certifications') {
                const payload = {
                    certTitle: item.title,
                    certDescription: item.description || '',
                    certImage: item.image || '',
                    issuingOrganization: item.issuer || '',
                    issueDate: item.date || '',
                    expiryDate: item.expiryDate || '',
                    certificateLink: item.verificationUrl || '',
                    certType: item.type || 'Certification',
                    credentialId: item.credentialId || '',
                    isFeatured: !!item.isFeatured,
                    displayOrder: item.displayOrder || 0
                };
                const r = await callWebMethod('AddCertification', payload);
                if (!r || r.success !== true) throw new Error(r && r.message || 'Add certification failed');
            }
        } catch(e) {
            showNotification(e.message || 'Add failed', 'error');
        }
        // Always refresh from server for authoritative data/IDs
        await syncFromServer();
        broadcastChange(key);
        return true;
    };

    dataStore.update = async function(key, id, updated){
        try {
            if (key === 'skills') {
                const payload = {
                    skillId: id,
                    skillName: updated.name,
                    categoryName: updated.category,
                    skillLevel: updated.proficiency,
                    iconImage: updated.imageUrl || updated.icon || '',
                    skillDescription: updated.description || '',
                    displayOrder: updated.displayOrder || 0,
                    isActive: updated.isActive !== false
                };
                const r = await callWebMethod('UpdateSkill', payload);
                if (!r || r.success !== true) throw new Error(r && r.message || 'Update skill failed');
            } else if (key === 'projects') {
                const payload = {
                    projectId: id,
                    projectTitle: updated.title,
                    projectDescription: updated.description || '',
                    projectImage: updated.image || '',
                    gitHubLink: updated.githubUrl || '',
                    liveDemoLink: updated.liveUrl || '',
                    techStack: updated.technologies || '',
                    projectType: updated.category || 'Web Development',
                    startDate: '',
                    endDate: '',
                    isCompleted: (updated.status || '').toLowerCase() === 'completed',
                    isFeatured: !!updated.isFeatured,
                    displayOrder: updated.displayOrder || 0,
                    isActive: updated.isActive !== false
                };
                const r = await callWebMethod('UpdateProject', payload);
                if (!r || r.success !== true) throw new Error(r && r.message || 'Update project failed');
            } else if (key === 'certifications') {
                const payload = {
                    certId: id,
                    certTitle: updated.title,
                    certDescription: updated.description || '',
                    certImage: updated.image || '',
                    issuingOrganization: updated.issuer || '',
                    issueDate: updated.date || '',
                    expiryDate: updated.expiryDate || '',
                    certificateLink: updated.verificationUrl || '',
                    certType: updated.type || 'Certification',
                    credentialId: updated.credentialId || '',
                    isFeatured: !!updated.isFeatured,
                    displayOrder: updated.displayOrder || 0,
                    isActive: updated.isActive !== false
                };
                const r = await callWebMethod('UpdateCertification', payload);
                if (!r || r.success !== true) throw new Error(r && r.message || 'Update certification failed');
            }
        } catch(e) {
            showNotification(e.message || 'Update failed', 'error');
        }
        await syncFromServer();
        broadcastChange(key);
        return true;
    };

    dataStore.delete = async function(key, id){
        try {
            if (key === 'skills') {
                const r = await callWebMethod('DeleteSkill', { skillId: id });
                if (!r || r.success !== true) throw new Error(r && r.message || 'Delete skill failed');
            } else if (key === 'projects') {
                const r = await callWebMethod('DeleteProject', { projectId: id });
                if (!r || r.success !== true) throw new Error(r && r.message || 'Delete project failed');
            } else if (key === 'certifications') {
                const r = await callWebMethod('DeleteCertification', { certId: id });
                if (!r || r.success !== true) throw new Error(r && r.message || 'Delete certification failed');
            }
            // Update local after server success to avoid UI drift
            origDelete(key, id);
        } catch(e) {
            showNotification(e.message || 'Delete failed', 'error');
        }
        await syncFromServer();
        broadcastChange(key);
        return true;
    };
})();

// === DASHBOARD ===
function loadDashboardData() {
    // Update counts
    const users = dataStore.get('users');
    const skills = dataStore.get('skills');
    const projects = dataStore.get('projects');
    const certifications = dataStore.get('certifications');

    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalSkills').textContent = skills.length;
    document.getElementById('totalProjects').textContent = projects.length;
    document.getElementById('totalCerts').textContent = certifications.length;

    // Update recent activities
    const activities = JSON.parse(localStorage.getItem('admin_activities') || '[]');
    const activityList = document.getElementById('recentActivity');
    if (activityList) {
        activityList.innerHTML = activities.length > 0
            ? activities.map(activity => `<li><i class="fas fa-clock"></i> ${activity.action} - ${activity.timestamp}</li>`).join('')
            : '<li><i class="fas fa-info"></i> No recent activities</li>';
    }
}

// === USERS MANAGEMENT ===
function initializeUsers() {
    const addUserBtn = document.getElementById("addUserBtn");
    const userModal = document.getElementById("userModal");
    const userForm = document.getElementById("userForm");
    const cancelUserBtn = document.getElementById("cancelUserBtn");
    const userFormTitle = document.getElementById("userFormTitle");

    let editingUserId = null;

    if (addUserBtn) {
        addUserBtn.addEventListener("click", () => {
            editingUserId = null;
            userFormTitle.innerHTML = '<i class="fas fa-user-plus"></i> Add User';
            userForm.reset();
            userModal.classList.add("active");
        });
    }

    if (cancelUserBtn) {
        cancelUserBtn.addEventListener("click", () => {
            userModal.classList.remove("active");
        });
    }

    if (userForm) {
        userForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("userName").value.trim();
            const email = document.getElementById("userEmail").value.trim();
            const role = document.getElementById("userRole").value.trim();

            if (!name || !email || !role) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            const userData = { name, email, role };

            if (editingUserId) {
                dataStore.update('users', editingUserId, userData);
                showNotification('User updated successfully!', 'success');
            } else {
                dataStore.add('users', userData);
                showNotification('User added successfully!', 'success');
            }

            userModal.classList.remove("active");
            renderUsersTable();
            loadDashboardData();
        });
    }

    // Handle edit and delete buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.edit-user-btn')) {
            const id = parseInt(e.target.closest('.edit-user-btn').dataset.id);
            const user = dataStore.get('users').find(u => u.id === id);
            if (user) {
                editingUserId = id;
                userFormTitle.innerHTML = '<i class="fas fa-user-edit"></i> Edit User';
                document.getElementById("userName").value = user.name;
                document.getElementById("userEmail").value = user.email;
                document.getElementById("userRole").value = user.role;
                userModal.classList.add("active");
            }
        }

        if (e.target.closest('.delete-user-btn')) {
            const id = parseInt(e.target.closest('.delete-user-btn').dataset.id);
            if (confirm('Are you sure you want to delete this user?')) {
                dataStore.delete('users', id);
                showNotification('User deleted successfully!', 'success');
                renderUsersTable();
                loadDashboardData();
            }
        }
    });
}

function renderUsersTable() {
    const tbody = document.querySelector("#userTable tbody");
    if (!tbody) return;

    const users = dataStore.get('users');

    if (users.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          <i class="fas fa-users"></i>
          <h3>No Users Found</h3>
          <p>Click "Add User" to create your first user</p>
        </td>
      </tr>
    `;
        return;
    }

    tbody.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td><span class="role-badge">${user.role}</span></td>
      <td>
    <button type="button" class="edit-btn edit-user-btn" data-id="${user.id}">
          <i class="fas fa-edit"></i> Edit
        </button>
    <button type="button" class="delete-btn delete-user-btn" data-id="${user.id}">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
}

// === SKILLS MANAGEMENT ===
function initializeSkills() {
    const addSkillBtn = document.getElementById("addSkillBtn");
    const skillModal = document.getElementById("skillModal");
    const skillForm = document.getElementById("skillForm");
    const cancelSkillBtn = document.getElementById("cancelSkillBtn");
    const skillFormTitle = document.getElementById("skillFormTitle");

    let editingSkillId = null;

    if (addSkillBtn) {
        addSkillBtn.addEventListener("click", () => {
            editingSkillId = null;
            skillFormTitle.innerHTML = '<i class="fas fa-code"></i> Add Technical Skill';
            skillForm.reset();
            skillModal.classList.add("active");
        });
    }

    if (cancelSkillBtn) {
        cancelSkillBtn.addEventListener("click", () => {
            skillModal.classList.remove("active");
        });
    }

    if (skillForm) {
        skillForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("skillName").value.trim();
            const category = document.getElementById("skillCategory").value;
            const proficiency = document.getElementById("skillProficiency").value;
            const icon = document.getElementById("skillIcon").value.trim();
            const imageUrl = document.getElementById("skillImageUrl").value.trim();

            if (!name || !category || !proficiency) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            const skillData = { name, category, proficiency, icon, imageUrl };

            if (editingSkillId) {
                dataStore.update('skills', editingSkillId, skillData);
                showNotification('Skill updated successfully!', 'success');
            } else {
                dataStore.add('skills', skillData);
                showNotification('Skill added successfully!', 'success');
            }

            skillModal.classList.remove("active");
            renderSkillsTable();
            loadDashboardData();
        });
    }

    // Category filter tabs
    document.addEventListener('click', (e) => {
        if (e.target.matches('.tab-btn')) {
            // Update active tab
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            // Filter skills table
            const category = e.target.dataset.category;
            filterSkillsTable(category);
        }

        if (e.target.closest('.edit-skill-btn')) {
            const id = parseInt(e.target.closest('.edit-skill-btn').dataset.id);
            const skill = dataStore.get('skills').find(s => s.id === id);
            if (skill) {
                editingSkillId = id;
                skillFormTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Technical Skill';
                document.getElementById("skillName").value = skill.name;
                document.getElementById("skillCategory").value = skill.category;
                document.getElementById("skillProficiency").value = skill.proficiency;
                document.getElementById("skillIcon").value = skill.icon || '';
                document.getElementById("skillImageUrl").value = skill.imageUrl || '';
                skillModal.classList.add("active");
            }
        }

        if (e.target.closest('.delete-skill-btn')) {
            const id = parseInt(e.target.closest('.delete-skill-btn').dataset.id);
            if (confirm('Are you sure you want to delete this skill?')) {
                dataStore.delete('skills', id);
                showNotification('Skill deleted successfully!', 'success');
                renderSkillsTable();
                loadDashboardData();
            }
        }
    });
}

function renderSkillsTable() {
    const tbody = document.querySelector("#skillsTable tbody");
    if (!tbody) return;

    const skills = dataStore.get('skills');

    if (skills.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <i class="fas fa-code"></i>
          <h3>No Skills Found</h3>
          <p>Click "Add Skill" to create your first technical skill</p>
        </td>
      </tr>
    `;
        return;
    }

    tbody.innerHTML = skills.map(skill => `
    <tr data-category="${skill.category}">
      <td>${skill.id}</td>
      <td>
        ${skill.icon ? `<i class="${skill.icon}"></i>` : ''}
        ${skill.imageUrl ? `<img src="${skill.imageUrl}" alt="${skill.name}" style="width: 20px; height: 20px; margin-right: 8px;">` : ''}
        ${skill.name}
      </td>
      <td>${skill.category}</td>
      <td><span class="skill-proficiency ${skill.proficiency.toLowerCase()}">${skill.proficiency}</span></td>
      <td>
        ${skill.icon ? `<i class="${skill.icon}"></i>` : 'N/A'}
      </td>
      <td>
    <button type="button" class="edit-btn edit-skill-btn" data-id="${skill.id}">
          <i class="fas fa-edit"></i> Edit
        </button>
    <button type="button" class="delete-btn delete-skill-btn" data-id="${skill.id}">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
}

function filterSkillsTable(category) {
    const rows = document.querySelectorAll('#skillsTable tbody tr');
    rows.forEach(row => {
        if (category === 'all' || row.dataset.category === category) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// === PROJECTS MANAGEMENT ===
function initializeProjects() {
    const addProjectBtn = document.getElementById("addProjectBtn");
    const projectModal = document.getElementById("projectModal");
    const projectForm = document.getElementById("projectForm");
    const cancelProjectBtn = document.getElementById("cancelProjectBtn");
    const projectFormTitle = document.getElementById("projectFormTitle");

    let editingProjectId = null;

    if (addProjectBtn) {
        addProjectBtn.addEventListener("click", () => {
            editingProjectId = null;
            projectFormTitle.innerHTML = '<i class="fas fa-project-diagram"></i> Add Project';
            projectForm.reset();
            projectModal.classList.add("active");
        });
    }

    if (cancelProjectBtn) {
        cancelProjectBtn.addEventListener("click", () => {
            projectModal.classList.remove("active");
        });
    }

    if (projectForm) {
        projectForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = document.getElementById("projectTitle").value.trim();
            const category = document.getElementById("projectCategory").value.trim();
            const technologies = document.getElementById("projectTechnologies").value.trim();
            const status = document.getElementById("projectStatus").value;
            const image = document.getElementById("projectImage").value.trim();
            const liveUrl = document.getElementById("projectLiveUrl").value.trim();
            const githubUrl = document.getElementById("projectGithubUrl").value.trim();
            const description = document.getElementById("projectDescription").value.trim();

            if (!title || !category || !technologies || !status || !description) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            const projectData = { title, category, technologies, status, image, liveUrl, githubUrl, description };

            if (editingProjectId) {
                dataStore.update('projects', editingProjectId, projectData);
                showNotification('Project updated successfully!', 'success');
            } else {
                dataStore.add('projects', projectData);
                showNotification('Project added successfully!', 'success');
            }

            projectModal.classList.remove("active");
            renderProjectsTable();
            renderProjectsGrid();
            loadDashboardData();
        });
    }

    // Handle edit and delete buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.edit-project-btn')) {
            const id = parseInt(e.target.closest('.edit-project-btn').dataset.id);
            const project = dataStore.get('projects').find(p => p.id === id);
            if (project) {
                editingProjectId = id;
                projectFormTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Project';
                document.getElementById("projectTitle").value = project.title;
                document.getElementById("projectCategory").value = project.category;
                document.getElementById("projectTechnologies").value = project.technologies;
                document.getElementById("projectStatus").value = project.status;
                document.getElementById("projectImage").value = project.image || '';
                document.getElementById("projectLiveUrl").value = project.liveUrl || '';
                document.getElementById("projectGithubUrl").value = project.githubUrl || '';
                document.getElementById("projectDescription").value = project.description;
                projectModal.classList.add("active");
            }
        }

        if (e.target.closest('.delete-project-btn')) {
            const id = parseInt(e.target.closest('.delete-project-btn').dataset.id);
            if (confirm('Are you sure you want to delete this project?')) {
                dataStore.delete('projects', id);
                showNotification('Project deleted successfully!', 'success');
                renderProjectsTable();
                renderProjectsGrid();
                loadDashboardData();
            }
        }
    });
}

function renderProjectsTable() {
    const tbody = document.querySelector("#projectsTable tbody");
    if (!tbody) return;

    const projects = dataStore.get('projects');

    if (projects.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <i class="fas fa-project-diagram"></i>
          <h3>No Projects Found</h3>
          <p>Click "Add Project" to create your first project</p>
        </td>
      </tr>
    `;
        return;
    }

    tbody.innerHTML = projects.map(project => `
    <tr>
      <td>${project.id}</td>
      <td>${project.title}</td>
      <td>${project.category}</td>
      <td>
        <div class="project-tags">
          ${project.technologies.split(',').map(tech => `<span class="project-tag">${tech.trim()}</span>`).join('')}
        </div>
      </td>
      <td><span class="project-status ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span></td>
      <td>
    <button type="button" class="edit-btn edit-project-btn" data-id="${project.id}">
          <i class="fas fa-edit"></i> Edit
        </button>
    <button type="button" class="delete-btn delete-project-btn" data-id="${project.id}">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
}

function renderProjectsGrid() {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;

    const projects = dataStore.get('projects');

    if (projects.length === 0) {
        grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-project-diagram"></i>
        <h3>No Projects Found</h3>
        <p>Click "Add Project" to create your first project</p>
      </div>
    `;
        return;
    }

    grid.innerHTML = projects.map(project => `
    <div class="project-preview-card">
      ${project.image ? `<img src="${project.image}" alt="${project.title}" onerror="this.style.display='none'">` : ''}
      <div class="project-preview-content">
        <h4>${project.title}</h4>
        <p>${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
        <div class="project-tags">
          ${project.technologies.split(',').slice(0, 3).map(tech => `<span class="project-tag">${tech.trim()}</span>`).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
          <span class="project-status ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>
          <div>
            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="btn-sm"><i class="fas fa-external-link-alt"></i></a>` : ''}
            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="btn-sm"><i class="fab fa-github"></i></a>` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// === CERTIFICATIONS MANAGEMENT ===
function initializeCertifications() {
    const addCertBtn = document.getElementById("addCertBtn");
    const certModal = document.getElementById("certModal");
    const certForm = document.getElementById("certForm");
    const cancelCertBtn = document.getElementById("cancelCertBtn");
    const certFormTitle = document.getElementById("certFormTitle");

    let editingCertId = null;

    if (addCertBtn) {
        addCertBtn.addEventListener("click", () => {
            editingCertId = null;
            certFormTitle.innerHTML = '<i class="fas fa-certificate"></i> Add Certification';
            certForm.reset();
            certModal.classList.add("active");
        });
    }

    if (cancelCertBtn) {
        cancelCertBtn.addEventListener("click", () => {
            certModal.classList.remove("active");
        });
    }

    if (certForm) {
        certForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = document.getElementById("certTitle").value.trim();
            const type = document.getElementById("certType").value;
            const issuer = document.getElementById("certIssuer").value.trim();
            const date = document.getElementById("certDate").value;
            const expiryDate = document.getElementById("certExpiryDate").value;
            const image = document.getElementById("certImage").value.trim();
            const verificationUrl = document.getElementById("certVerificationUrl").value.trim();
            const description = document.getElementById("certDescription").value.trim();

            if (!title || !type || !issuer || !date) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            const certData = { title, type, issuer, date, expiryDate, image, verificationUrl, description };

            if (editingCertId) {
                dataStore.update('certifications', editingCertId, certData);
                showNotification('Certification updated successfully!', 'success');
            } else {
                dataStore.add('certifications', certData);
                showNotification('Certification added successfully!', 'success');
            }

            certModal.classList.remove("active");
            renderCertificationsTable();
            loadDashboardData();
        });
    }

    // Filter buttons
    document.addEventListener('click', (e) => {
        if (e.target.matches('.filter-btn')) {
            // Update active filter
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            // Filter certifications table
            const filter = e.target.dataset.filter;
            filterCertificationsTable(filter);
        }

        if (e.target.closest('.edit-cert-btn')) {
            const id = parseInt(e.target.closest('.edit-cert-btn').dataset.id);
            const cert = dataStore.get('certifications').find(c => c.id === id);
            if (cert) {
                editingCertId = id;
                certFormTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Certification';
                document.getElementById("certTitle").value = cert.title;
                document.getElementById("certType").value = cert.type;
                document.getElementById("certIssuer").value = cert.issuer;
                document.getElementById("certDate").value = cert.date;
                document.getElementById("certExpiryDate").value = cert.expiryDate || '';
                document.getElementById("certImage").value = cert.image || '';
                document.getElementById("certVerificationUrl").value = cert.verificationUrl || '';
                document.getElementById("certDescription").value = cert.description || '';
                certModal.classList.add("active");
            }
        }

        if (e.target.closest('.delete-cert-btn')) {
            const id = parseInt(e.target.closest('.delete-cert-btn').dataset.id);
            if (confirm('Are you sure you want to delete this certification?')) {
                dataStore.delete('certifications', id);
                showNotification('Certification deleted successfully!', 'success');
                renderCertificationsTable();
                loadDashboardData();
            }
        }
    });
}

function renderCertificationsTable() {
    const tbody = document.querySelector("#certificationsTable tbody");
    if (!tbody) return;

    const certifications = dataStore.get('certifications');

    if (certifications.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <i class="fas fa-certificate"></i>
          <h3>No Certifications Found</h3>
          <p>Click "Add Certification" to create your first certification</p>
        </td>
      </tr>
    `;
        return;
    }

    tbody.innerHTML = certifications.map(cert => `
    <tr data-type="${cert.type}">
      <td>${cert.id}</td>
      <td>${cert.title}</td>
      <td><span class="cert-type-badge ${cert.type.toLowerCase()}">${cert.type}</span></td>
      <td>${cert.issuer}</td>
      <td>${new Date(cert.date).toLocaleDateString()}</td>
      <td>
    <button type="button" class="edit-btn edit-cert-btn" data-id="${cert.id}">
          <i class="fas fa-edit"></i> Edit
        </button>
    <button type="button" class="delete-btn delete-cert-btn" data-id="${cert.id}">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
}

function filterCertificationsTable(type) {
    const rows = document.querySelectorAll('#certificationsTable tbody tr');
    rows.forEach(row => {
        if (type === 'all' || row.dataset.type === type) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// === MODAL MANAGEMENT ===
window.addEventListener("click", function (e) {
    const modals = ['userModal', 'skillModal', 'projectModal', 'certModal', 'pwdModal', 'forgotPasswordModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && e.target === modal) {
            modal.classList.remove("active");
        }
    });
});

// Add CSS for new elements
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  .cert-type-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  .cert-type-badge.certification {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
  }
  .cert-type-badge.achievement {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
  }
  .cert-type-badge.award {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
  }
  .cert-type-badge.honor {
    background: rgba(168, 85, 247, 0.2);
    color: #a855f7;
  }
  .btn-sm {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    text-decoration: none;
    margin: 0 2px;
    transition: all 0.2s ease;
  }
  .btn-sm:hover {
    background: #667eea;
    color: white;
    transform: translateY(-1px);
  }
`;
document.head.appendChild(additionalStyles);



