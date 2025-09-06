// ===== MODERN ADMIN PANEL JAVASCRIPT =====

class AdminPanel {
  constructor() {
    this.currentSection = 'dashboard';
    this.isLoggedIn = false;
    this.theme = localStorage.getItem('admin-theme') || 'light';
    this.isMobile = window.innerWidth <= 768;
    this.sidebarOpen = false;
    this.currentUser = null;
    
    this.init();
  }

  init() {
    this.initializeTheme();
    this.initializeEventListeners();
    this.initializeNotifications();
    this.checkAuthStatus();
    this.updateResponsiveLayout();
    this.startBackgroundAnimation();
    this.initializeTooltips();
    this.populateDashboardCards();
    this.initializeIntersectionObserver();
    this.initializePWAFeatures();
    this.initializeServiceWorker();
    
    console.log('🚀 Modern Admin Panel Initialized');
    this.showNotification('Admin panel loaded successfully', 'success');
  }

  // ===== MODERN FEATURES =====
  initializeIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    // Observe all fade-in sections
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    fadeInSections.forEach(section => {
      observer.observe(section);
    });
  }

  initializePWAFeatures() {
    // Check if app is installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      console.log('✅ Running as PWA');
      document.body.classList.add('pwa-mode');
    }

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA was installed');
      this.hideInstallBanner();
      this.showNotification('App installed successfully!', 'success');
    });
  }

  showInstallBanner() {
    // Create install banner if it doesn't exist
    let banner = document.getElementById('pwa-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'pwa-banner';
      banner.className = 'pwa-banner';
      
      banner.innerHTML = `
        <div class="pwa-content">
          <div class="pwa-text">
            <h4>Install Admin Panel</h4>
            <p>Get quick access to your portfolio management</p>
          </div>
          <div class="pwa-actions">
            <button class="pwa-btn primary" id="install-btn">Install</button>
            <button class="pwa-btn secondary" id="dismiss-btn">Dismiss</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(banner);

      // Add event listeners
      document.getElementById('install-btn').addEventListener('click', () => {
        this.installPWA();
      });

      document.getElementById('dismiss-btn').addEventListener('click', () => {
        this.hideInstallBanner();
      });
    }

    setTimeout(() => banner.classList.add('show'), 100);
  }

  hideInstallBanner() {
    const banner = document.getElementById('pwa-banner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 300);
    }
  }

  async installPWA() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
    } else {
      console.log('❌ User dismissed the install prompt');
    }
    
    this.deferredPrompt = null;
    this.hideInstallBanner();
  }

  initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          // Register service worker (you'll need to create sw.js)
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('✅ ServiceWorker registration successful:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateAvailable();
              }
            });
          });
        } catch (err) {
          console.log('❌ ServiceWorker registration failed:', err);
        }
      });
    }
  }

  showUpdateAvailable() {
    const updateBanner = document.createElement('div');
    updateBanner.className = 'notification notification-info';
    updateBanner.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span>🔄 New version available!</span>
        <button onclick="window.location.reload()" style="background: white; color: var(--accent-blue); border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
          Update
        </button>
      </div>
    `;
    
    document.body.appendChild(updateBanner);
    setTimeout(() => updateBanner.classList.add('show'), 100);
  }

  // ===== THEME MANAGEMENT =====
  initializeTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateThemeToggle();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('admin-theme', this.theme);
    this.updateThemeToggle();
    this.showNotification('Theme changed to ' + this.theme + ' mode', 'info');
  }

  updateThemeToggle() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
      const icon = toggle.querySelector('i');
      const text = toggle.querySelector('span');
      
      if (icon) {
        if (this.theme === 'dark') {
          icon.className = 'fas fa-sun';
          if (text) text.textContent = 'Light';
        } else {
          icon.className = 'fas fa-moon';
          if (text) text.textContent = 'Dark';
        }
      }
    });
  }

  // ===== EVENT LISTENERS =====
  initializeEventListeners() {
    this.setupLoginForm();
    this.setupForgotPassword();
    this.setupNavigation();
    this.setupThemeToggle();
    this.setupMobileMenu();
    this.setupDashboardCards();
    this.setupForms();
    this.setupTables();
    this.setupModals();
    
    // Window resize handler
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      this.updateResponsiveLayout();
    });

    // ESC key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });

    // Update time periodically
    this.updateLastUpdated();
    setInterval(() => this.updateLastUpdated(), 60000);
  }

  setupLoginForm() {
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Input focus effects
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('focused');
        }
      });
    });
  }

  setupForgotPassword() {
    const forgotLink = document.getElementById('forgotPasswordLink');
    const backToLoginLink = document.getElementById('backToLoginLink');
    const forgotForm = document.getElementById('forgotPasswordForm');
    
    if (forgotLink) {
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showForgotPasswordModal();
      });
    }
    
    if (backToLoginLink) {
      backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showLoginModal();
      });
    }
    
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => this.handlePasswordReset(e));
    }
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item:not(.logout-item)');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        if (section) {
          this.switchSection(section);
          this.setActiveNavItem(item);
          if (this.isMobile) this.closeMobileMenu();
        }
      });
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }

    // Change password link
    const changePwdLink = document.getElementById('changePwdLink');
    if (changePwdLink) {
      changePwdLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showChangePasswordModal();
      });
    }
  }

  setupThemeToggle() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => this.toggleTheme());
    });
  }

  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
    }

    if (closeSidebarBtn) {
      closeSidebarBtn.addEventListener('click', () => this.closeMobileMenu());
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (this.isMobile && this.sidebarOpen && sidebar) {
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnMenuBtn = mobileMenuBtn?.contains(e.target);
        
        if (!isClickInsideSidebar && !isClickOnMenuBtn) {
          this.closeMobileMenu();
        }
      }
    });

    // Close sidebar on navigation item click (mobile)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (this.isMobile) {
          setTimeout(() => this.closeMobileMenu(), 300);
        }
      });
    });
  }

  toggleMobileMenu() {
    if (this.sidebarOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    
    if (sidebar) {
      sidebar.classList.add('open');
      this.sidebarOpen = true;
      
      // Create overlay
      this.createSidebarOverlay();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Add animation class
      sidebar.classList.add('animate-slide-in-left');
      
      // Focus management for accessibility
      const firstNavItem = sidebar.querySelector('.nav-item');
      if (firstNavItem) {
        firstNavItem.focus();
      }
    }
  }

  closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    
    if (sidebar) {
      sidebar.classList.remove('open');
      this.sidebarOpen = false;
      
      // Remove overlay
      this.removeSidebarOverlay();
      
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Remove animation class after animation completes
      setTimeout(() => {
        sidebar.classList.remove('animate-slide-in-left');
      }, 300);
    }
  }

  createSidebarOverlay() {
    if (document.querySelector('.sidebar-overlay')) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.addEventListener('click', () => this.closeMobileMenu());
    
    document.body.appendChild(overlay);
    
    // Animate in
    setTimeout(() => overlay.classList.add('active'), 10);
  }

  removeSidebarOverlay() {
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }
  }

  setupDashboardCards() {
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
      card.addEventListener('click', () => {
        const cardClasses = Array.from(card.classList);
        const cardType = cardClasses.find(cls => cls.endsWith('-card'))?.replace('-card', '');
        
        if (cardType && cardType !== 'dashboard') {
          this.switchSection(cardType);
          const navItem = document.querySelector(`[data-section="${cardType}"]`);
          if (navItem) this.setActiveNavItem(navItem);
        }
      });
    });
  }

  setupForms() {
    // Add form handlers here
    this.setupUserForm();
    this.setupSkillForm();
    this.setupProjectForm();
    this.setupCertForm();
    this.setupPasswordForm();
  }

  setupUserForm() {
    const addUserBtn = document.getElementById('addUserBtn');
    const userForm = document.getElementById('userForm');
    const cancelUserBtn = document.getElementById('cancelUserBtn');

    if (addUserBtn) {
      addUserBtn.addEventListener('click', () => this.showUserModal());
    }

    if (userForm) {
      userForm.addEventListener('submit', (e) => this.handleUserSubmit(e));
    }

    if (cancelUserBtn) {
      cancelUserBtn.addEventListener('click', () => this.closeModal('userModal'));
    }
  }

  setupSkillForm() {
    const addSkillBtn = document.getElementById('addSkillBtn');
    const skillForm = document.getElementById('skillForm');
    const cancelSkillBtn = document.getElementById('cancelSkillBtn');

    if (addSkillBtn) {
      addSkillBtn.addEventListener('click', () => this.showSkillModal());
    }

    if (skillForm) {
      skillForm.addEventListener('submit', (e) => this.handleSkillSubmit(e));
    }

    if (cancelSkillBtn) {
      cancelSkillBtn.addEventListener('click', () => this.closeModal('skillModal'));
    }
  }

  setupProjectForm() {
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectForm = document.getElementById('projectForm');
    const cancelProjectBtn = document.getElementById('cancelProjectBtn');

    if (addProjectBtn) {
      addProjectBtn.addEventListener('click', () => this.showProjectModal());
    }

    if (projectForm) {
      projectForm.addEventListener('submit', (e) => this.handleProjectSubmit(e));
    }

    if (cancelProjectBtn) {
      cancelProjectBtn.addEventListener('click', () => this.closeModal('projectModal'));
    }
  }

  setupCertForm() {
    const addCertBtn = document.getElementById('addCertBtn');
    const certForm = document.getElementById('certForm');
    const cancelCertBtn = document.getElementById('cancelCertBtn');

    if (addCertBtn) {
      addCertBtn.addEventListener('click', () => this.showCertModal());
    }

    if (certForm) {
      certForm.addEventListener('submit', (e) => this.handleCertSubmit(e));
    }

    if (cancelCertBtn) {
      cancelCertBtn.addEventListener('click', () => this.closeModal('certModal'));
    }
  }

  setupPasswordForm() {
    const pwdForm = document.getElementById('pwdForm');
    const cancelPwdBtn = document.getElementById('cancelPwdBtn');

    if (pwdForm) {
      pwdForm.addEventListener('submit', (e) => this.handlePasswordChange(e));
    }

    if (cancelPwdBtn) {
      cancelPwdBtn.addEventListener('click', () => this.closeModal('pwdModal'));
    }
  }

  setupTables() {
    // Table sorting and actions will be implemented here
    this.initializeTables();
  }

  setupModals() {
    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });
  }

  // ===== AUTHENTICATION =====
  async handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value;
    const submitBtn = e.target.querySelector('.login-btn');
    
    if (!username || !password) {
      this.showLoginMessage('Please fill in all fields', 'error');
      return;
    }

    this.setButtonLoading(submitBtn, true);
    
    try {
      await this.delay(1500); // Simulate API call
      
      // Simple authentication - replace with real API call
      if (username === 'admin' && password === 'admin123') {
        this.showLoginMessage('Login successful! Welcome back...', 'success');
        
        await this.delay(1000);
        
        this.currentUser = { username, role: 'admin' };
        this.setSession({
          username: username,
          loginTime: new Date().toISOString(),
          isAuthenticated: true
        });
        
        this.isLoggedIn = true;
        this.showAdminPanel();
        this.showNotification(`Welcome back, ${username}!`, 'success');
        
      } else {
        this.showLoginMessage('Invalid username or password', 'error');
        this.addShakeAnimation(document.querySelector('.login-container'));
      }
    } catch (error) {
      this.showLoginMessage('Login failed. Please try again.', 'error');
      console.error('Login error:', error);
    } finally {
      this.setButtonLoading(submitBtn, false);
    }
  }

  async handlePasswordReset(e) {
    e.preventDefault();
    
    const secretKey = document.getElementById('secret-key').value.trim();
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!secretKey || !newPassword || !confirmPassword) {
      this.showForgotPasswordMessage('Please fill in all fields', 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      this.showForgotPasswordMessage('Passwords do not match', 'error');
      return;
    }
    
    if (secretKey === 'reset123') {
      this.showForgotPasswordMessage('Password reset successful!', 'success');
      setTimeout(() => {
        this.showLoginModal();
        this.showNotification('Password has been reset. Please login with new credentials.', 'success');
      }, 2000);
    } else {
      this.showForgotPasswordMessage('Invalid secret key', 'error');
    }
  }

  handleLogout() {
    this.showConfirmDialog(
      'Confirm Logout',
      'Are you sure you want to logout? You will be redirected to the login page.',
      () => {
        this.clearSession();
        this.isLoggedIn = false;
        this.currentUser = null;
        this.showLoginModal();
        this.showNotification('You have been logged out successfully', 'info');
      }
    );
  }

  checkAuthStatus() {
    const session = this.getSession();
    
    if (session && session.isAuthenticated) {
      this.isLoggedIn = true;
      this.currentUser = { username: session.username };
      this.showAdminPanel();
    } else {
      this.showLoginModal();
    }
  }

  // ===== SESSION MANAGEMENT =====
  setSession(data) {
    localStorage.setItem('admin_session', JSON.stringify({
      ...data,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
  }

  getSession() {
    try {
      const session = localStorage.getItem('admin_session');
      if (session) {
        const data = JSON.parse(session);
        if (Date.now() > data.expires) {
          this.clearSession();
          return null;
        }
        return data;
      }
    } catch (error) {
      console.error('Session error:', error);
      this.clearSession();
    }
    return null;
  }

  clearSession() {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_drafts');
  }

  // ===== UI MANAGEMENT =====
  showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const forgotModal = document.getElementById('forgotPasswordModal');
    const adminContainer = document.querySelector('.admin-container');
    
    if (loginModal) {
      loginModal.classList.add('active');
      loginModal.style.display = 'flex';
    }
    
    if (forgotModal) {
      forgotModal.classList.remove('active');
      forgotModal.style.display = 'none';
    }
    
    if (adminContainer) {
      adminContainer.classList.remove('active');
    }
  }

  showForgotPasswordModal() {
    const loginModal = document.getElementById('loginModal');
    const forgotModal = document.getElementById('forgotPasswordModal');
    
    if (loginModal) {
      loginModal.classList.remove('active');
      loginModal.style.display = 'none';
    }
    
    if (forgotModal) {
      forgotModal.classList.add('active');
      forgotModal.style.display = 'flex';
    }
  }

  showAdminPanel() {
    const loginModal = document.getElementById('loginModal');
    const forgotModal = document.getElementById('forgotPasswordModal');
    const adminContainer = document.querySelector('.admin-container');
    
    if (loginModal) {
      loginModal.classList.remove('active');
      setTimeout(() => loginModal.style.display = 'none', 300);
    }
    
    if (forgotModal) {
      forgotModal.classList.remove('active');
      setTimeout(() => forgotModal.style.display = 'none', 300);
    }
    
    if (adminContainer) {
      adminContainer.classList.add('active');
    }
    
    this.switchSection('dashboard');
    this.loadDashboardData();
  }

  switchSection(sectionName) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    this.currentSection = sectionName;
    this.updatePageHeader(sectionName);
    this.loadSectionData(sectionName);
  }

  setActiveNavItem(activeItem) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
  }

  updatePageHeader(sectionName) {
    const headers = {
      dashboard: { title: 'Dashboard', desc: 'Overview of your portfolio management system', icon: 'fas fa-tachometer-alt' },
      users: { title: 'Manage Users', desc: 'Add, edit, and manage system users', icon: 'fas fa-users' },
      skills: { title: 'Technical Skills', desc: 'Manage programming languages, frameworks, and technologies', icon: 'fas fa-code' },
      projects: { title: 'Projects', desc: 'Manage portfolio projects and showcases', icon: 'fas fa-project-diagram' },
      certifications: { title: 'Certifications & Achievements', desc: 'Manage professional certifications and achievements', icon: 'fas fa-certificate' }
    };
    
    const headerInfo = headers[sectionName] || headers.dashboard;
    const headerElement = document.querySelector('.page-header .header-content h1');
    const descElement = document.querySelector('.page-header .header-content p');
    
    if (headerElement) {
      headerElement.innerHTML = `<i class="${headerInfo.icon}"></i> ${headerInfo.title}`;
    }
    
    if (descElement) {
      descElement.textContent = headerInfo.desc;
    }
  }

  // ===== MOBILE MENU =====
  toggleMobileMenu() {
    if (this.sidebarOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.add('open');
      this.sidebarOpen = true;
    }
  }

  closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.remove('open');
      this.sidebarOpen = false;
    }
  }

  // ===== ENHANCED RESPONSIVE LAYOUT =====
  updateResponsiveLayout() {
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    
    if (this.isMobile) {
      body.classList.add('mobile-layout');
      this.closeMobileMenu();
      
      // Initialize touch gestures for mobile
      this.initializeTouchGestures();
      
      // Optimize dashboard cards for mobile
      this.optimizeMobileDashboard();
      
      // Update table responsiveness
      this.updateTableResponsiveness();
      
      // Adjust modal sizes
      this.adjustModalSizes();
    } else {
      body.classList.remove('mobile-layout');
      this.sidebarOpen = false;
      
      // Re-enable desktop features
      this.initializeDesktopFeatures();
      
      // Reset table styles for desktop
      this.resetTableStyles();
    }
    
    // Update navigation for current screen size
    this.updateNavigationForScreenSize();
  }

  initializeTouchGestures() {
    if (!this.isMobile) return;
    
    let startX = 0;
    let startY = 0;
    let isScrolling = false;
    
    // Swipe to open/close sidebar
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
      isScrolling = false;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      
      const diffX = e.touches[0].pageX - startX;
      const diffY = e.touches[0].pageY - startY;
      
      if (Math.abs(diffY) > Math.abs(diffX)) {
        isScrolling = true;
        return;
      }
      
      if (!isScrolling && Math.abs(diffX) > 50) {
        if (diffX > 0 && startX < 50 && !this.sidebarOpen) {
          // Swipe right from left edge to open sidebar
          this.openMobileMenu();
        } else if (diffX < 0 && this.sidebarOpen) {
          // Swipe left to close sidebar
          this.closeMobileMenu();
        }
      }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
      startX = 0;
      startY = 0;
      isScrolling = false;
    }, { passive: true });
  }

  optimizeMobileDashboard() {
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach((card, index) => {
      // Stagger animation on mobile
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-slide-in-up');
    });
  }

  initializeDesktopFeatures() {
    // Re-enable desktop-specific features
    this.initializeDesktopKeyboardShortcuts();
  }

  initializeDesktopKeyboardShortcuts() {
    if (this.isMobile) return;
    
    // Remove existing listener to prevent duplicates
    document.removeEventListener('keydown', this.handleKeyboardShortcuts);
    
    this.handleKeyboardShortcuts = (e) => {
      // Ctrl+Alt+D for Dashboard
      if (e.ctrlKey && e.altKey && e.key === 'd') {
        e.preventDefault();
        this.showSection('dashboard');
      }
      
      // Ctrl+Alt+S for Skills
      if (e.ctrlKey && e.altKey && e.key === 's') {
        e.preventDefault();
        this.showSection('skills');
      }
      
      // Ctrl+Alt+P for Projects
      if (e.ctrlKey && e.altKey && e.key === 'p') {
        e.preventDefault();
        this.showSection('projects');
      }
      
      // Ctrl+Alt+C for Certifications
      if (e.ctrlKey && e.altKey && e.key === 'c') {
        e.preventDefault();
        this.showSection('certifications');
      }
      
      // Ctrl+Alt+T for Theme toggle
      if (e.ctrlKey && e.altKey && e.key === 't') {
        e.preventDefault();
        this.toggleTheme();
      }
    };
    
    document.addEventListener('keydown', this.handleKeyboardShortcuts);
  }

  updateTableResponsiveness() {
    const tables = document.querySelectorAll('.modern-table');
    tables.forEach(table => {
      const container = table.parentElement;
      
      if (this.isMobile) {
        // Add horizontal scroll for mobile
        container.style.overflowX = 'auto';
        table.style.minWidth = '600px';
        
        // Add sticky first column for better UX
        const firstCells = table.querySelectorAll('td:first-child, th:first-child');
        firstCells.forEach(cell => {
          cell.style.position = 'sticky';
          cell.style.left = '0';
          cell.style.backgroundColor = 'var(--bg-secondary)';
          cell.style.zIndex = '10';
        });
      }
    });
  }

  resetTableStyles() {
    const tables = document.querySelectorAll('.modern-table');
    tables.forEach(table => {
      const container = table.parentElement;
      
      // Reset desktop styles
      container.style.overflowX = 'visible';
      table.style.minWidth = 'auto';
      
      const firstCells = table.querySelectorAll('td:first-child, th:first-child');
      firstCells.forEach(cell => {
        cell.style.position = 'static';
        cell.style.backgroundColor = 'transparent';
      });
    });
  }

  adjustModalSizes() {
    const modals = document.querySelectorAll('.modal-content');
    modals.forEach(modal => {
      if (this.isMobile) {
        modal.style.maxHeight = 'calc(100vh - 2rem)';
        modal.style.overflowY = 'auto';
      } else {
        modal.style.maxHeight = 'none';
        modal.style.overflowY = 'visible';
      }
    });
  }

  updateNavigationForScreenSize() {
    const navItems = document.querySelectorAll('.nav-item');
    
    if (this.isMobile) {
      // Add touch-friendly padding for mobile
      navItems.forEach(item => {
        item.style.padding = '1rem';
        item.style.minHeight = '48px'; // Touch target size
      });
    } else {
      // Reset desktop padding
      navItems.forEach(item => {
        item.style.padding = '';
        item.style.minHeight = '';
      });
    }
  }

  // ===== DASHBOARD =====
  populateDashboardCards() {
    const cardsData = [
      {
        selector: '.skills-card',
        icon: 'fas fa-code',
        title: '12',
        subtitle: 'Technical Skills',
        trend: 'trending_up',
        trendText: '+2 this month'
      },
      {
        selector: '.projects-card',
        icon: 'fas fa-project-diagram',
        title: '8',
        subtitle: 'Active Projects',
        trend: 'trending_up',
        trendText: '+1 this week'
      },
      {
        selector: '.certs-card',
        icon: 'fas fa-certificate',
        title: '6',
        subtitle: 'Certifications',
        trend: 'trending_up',
        trendText: '+3 this year'
      },
      {
        selector: '.users-card',
        icon: 'fas fa-users',
        title: '2',
        subtitle: 'Admin Users',
        trend: 'trending_flat',
        trendText: 'No change'
      }
    ];

    cardsData.forEach(cardData => {
      const card = document.querySelector(cardData.selector);
      if (card) {
        const cardIcon = card.querySelector('.card-icon');
        const cardContent = card.querySelector('.card-content');
        const cardTrend = card.querySelector('.card-trend');

        if (cardIcon) {
          cardIcon.innerHTML = `<i class="${cardData.icon}"></i>`;
        }

        if (cardContent) {
          cardContent.innerHTML = `
            <h3>${cardData.title}</h3>
            <p>${cardData.subtitle}</p>
          `;
        }

        if (cardTrend) {
          cardTrend.innerHTML = `
            <i class="fas fa-${cardData.trend}"></i>
            <span>${cardData.trendText}</span>
          `;
        }
      }
    });
  }

  loadDashboardData() {
    // Load recent activity
    const recentActivity = document.getElementById('recentActivity');
    if (recentActivity) {
      recentActivity.innerHTML = `
        <li><i class="fas fa-plus text-green"></i> Added new project "E-commerce API"</li>
        <li><i class="fas fa-edit text-blue"></i> Updated skill "React.js" proficiency</li>
        <li><i class="fas fa-certificate text-purple"></i> Added certification "AWS Developer"</li>
        <li><i class="fas fa-user text-orange"></i> User profile updated</li>
        <li><i class="fas fa-settings text-gray"></i> System settings modified</li>
      `;
    }

    // Load system info
    const systemInfo = document.querySelector('.system-info');
    if (systemInfo) {
      const now = new Date();
      systemInfo.innerHTML = `
        <div><span>Server Status:</span><span class="text-green">Online</span></div>
        <div><span>Last Backup:</span><span>${now.toLocaleDateString()}</span></div>
        <div><span>Database Size:</span><span>2.4 MB</span></div>
        <div><span>Active Sessions:</span><span>1</span></div>
        <div><span>Version:</span><span>2.1.0</span></div>
      `;
    }
  }

  // ===== MODALS =====
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }

  closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal.classList.contains('active')) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
      }
    });
  }

  showUserModal(userData = null) {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const title = document.getElementById('userFormTitle');
    
    if (userData) {
      title.innerHTML = '<i class="fas fa-user-edit"></i> Edit User';
      // Populate form with user data
    } else {
      title.innerHTML = '<i class="fas fa-user-plus"></i> Add User';
      form.reset();
    }
    
    this.showModal('userModal');
  }

  showSkillModal(skillData = null) {
    const modal = document.getElementById('skillModal');
    const form = document.getElementById('skillForm');
    const title = document.getElementById('skillFormTitle');
    
    if (skillData) {
      title.innerHTML = '<i class="fas fa-code"></i> Edit Skill';
      // Populate form with skill data
    } else {
      title.innerHTML = '<i class="fas fa-code"></i> Add Technical Skill';
      form.reset();
    }
    
    this.showModal('skillModal');
  }

  showProjectModal(projectData = null) {
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');
    const title = document.getElementById('projectFormTitle');
    
    if (projectData) {
      title.innerHTML = '<i class="fas fa-project-diagram"></i> Edit Project';
      // Populate form with project data
    } else {
      title.innerHTML = '<i class="fas fa-project-diagram"></i> Add Project';
      form.reset();
    }
    
    this.showModal('projectModal');
  }

  showCertModal(certData = null) {
    const modal = document.getElementById('certModal');
    const form = document.getElementById('certForm');
    const title = document.getElementById('certFormTitle');
    
    if (certData) {
      title.innerHTML = '<i class="fas fa-certificate"></i> Edit Certification';
      // Populate form with cert data
    } else {
      title.innerHTML = '<i class="fas fa-certificate"></i> Add Certification';
      form.reset();
    }
    
    this.showModal('certModal');
  }

  showChangePasswordModal() {
    this.showModal('pwdModal');
  }

  // ===== FORM HANDLERS =====
  async handleUserSubmit(e) {
    e.preventDefault();
    // Handle user form submission
    this.showNotification('User saved successfully!', 'success');
    this.closeModal('userModal');
  }

  async handleSkillSubmit(e) {
    e.preventDefault();
    // Handle skill form submission
    this.showNotification('Skill saved successfully!', 'success');
    this.closeModal('skillModal');
  }

  async handleProjectSubmit(e) {
    e.preventDefault();
    // Handle project form submission
    this.showNotification('Project saved successfully!', 'success');
    this.closeModal('projectModal');
  }

  async handleCertSubmit(e) {
    e.preventDefault();
    // Handle certification form submission
    this.showNotification('Certification saved successfully!', 'success');
    this.closeModal('certModal');
  }

  async handlePasswordChange(e) {
    e.preventDefault();
    // Handle password change
    this.showNotification('Password changed successfully!', 'success');
    this.closeModal('pwdModal');
  }

  // ===== DATA LOADING =====
  loadSectionData(sectionName) {
    switch(sectionName) {
      case 'dashboard':
        this.loadDashboardData();
        break;
      case 'users':
        this.loadUsersTable();
        break;
      case 'skills':
        this.loadSkillsTable();
        break;
      case 'projects':
        this.loadProjectsTable();
        break;
      case 'certifications':
        this.loadCertificationsTable();
        break;
    }
  }

  loadUsersTable() {
    const tableBody = document.querySelector('#userTable tbody');
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td>1</td>
          <td>admin</td>
          <td>admin@portfolio.com</td>
          <td>Administrator</td>
          <td><span class="badge badge-success">Active</span></td>
          <td>
            <div class="action-buttons">
              <button class="action-btn edit-action" onclick="adminPanel.showUserModal()">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete-action" onclick="adminPanel.confirmDelete('user', 1)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }
  }

  loadSkillsTable() {
    const tableBody = document.querySelector('#skillsTable tbody');
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td>JavaScript</td>
          <td>Programming Languages</td>
          <td><div class="progress-bar"><div class="progress" style="width: 90%"></div></div></td>
          <td>Expert</td>
          <td>
            <div class="action-buttons">
              <button class="action-btn edit-action" onclick="adminPanel.showSkillModal()">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete-action" onclick="adminPanel.confirmDelete('skill', 1)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }
  }

  loadProjectsTable() {
    const tableBody = document.querySelector('#projectsTable tbody');
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td>E-commerce Platform</td>
          <td>Web Application</td>
          <td>React, Node.js, MongoDB</td>
          <td><span class="badge badge-success">Completed</span></td>
          <td>2024</td>
          <td>
            <div class="action-buttons">
              <button class="action-btn edit-action" onclick="adminPanel.showProjectModal()">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete-action" onclick="adminPanel.confirmDelete('project', 1)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }
  }

  loadCertificationsTable() {
    const tableBody = document.querySelector('#certificationsTable tbody');
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td>AWS Certified Developer</td>
          <td>Amazon Web Services</td>
          <td>Certification</td>
          <td>2024</td>
          <td><span class="badge badge-success">Valid</span></td>
          <td>
            <div class="action-buttons">
              <button class="action-btn edit-action" onclick="adminPanel.showCertModal()">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete-action" onclick="adminPanel.confirmDelete('cert', 1)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }
  }

  initializeTables() {
    // Initialize all tables with headers
    this.initializeUserTable();
    this.initializeSkillsTable();
    this.initializeProjectsTable();
    this.initializeCertificationsTable();
  }

  initializeUserTable() {
    const tableHead = document.querySelector('#userTable thead');
    if (tableHead) {
      tableHead.innerHTML = `
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      `;
    }
  }

  initializeSkillsTable() {
    const tableHead = document.querySelector('#skillsTable thead');
    if (tableHead) {
      tableHead.innerHTML = `
        <tr>
          <th>Skill Name</th>
          <th>Category</th>
          <th>Proficiency</th>
          <th>Level</th>
          <th>Actions</th>
        </tr>
      `;
    }
  }

  initializeProjectsTable() {
    const tableHead = document.querySelector('#projectsTable thead');
    if (tableHead) {
      tableHead.innerHTML = `
        <tr>
          <th>Project Name</th>
          <th>Type</th>
          <th>Technologies</th>
          <th>Status</th>
          <th>Year</th>
          <th>Actions</th>
        </tr>
      `;
    }
  }

  initializeCertificationsTable() {
    const tableHead = document.querySelector('#certificationsTable thead');
    if (tableHead) {
      tableHead.innerHTML = `
        <tr>
          <th>Title</th>
          <th>Issuer</th>
          <th>Type</th>
          <th>Year</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      `;
    }
  }

  // ===== NOTIFICATIONS =====
  initializeNotifications() {
    if (!document.querySelector('.notification-container')) {
      const container = document.createElement('div');
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
  }

  showNotification(message, type = 'info', duration = 4000) {
    const container = document.querySelector('.notification-container') || document.body;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <i class="${icons[type] || icons.info}" style="font-size: 1.25rem;"></i>
        <span style="flex: 1;">${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; padding: 0; font-size: 1.125rem;">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, duration);
  }

  showLoginMessage(message, type) {
    const messageDiv = document.getElementById('adminLoginMsg');
    if (messageDiv) {
      messageDiv.textContent = message;
      messageDiv.className = type;
      messageDiv.style.display = 'block';
      
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 5000);
    }
  }

  showForgotPasswordMessage(message, type) {
    const messageDiv = document.getElementById('forgotPasswordMsg');
    if (messageDiv) {
      messageDiv.textContent = message;
      messageDiv.className = type;
      messageDiv.style.display = 'block';
      
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 5000);
    }
  }

  // ===== UTILITY FUNCTIONS =====
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.innerHTML = `
        <span class="btn-text">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Please wait...</span>
        </span>
        <div class="btn-ripple"></div>
      `;
    } else {
      button.disabled = false;
      button.innerHTML = `
        <span class="btn-text">
          <i class="fas fa-sign-in-alt"></i>
          <span>Access Panel</span>
        </span>
        <div class="btn-ripple"></div>
      `;
    }
  }

  addShakeAnimation(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  }

  updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
      const now = new Date();
      lastUpdatedElement.textContent = now.toLocaleTimeString();
    }
  }

  confirmDelete(type, id) {
    this.showConfirmDialog(
      `Delete ${type}`,
      `Are you sure you want to delete this ${type}? This action cannot be undone.`,
      () => {
        this.showNotification(`${type} deleted successfully!`, 'success');
        // Reload the current section data
        this.loadSectionData(this.currentSection);
      }
    );
  }

  showConfirmDialog(title, message, onConfirm, onCancel = null) {
    const dialog = document.createElement('div');
    dialog.className = 'modal confirm-dialog active';
    dialog.style.display = 'flex';
    
    dialog.innerHTML = `
      <div class="login-container" style="min-width: 400px;">
        <div class="login-header">
          <div class="login-icon" style="background: linear-gradient(135deg, var(--accent-amber), var(--accent-rose));">
            <i class="fas fa-question-circle"></i>
          </div>
          <h2>${title}</h2>
          <p>${message}</p>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button class="cancel-btn" onclick="this.closest('.modal').remove()">
            <i class="fas fa-times"></i> Cancel
          </button>
          <button class="confirm-btn" style="background: linear-gradient(135deg, var(--accent-rose), var(--accent-amber)); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: var(--radius-lg); font-weight: 600; cursor: pointer;">
            <i class="fas fa-check"></i> Confirm
          </button>
        </div>
      </div>
    `;
    
    const confirmBtn = dialog.querySelector('.confirm-btn');
    confirmBtn.addEventListener('click', () => {
      dialog.remove();
      if (onConfirm) onConfirm();
    });
    
    const cancelBtn = dialog.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
      dialog.remove();
      if (onCancel) onCancel();
    });
    
    document.body.appendChild(dialog);
  }

  // ===== BACKGROUND ANIMATION =====
  startBackgroundAnimation() {
    let frame = 0;
    const animate = () => {
      frame += 0.01;
      const orbs = document.querySelectorAll('.gradient-orb');
      
      orbs.forEach((orb, index) => {
        const x = Math.sin(frame + index) * 10;
        const y = Math.cos(frame + index * 0.5) * 8;
        orb.style.transform += ` translate(${x}px, ${y}px)`;
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  // ===== TOOLTIPS =====
  initializeTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTooltips.forEach(element => {
      element.addEventListener('mouseenter', (e) => this.showTooltip(e));
      element.addEventListener('mouseleave', () => this.hideTooltip());
    });
  }

  showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: fixed;
      background: var(--bg-glass-dark);
      color: var(--text-primary);
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-md);
      font-size: 0.8rem;
      z-index: 1200;
      pointer-events: none;
      backdrop-filter: blur(10px);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      animation: fadeIn 0.2s ease-out;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltipRect.width / 2) + 'px';
    tooltip.style.top = rect.top - tooltipRect.height - 8 + 'px';
    
    this.currentTooltip = tooltip;
  }

  hideTooltip() {
    if (this.currentTooltip) {
      this.currentTooltip.remove();
      this.currentTooltip = null;
    }
  }
}

// ===== ADDITIONAL CSS ANIMATIONS =====
const additionalStyles = `
  .badge {
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }
  
  .badge-success {
    background: rgba(16, 185, 129, 0.1);
    color: var(--accent-emerald);
    border: 1px solid rgba(16, 185, 129, 0.2);
  }
  
  .badge-warning {
    background: rgba(245, 158, 11, 0.1);
    color: var(--accent-amber);
    border: 1px solid rgba(245, 158, 11, 0.2);
  }
  
  .badge-error {
    background: rgba(244, 63, 94, 0.1);
    color: var(--accent-rose);
    border: 1px solid rgba(244, 63, 94, 0.2);
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--border-light);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-500), var(--secondary-500));
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .text-green { color: var(--accent-emerald); }
  .text-blue { color: var(--accent-blue); }
  .text-purple { color: var(--secondary-500); }
  .text-orange { color: var(--accent-amber); }
  .text-gray { color: var(--text-muted); }
  
  .input-group.focused .input-highlight {
    opacity: 1 !important;
    transform: scaleX(1) !important;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  @keyframes bounceIn {
    0% { opacity: 0; transform: scale(0.3); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .confirm-dialog .login-container {
    animation: bounceIn 0.3s ease-out;
  }
`;

// Inject additional styles
const style = document.createElement('style');
style.textContent = additionalStyles;
document.head.appendChild(style);

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
  window.adminPanel = new AdminPanel();
});

// ===== GLOBAL ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  if (window.adminPanel) {
    window.adminPanel.showNotification('An unexpected error occurred. Please refresh the page.', 'error');
  }
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  // Ctrl+Alt+L to logout
  if (e.ctrlKey && e.altKey && e.key === 'l') {
    e.preventDefault();
    if (window.adminPanel && window.adminPanel.isLoggedIn) {
      window.adminPanel.handleLogout();
    }
  }
  
  // Ctrl+Alt+T to toggle theme
  if (e.ctrlKey && e.altKey && e.key === 't') {
    e.preventDefault();
    if (window.adminPanel) {
      window.adminPanel.toggleTheme();
    }
  }
});
