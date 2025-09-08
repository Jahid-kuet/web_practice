<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="admin.aspx.cs" Inherits="PortfolioWebsite.admin" %>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="description" content="Admin Panel - Portfolio Management System" />
  <meta name="robots" content="noindex, nofollow" />
  
  <title>Admin Panel - Portfolio Management</title>
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="admin.css" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />
  
  <!-- Security Headers -->
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="X-Frame-Options" content="DENY">
  <meta http-equiv="X-XSS-Protection" content="1; mode=block">
  <script src="scripts/sync.js"></script>
</head>
<body>
  <!-- Login Modal -->
  <div id="loginModal" class="modal active">
    <div class="login-container">
      <form class="admin-login-form" id="adminLoginForm" autocomplete="off">
        <div class="login-header">
          <i class="fas fa-shield-alt"></i>
          <h2>Admin Login</h2>
          <p>Enter your credentials to access the admin panel</p>
        </div>
        <div class="input-group">
          <i class="fas fa-user"></i>
          <input type="text" id="admin-username" name="username" placeholder="Username" required />
        </div>
        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input type="password" id="admin-password" name="password" placeholder="Password" required />
        </div>
        <button type="submit" class="login-btn">
          <i class="fas fa-sign-in-alt"></i>
          Login
        </button>
        <div class="forgot-password">
          <a href="#" id="forgotPasswordLink">
            <i class="fas fa-key"></i>
            Forgot Password?
          </a>
        </div>
        <div id="adminLoginMsg"></div>
      </form>
    </div>
  </div>

  <!-- Forgot Password Modal -->
  <div id="forgotPasswordModal" class="modal">
    <div class="login-container">
      <form class="admin-login-form" id="forgotPasswordForm" autocomplete="off">
        <div class="login-header">
          <i class="fas fa-unlock-alt"></i>
          <h2>Reset Password</h2>
          <p>Enter your secret key to reset your password</p>
        </div>
        <div class="input-group">
          <i class="fas fa-key"></i>
          <input type="text" id="secret-key" name="secretKey" placeholder="Secret Key" required />
        </div>
        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input type="password" id="new-password" name="newPassword" placeholder="New Password" required />
        </div>
        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input type="password" id="confirm-password" name="confirmPassword" placeholder="Confirm New Password" required />
        </div>
        <button type="submit" class="login-btn">
          <i class="fas fa-check"></i>
          Reset Password
        </button>
        <div class="forgot-password">
          <a href="#" id="backToLoginLink">
            <i class="fas fa-arrow-left"></i>
            Back to Login
          </a>
        </div>
        <div id="forgotPasswordMsg"></div>
      </form>
    </div>
  </div>

  <!-- Admin Panel -->
  <div class="admin-container">
    <!-- Theme Toggle -->
    <div class="theme-toggle" id="themeToggle">
      <i class="fas fa-moon" id="themeIcon"></i>
      <span id="themeText">Dark</span>
    </div>

    <!-- Mobile Header -->
    <div class="mobile-header">
      <button class="mobile-menu-btn" id="mobileMenuBtn">
        <i class="fas fa-bars"></i>
      </button>
      <h1>Admin Panel</h1>
      <div class="mobile-profile">
        <i class="fas fa-user-circle"></i>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <h2><i class="fas fa-cog"></i> Admin Panel</h2>
        <button class="close-sidebar" id="closeSidebarBtn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <nav class="sidebar-nav">
        <a href="#" class="nav-item active" data-section="dashboard">
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </a>
        <a href="#" class="nav-item" data-section="users">
          <i class="fas fa-users"></i>
          <span>Manage Users</span>
        </a>
        <a href="#" class="nav-item" data-section="skills">
          <i class="fas fa-code"></i>
          <span>Technical Skills</span>
        </a>
        <a href="#" class="nav-item" data-section="projects">
          <i class="fas fa-project-diagram"></i>
          <span>Projects</span>
        </a>
        <a href="#" class="nav-item" data-section="certifications">
          <i class="fas fa-certificate"></i>
          <span>Certifications</span>
        </a>
        <a href="#" class="nav-item" id="changePwdLink">
          <i class="fas fa-key"></i>
          <span>Change Password</span>
        </a>
        <a href="#" class="nav-item" id="logoutBtn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Dashboard Section -->
      <div class="content-section active" id="dashboard-section">
        <div class="page-header">
          <div>
            <h1><i class="fas fa-tachometer-alt"></i> Dashboard</h1>
            <p>Welcome to the portfolio management dashboard</p>
          </div>
          <div class="header-actions">
            <span class="last-updated">Last updated: <span id="lastUpdated">Just now</span></span>
          </div>
        </div>
        <div class="dashboard-cards">
          <div class="dashboard-card">
            <div class="card-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="card-content">
              <h3 id="totalUsers">2</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div class="dashboard-card">
            <div class="card-icon">
              <i class="fas fa-code"></i>
            </div>
            <div class="card-content">
              <h3 id="totalSkills">0</h3>
              <p>Technical Skills</p>
            </div>
          </div>
          <div class="dashboard-card">
            <div class="card-icon">
              <i class="fas fa-project-diagram"></i>
            </div>
            <div class="card-content">
              <h3 id="totalProjects">0</h3>
              <p>Projects</p>
            </div>
          </div>
          <div class="dashboard-card">
            <div class="card-icon">
              <i class="fas fa-certificate"></i>
            </div>
            <div class="card-content">
              <h3 id="totalCerts">0</h3>
              <p>Certifications</p>
            </div>
          </div>
        </div>
        
        <!-- Quick Stats -->
        <div class="quick-stats">
          <div class="stats-card">
            <h3>Recent Activity</h3>
            <ul id="recentActivity">
              <li><i class="fas fa-plus"></i> System initialized</li>
            </ul>
          </div>
          <div class="stats-card">
            <h3>System Info</h3>
            <div class="system-info">
              <p><strong>Version:</strong> 2.0.0</p>
              <p><strong>Status:</strong> <span class="status-online">Online</span></p>
              <p><strong>Uptime:</strong> <span id="uptime">Active</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Management Section -->
      <div class="content-section" id="users-section">
        <div class="page-header">
          <div>
            <h1><i class="fas fa-users"></i> Manage Users</h1>
            <p>Add, edit, and manage system users</p>
          </div>
          <button class="add-btn" id="addUserBtn">
            <i class="fas fa-plus"></i>
            Add User
          </button>
        </div>
        <div class="table-container">
          <table id="userTable" class="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- JS will populate -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Technical Skills Section -->
      <div class="content-section" id="skills-section">
        <div class="page-header">
          <div>
            <h1><i class="fas fa-code"></i> Technical Skills</h1>
            <p>Manage programming languages, frameworks, and technologies</p>
          </div>
          <button class="add-btn" id="addSkillBtn">
            <i class="fas fa-plus"></i>
            Add Skill
          </button>
        </div>
        <div class="skills-categories">
          <div class="category-tabs">
            <button class="tab-btn active" data-category="all">All Skills</button>
            <button class="tab-btn" data-category="Programming Languages">Languages</button>
            <button class="tab-btn" data-category="Frameworks & Libraries">Frameworks</button>
            <button class="tab-btn" data-category="Tools & Technologies">Tools</button>
          </div>
        </div>
        <div class="table-container">
          <table id="skillsTable" class="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Proficiency</th>
                <th>Icon</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- JS will populate -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Projects Section -->
      <div class="content-section" id="projects-section">
        <div class="page-header">
          <div>
            <h1><i class="fas fa-project-diagram"></i> Projects</h1>
            <p>Manage portfolio projects and showcases</p>
          </div>
          <button class="add-btn" id="addProjectBtn">
            <i class="fas fa-plus"></i>
            Add Project
          </button>
        </div>
        <div class="projects-grid" id="projectsGrid">
          <!-- JS will populate project cards -->
        </div>
        <div class="table-container">
          <table id="projectsTable" class="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Technologies</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- JS will populate -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Certifications Section -->
      <div class="content-section" id="certifications-section">
        <div class="page-header">
          <div>
            <h1><i class="fas fa-certificate"></i> Certifications & Achievements</h1>
            <p>Manage professional certifications and achievements</p>
          </div>
          <button class="add-btn" id="addCertBtn">
            <i class="fas fa-plus"></i>
            Add Certification
          </button>
        </div>
        <div class="cert-filters">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="Certification">Certifications</button>
          <button class="filter-btn" data-filter="Achievement">Achievements</button>
          <button class="filter-btn" data-filter="Award">Awards</button>
        </div>
        <div class="table-container">
          <table id="certificationsTable" class="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Issuer</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- JS will populate -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Add/Edit User Modal -->
  <div id="userModal" class="modal">
    <div class="modal-content">
      <form class="user-form" id="userForm">
        <div class="modal-header">
          <h2 id="userFormTitle"><i class="fas fa-user-plus"></i> Add User</h2>
          <button type="button" class="close-btn" id="cancelUserBtn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <input type="hidden" id="userId" />
        <div class="form-grid">
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input type="text" id="userName" placeholder="Full Name" required />
          </div>
          <div class="input-group">
            <i class="fas fa-envelope"></i>
            <input type="email" id="userEmail" placeholder="Email Address" required />
          </div>
          <div class="input-group">
            <i class="fas fa-briefcase"></i>
            <input type="text" id="userRole" placeholder="Role (e.g., Admin, Editor)" required />
          </div>
        </div>
        <div class="modal-actions">
          <button type="submit" class="save-btn">
            <i class="fas fa-save"></i>
            Save User
          </button>
          <button type="button" class="cancel-btn" onclick="document.getElementById('cancelUserBtn').click()">
            <i class="fas fa-times"></i>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
  <!-- Change Password Modal -->
  <div id="pwdModal" class="modal">
    <div class="modal-content">
      <form class="user-form" id="pwdForm">
        <div class="modal-header">
          <h2><i class="fas fa-key"></i> Change Password</h2>
          <button type="button" class="close-btn" id="cancelPwdBtn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="form-grid">
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input type="password" id="oldPwd" placeholder="Current Password" required />
          </div>
          <div class="input-group">
            <i class="fas fa-key"></i>
            <input type="password" id="newPwd" placeholder="New Password" required />
          </div>
        </div>
        <div class="modal-actions">
          <button type="submit" class="save-btn">
            <i class="fas fa-check"></i>
            Update Password
          </button>
          <button type="button" class="cancel-btn" onclick="document.getElementById('cancelPwdBtn').click()">
            <i class="fas fa-times"></i>
            Cancel
          </button>
        </div>
        <div id="pwdMsg"></div>
      </form>
    </div>
  </div>

  <!-- Skills Modal -->
  <div id="skillModal" class="modal">
    <div class="modal-content">
      <form class="skill-form" id="skillForm">
        <div class="modal-header">
          <h2 id="skillFormTitle"><i class="fas fa-code"></i> Add Technical Skill</h2>
          <button type="button" class="close-btn" id="cancelSkillBtn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <input type="hidden" id="skillId" />
        <div class="form-grid">
          <div class="input-group">
            <i class="fas fa-tag"></i>
            <input type="text" id="skillName" placeholder="Skill Name (e.g., JavaScript)" required />
          </div>
          <div class="input-group">
            <i class="fas fa-list"></i>
            <select id="skillCategory" required>
              <option value="">Select Category</option>
              <option value="Programming Languages">Programming Languages</option>
              <option value="Frameworks & Libraries">Frameworks & Libraries</option>
              <option value="Tools & Technologies">Tools & Technologies</option>
              <option value="Databases">Databases</option>
            </select>
          </div>
          <div class="input-group">
            <i class="fas fa-star"></i>
            <select id="skillProficiency" required>
              <option value="">Select Proficiency</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div class="input-group">
            <i class="fas fa-image"></i>
            <input type="text" id="skillIcon" placeholder="Icon class (e.g., fab fa-js-square)" />
          </div>
          <div class="input-group">
            <i class="fas fa-link"></i>
            <input type="url" id="skillImageUrl" placeholder="Image URL (optional)" />
          </div>
        </div>
        <div class="modal-actions">
          <button type="submit" class="save-btn">
            <i class="fas fa-save"></i>
            Save Skill
          </button>
          <button type="button" class="cancel-btn" onclick="document.getElementById('cancelSkillBtn').click()">
            <i class="fas fa-times"></i>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Project Modal -->
  <div id="projectModal" class="modal">
    <div class="modal-content large-modal">
      <form class="project-form" id="projectForm">
        <div class="modal-header">
          <h2 id="projectFormTitle"><i class="fas fa-project-diagram"></i> Add Project</h2>
          <button type="button" class="close-btn" id="cancelProjectBtn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <input type="hidden" id="projectId" />
        <div class="form-grid">
          <div class="input-group">
            <i class="fas fa-heading"></i>
            <input type="text" id="projectTitle" placeholder="Project Title" required />
          </div>
          <div class="input-group">
            <i class="fas fa-tag"></i>
            <input type="text" id="projectCategory" placeholder="Category (e.g., Web App, Mobile App)" required />
          </div>
          <div class="input-group">
            <i class="fas fa-tools"></i>
            <input type="text" id="projectTechnologies" placeholder="Technologies (comma separated)" required />
          </div>
          <div class="input-group">
            <i class="fas fa-info-circle"></i>
            <select id="projectStatus" required>
              <option value="">Select Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Planning">Planning</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div class="input-group">
            <i class="fas fa-image"></i>
            <input type="url" id="projectImage" placeholder="Project Image URL" />
          </div>
          <div class="input-group">
            <i class="fas fa-link"></i>
            <input type="url" id="projectLiveUrl" placeholder="Live Demo URL (optional)" />
          </div>
          <div class="input-group">
            <i class="fab fa-github"></i>
            <input type="url" id="projectGithubUrl" placeholder="GitHub Repository URL (optional)" />
          </div>
          <div class="input-group full-width">
            <i class="fas fa-align-left"></i>
            <textarea id="projectDescription" placeholder="Project Description" rows="4" required></textarea>
          </div>
        </div>
        <div class="modal-actions">
          <button type="submit" class="save-btn">
            <i class="fas fa-save"></i>
            Save Project
          </button>
          <button type="button" class="cancel-btn" onclick="document.getElementById('cancelProjectBtn').click()">
            <i class="fas fa-times"></i>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Certification Modal -->
  <div id="certModal" class="modal">
    <div class="modal-content">
      <form class="cert-form" id="certForm">
        <div class="modal-header">
          <h2 id="certFormTitle"><i class="fas fa-certificate"></i> Add Certification</h2>
          <button type="button" class="close-btn" id="cancelCertBtn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <input type="hidden" id="certId" />
        <div class="form-grid">
          <div class="input-group">
            <i class="fas fa-heading"></i>
            <input type="text" id="certTitle" placeholder="Certification/Achievement Title" required />
          </div>
          <div class="input-group">
            <i class="fas fa-tag"></i>
            <select id="certType" required>
              <option value="">Select Type</option>
              <option value="Certification">Certification</option>
              <option value="Achievement">Achievement</option>
              <option value="Award">Award</option>
              <option value="Honor">Honor</option>
            </select>
          </div>
          <div class="input-group">
            <i class="fas fa-building"></i>
            <input type="text" id="certIssuer" placeholder="Issuing Organization" required />
          </div>
          <div class="input-group">
            <i class="fas fa-calendar"></i>
            <input type="date" id="certDate" required />
          </div>
          <div class="input-group">
            <i class="fas fa-calendar"></i>
            <input type="date" id="certExpiryDate" placeholder="Expiry Date (if applicable)" />
          </div>
          <div class="input-group">
            <i class="fas fa-image"></i>
            <input type="url" id="certImage" placeholder="Certificate Image URL" />
          </div>
          <div class="input-group">
            <i class="fas fa-external-link-alt"></i>
            <input type="url" id="certVerificationUrl" placeholder="Verification URL (optional)" />
          </div>
          <div class="input-group full-width">
            <i class="fas fa-align-left"></i>
            <textarea id="certDescription" placeholder="Description (optional)" rows="3"></textarea>
          </div>
        </div>
        <div class="modal-actions">
          <button type="submit" class="save-btn">
            <i class="fas fa-save"></i>
            Save Certification
          </button>
          <button type="button" class="cancel-btn" onclick="document.getElementById('cancelCertBtn').click()">
            <i class="fas fa-times"></i>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>

  <script src="admin.js"></script>
</body>
</html>