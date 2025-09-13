<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="PortfolioWebsite.index" %>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Jahid Hasan - Full Stack Developer & AI Enthusiast Portfolio" />
    <meta name="keywords" content="web developer, AI, machine learning, full stack, portfolio" />
    <meta name="author" content="Jahid Hasan" />
    
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" integrity="sha512-Avb2QiuDEEvB4bZJYdft2mNjVShBftLdPG8FJ0V7irTLQ8Uo0qcPxh4Plq7G5tGm0rU+1SPhVotteLpBERwTkw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <script>
      (function () {
        try {
          var theme = localStorage.getItem('portfolio_theme');
          if (!theme) {
            var prefs = {};
            try { prefs = JSON.parse(localStorage.getItem('portfolio_preferences') || '{}'); } catch (e) { prefs = {}; }
            theme = prefs.theme || 'auto';
          }
          var root = document.documentElement;
          if (theme === 'light' || theme === 'dark') {
            root.setAttribute('data-theme', theme);
          } else {
            root.removeAttribute('data-theme');
          }
        } catch (e) { /* noop */ }
      })();
    </script>

  <!-- Stylesheets -->
    <link rel="stylesheet" href="style1.css" />
    <link rel="stylesheet" href="admin.css" />
    
    <!-- PWA -->
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#0077b6">
    
    <title>Jahid Hasan - Portfolio | Full Stack Developer & AI Enthusiast</title>
    <script src="scripts/sync.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            if (window.setupIndexLiveRefresh) window.setupIndexLiveRefresh();
        });
    </script>
  </head>
  <body>
    <header>
      <img src="img/logo1.png" alt="Logo" class="logo" />
      <nav id="navbar">
        <a href="#hero" class="active">Home</a>
        <a href="#about">About</a>
        <a href="#education">Education</a>
        <a href="#technical-skills">Technical Skills</a>
        <a href="#myworks">Projects</a>
        <a href="#certifications">Certifications & Achievements</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="header-right">
        <a href="resume.pdf" target="_blank" class="resume-btn">
          <i class="fas fa-download"></i> Resume
        </a>

        
      </div>
      <button id="navToggle" class="hamburger" aria-label="Open navigation">
        <span></span><span></span><span></span>
      </button>
      <button
        id="adminMenuBtn"
        class="admin-menu-btn"
        aria-label="Open admin menu"
      >
        <i class="fas fa-ellipsis-v"></i>
      </button>
  <a href="admin.aspx" class="admin-text" aria-label="Go to admin">Admin</a>
    </header>

    <section id="hero">
      <div id="particles-js"></div>
      <!-- Social Sidebar -->
      <div class="social-icons">
    <a href="https://github.com/Jahid-kuet" target="_blank"
          ><i class="fab fa-github"></i
        ></a>
    <a href="https://www.linkedin.com/in/jahid-hasan" target="_blank"
          ><i class="fab fa-linkedin"></i
        ></a>
    <a href="https://www.instagram.com/j_a_h_i_d_064?igsh=YzQzZjh5MXlqaGFp" target="_blank"
          ><i class="fab fa-instagram"></i
        ></a>
    <a href="https://www.facebook.com/share/17JBqoiSyD/" target="_blank"
          ><i class="fab fa-facebook"></i
        ></a>
    <a href="https://x.com/Jahidhasan064" target="_blank"
          ><i class="fab fa-twitter"></i
        ></a>
  <a href="#contact" aria-label="Go to contact section"><i class="fas fa-envelope"></i></a>
      </div>
      <div class="hero-content">
        <h1>Hi, I'm <span class="highlight">Jahid Hasan</span></h1>
        <p id="typingText"></p>
        <p class="intro-text">
          I’m a creative problem solver and passionate engineer, blending code
          and design to build impactful mobile and web experiences. I love
          learning new technologies, collaborating on innovative projects, and
          turning ideas into reality.
        </p>
        <a href="#myworks" class="btn">View My Work</a>
      </div>
      <div id="myimg">
        <img src="img/2107064.jpg" alt="My Photo" />
      </div>
    </section>

    <section id="about" class="fade_in">
      <div class="about-container">
        <!-- Left side: Photo -->
        <div class="about-photo">
          <img src="img/myphoto.jpg" alt="Jahid Hasan" />
        </div>

        <!-- Right side: About Content -->
        <div class="about-content">
          <h2>About Me</h2>
          <p>
            Hi! I'm <span class="highlight">Jahid Hasan</span>, currently
            pursuing my
            <strong>B.Sc. in Computer Science and Engineering</strong> at
            <span class="highlight">KUET</span>. I have a strong passion for
            <span class="highlight">machine learning</span>,
            <span class="highlight">computer vision</span>,
            <span class="highlight">drone systems</span>, and
            <span class="highlight">full-stack web development</span>.
          </p>
          <p>
            Right now, I’m conducting research on
            <span class="highlight"
              >face detection and recognition using YOLOv8 and DeepFace</span
            >, <span class="highlight">drone swarm technologies</span>, and
            <span class="highlight">real-time autonomous flight systems</span>.
            I enjoy solving challenging problems and transforming ideas into
            impactful projects.
          </p>
          <p>
            Apart from academics, I love
            <span class="highlight">learning new tech stacks</span>,
            <span class="highlight">building automation scripts</span>,
            <span class="highlight">reading research papers</span>, and
            <span class="highlight">sharing knowledge with my community</span>.
            My long-term goal is to contribute to
            <span class="highlight">AI-powered robotics</span> and
            <span class="highlight">intelligent drone systems</span>.
          </p>
          <p>
            I completed my high school at
            <strong>Bhatbari Ideal High School</strong>, Cumilla, and college at
            <strong>Government Science College</strong>, Dhaka.
          </p>
        </div>
      </div>
    </section>

    <section id="education">
      <h2>Education</h2>
      <div class="edu-container">
        <!-- Primary -->
        <div class="edu-item fade-in">
          <img
            src="img/primary_logo1.jpg"
            alt="Shiber Bazar Govt. Primary School Logo"
            class="edu-logo"
          />
          <div class="edu-details">
            <h3>Primary School</h3>
            <p>Shiber Bazar Government Primary School, Cumilla</p>
            <p><strong>PSC Result:</strong> A</p>
          </div>
        </div>

        <!-- High School -->
        <div class="edu-item fade-in">
          <img
            src="img/high_school_logo.jpeg"
            alt="Bhatbari Ideal High School Logo"
            class="edu-logo"
          />
          <div class="edu-details">
            <h3>High School</h3>
            <p>Bhatbari Ideal High School, Cumilla</p>
            <p>
              <strong>JSC:</strong> A+ | <strong>SSC:</strong> A+ (Science
              Group)
            </p>
          </div>
        </div>

        <!-- College -->
        <div class="edu-item fade-in">
          <img
            src="img/GSC_logo.jpeg"
            alt="Govt. Science College Logo"
            class="edu-logo"
          />
          <div class="edu-details">
            <h3>College</h3>
            <p>Government Science College, Dhaka</p>
            <p><strong>HSC:</strong> A+ (Science Group)</p>
          </div>
        </div>

        <!-- University -->
        <div class="edu-item fade-in">
          <img src="img/kuet_logo.png" alt="KUET Logo" class="edu-logo" />
          <div class="edu-details">
            <h3>University</h3>
            <p>
              Khulna University of Engineering and Technology (KUET), Khulna
            </p>
            <div class="edu-results">
              <h4>Academic Results</h4>
              <ul>
                <li>1st Semester: <span>3.67</span></li>
                <li>2nd Semester: <span>3.86</span></li>
                <li>3rd Semester: <span>3.80</span></li>
                <li>4th Semester: <span>3.86</span></li>
              </ul>
              <p class="total-cgpa">Current CGPA: <strong>3.80</strong></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TECHNICAL SKILLS ===== -->
    <section id="technical-skills">
      <h2 class="section-title">Technical Skills</h2>
      <div class="skills-container">
        <!-- Programming Languages -->
        <div class="skill-card fade-in">
          <h3>Programming Languages</h3>
          <ul>
            <li>
              <img src="img/letter-c.png" alt="C" /> C
              <span class="badge expert">Expert</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 80%"></span
              ></span>
            </li>
            <li>
              <img src="img/c++.png" alt="C++" /> C++
              <span class="badge expert">Expert</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 80%"></span
              ></span>
            </li>
            <li>
              <img src="img/java.png" alt="Java" /> Java
              <span class="badge advanced">Advanced</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 70%"></span
              ></span>
            </li>
            <li>
              <img src="img/machine.png" alt="Assembly" /> Assembly
              <span class="badge intermediate">Intermediate</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 60%"></span
              ></span>
            </li>
            <li>
              <img src="img/python.png" alt="Python" /> Python
              <span class="badge advanced">Advanced</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 70%"></span
              ></span>
            </li>
            <li>
              <img src="img/c-sharp.png" alt="C#" /> C#
              <span class="badge intermediate">Intermediate</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 60%"></span
              ></span>
            </li>
            <li>
              <img src="img/php.png" alt="PHP" /> PHP
              <span class="badge intermediate">Intermediate</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 60%"></span
              ></span>
            </li>
          </ul>
        </div>

        <!-- Web Development -->
        <div class="skill-card fade-in">
          <h3>Web Development</h3>
          <ul>
            <li>
              <img src="img/html-5.png" alt="HTML" /> HTML
              <span class="badge expert">Expert</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 80%"></span
              ></span>
            </li>
            <li>
              <img src="img/css.png" alt="CSS" /> CSS
              <span class="badge expert">Expert</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 80%"></span
              ></span>
            </li>
            <li>
              <img src="img/java-script.png" alt="JavaScript" /> JavaScript
              <span class="badge advanced">Advanced</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 70%"></span
              ></span>
            </li>
            <li>
              <img src="img/web.png" alt="ASP.NET" /> ASP.NET
              <span class="badge intermediate">Intermediate</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 60%"></span
              ></span>
            </li>
          </ul>
        </div>

        <!-- AI & ML -->
        <div class="skill-card fade-in">
          <h3>Artificial Intelligence & Machine Learning</h3>
          <ul>
            <li>
              <img src="img/machine-learning.png" alt="Machine Learning" />
              Machine Learning <span class="badge advanced">Advanced</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 70%"></span
              ></span>
            </li>
            <li>
              <img src="img/artificial-intelligence.png" alt="AI" /> Artificial
              Intelligence <span class="badge advanced">Advanced</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 70%"></span
              ></span>
            </li>
            <li>
              <img src="img/computer.png" alt="Deep Learning" /> Deep Learning
              <span class="badge intermediate">Intermediate</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 60%"></span
              ></span>
            </li>
          </ul>
        </div>

        <!-- Problem Solving & Projects -->
        <div class="skill-card fade-in">
          <h3>Problem Solving & Projects</h3>
          <ul>
            <li>
              <img src="img/codeforces.png" alt="Codeforces" /> Codeforces
              <span class="badge advanced">Advanced</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 70%"></span
              ></span>
            </li>
            <li>
              <img src="img/leetcode.png" alt="LeetCode" /> LeetCode
              <span class="badge advanced">Advanced</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 80%"></span
              ></span>
            </li>
            <li>
              <img src="img/drone.png" alt="Drone Systems" /> Drone Systems
              <span class="badge intermediate">Intermediate</span>
              <span class="skill-bar"
                ><span class="skill-bar-fill" style="width: 60%"></span
              ></span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section id="myworks" class="fade_in">
      <h2>My Works</h2>

      <div class="works-category">
        <div class="project-grid">
          <asp:Repeater ID="rptProjects" runat="server">
            <ItemTemplate>
              <div class="project-card">
                <img src='<%# Eval("ProjectImage") %>' alt='<%# Eval("ProjectTitle") %>' />
                <div class="project-content">
                  <h4><%# Eval("ProjectTitle") %></h4>
                  <p><%# Eval("ProjectDescription") %></p>
                  <a href='<%# Eval("GitHubLink") %>' target="_blank" class="btn">View on GitHub</a>
                </div>
              </div>
            </ItemTemplate>
          </asp:Repeater>
        </div>
      </div>
    </section>

    <!-- ===== CERTIFICATIONS & ACHIEVEMENTS ===== -->
    <section id="certifications">
  <h2 class="section-title">Certifications & Achievements</h2>
  <div class="certifications-container">
    <asp:Repeater ID="rptCertifications" runat="server">
      <ItemTemplate>
        <div class="cert-card fade-in">
          <img src='<%# Eval("CertImage") %>' alt='<%# Eval("CertTitle") %>' />
          <div class="cert-content">
            <h3><%# Eval("CertTitle") %></h3>
            <p><%# Eval("CertDescription") %></p>
            <span class="date"><%# Convert.ToDateTime(Eval("IssueDate")).ToString("yyyy") %></span>
          </div>
        </div>
      </ItemTemplate>
    </asp:Repeater>
  </div>
</section>



    <!-- ==== IMAGE MODAL ==== -->
    <div id="imgModal" class="modal">
      <span class="close">&times;</span>
      <img class="modal-content" id="modalImage" />
    </div>

    <section id="contact" class="fade_in">
      <h2 class="section-title">Contact</h2>
      <div class="contact-container">
        <!-- Contact Info -->
        <div class="contact-info">
          <h3>Get in Touch</h3>
          <p><i class="fas fa-user"></i> Jahid Hasan</p>
          <p><i class="fas fa-map-marker-alt"></i> Khulna, Bangladesh</p>
          <p><i class="fas fa-envelope"></i> hasan2107064@stud.kuet.ac.bd</p>
          <p>
            <i class="fab fa-github"></i>
            <a href="https://github.com/Jahid-kuet" target="_blank">GitHub</a>
          </p>
          <p>
            <i class="fab fa-linkedin"></i>
            <a href="https://linkedin.com/in/jahid-hasan" target="_blank"
              >LinkedIn</a
            >
          </p>
        </div>

        <!-- Contact Form -->
        <form
          action="#"
          method="POST"
          enctype="text/plain"
          class="contact-form"
        >
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>

    <footer>
      <p>@2025 Jahid Hasan | All Rights Reserved</p>
    </footer>
    <!--project image preview model-->
    <div id="imgModal" class="modal">
      <span class="close">&times;</span>
      <img class="modal-content" id="modalImage" />
    </div>
    <!--back on top button-->
    <button id="backToTop">↑</button>
    <!-- adding js -->
    <script src="https://cdn.jsdelivr.net/npm/particles.js"></script>
  <script src="first1.js?v=20250914"></script>
    <div id="adminModalContainer"></div>
    <script src="admin.js"></script>
  </body>
</html>


