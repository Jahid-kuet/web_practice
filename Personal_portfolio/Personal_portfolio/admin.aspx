<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="admin.aspx.cs" Inherits="Personal_portfolio.WebForm2" %>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Admin Panel - Portfolio</title>
  <link rel="stylesheet" href="admin.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"/>
</head>
<body>
  <!-- Sidebar -->
  <aside class="sidebar">
    <h2>Admin Panel</h2>
    <nav>
      <a href="#dashboard"><i class="fas fa-home"></i> Dashboard</a>
      <a href="#projects"><i class="fas fa-folder"></i> Projects</a>
      <a href="#skills"><i class="fas fa-code"></i> Skills</a>
      <a href="#certifications"><i class="fas fa-award"></i> Certifications</a>
      <a href="index.html"><i class="fas fa-globe"></i> Back to Portfolio</a>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="content">
    <section id="dashboard">
      <h1>Welcome, Admin</h1>
      <p>Use the sidebar to manage your portfolio content.</p>
    </section>

    <!-- Projects -->
    <section id="projects">
      <h2>Manage Projects</h2>
      <button class="add-btn">+ Add Project</button>
      <table>
        <thead>
          <tr><th>Title</th><th>Description</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Face Detection</td>
            <td>OpenCV real-time face detection.</td>
            <td>
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Skills -->
    <section id="skills">
      <h2>Manage Skills</h2>
      <button class="add-btn">+ Add Skill</button>
      <table>
        <thead>
          <tr><th>Skill</th><th>Level</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Python</td>
            <td>Advanced</td>
            <td>
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Certifications -->
    <section id="certifications">
      <h2>Manage Certifications</h2>
      <button class="add-btn">+ Add Certification</button>
      <table>
        <thead>
          <tr><th>Title</th><th>Year</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Dean’s Award – 1st Year</td>
            <td>2023</td>
            <td>
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>
<!-- Back to Top Button -->
<button id="backToTop" title="Back to Top"><i class="fas fa-chevron-up"></i></button>


