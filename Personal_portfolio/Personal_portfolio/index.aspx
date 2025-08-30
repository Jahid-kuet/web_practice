<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="Personal_portfolio.WebForm1" %>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
      integrity="sha512-DxV+EoADOkOygM4IR9yXP8Sb2qwgidEmeqAEmDKIOfPRQZOWbXCzLC6vjbZyy0vPisbH2SyW27+ddLVCN+OMzQ=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <title>My Portfolio</title>
    <link rel="stylesheet" href="style1.css" />
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

        <!-- Theme Toggle with Dropdown -->
        <div class="theme-container">
          <button id="themeToggle">
            <i class="fas fa-moon"></i>
          </button>
          <div class="theme-options" id="themeOptions">
            <button class="theme-btn" data-theme="light">Light Mode</button>
            <button class="theme-btn" data-theme="dark">Dark Mode</button>
          </div>
        </div>
      </div>
    </header>

    <section id="hero">
      <div id="particles-js"></div>
      <!-- Social Sidebar -->
      <div class="social-icons">
        <a href="https://github.com/yourusername" target="_blank"
          ><i class="fab fa-github"></i
        ></a>
        <a href="https://linkedin.com/in/yourusername" target="_blank"
          ><i class="fab fa-linkedin"></i
        ></a>
        <a href="https://instagram.com/yourusername" target="_blank"
          ><i class="fab fa-instagram"></i
        ></a>
        <a href="https://facebook.com/yourusername" target="_blank"
          ><i class="fab fa-facebook"></i
        ></a>
        <a href="https://twitter.com/yourusername" target="_blank"
          ><i class="fab fa-twitter"></i
        ></a>
        <a href="mailto:your@email.com"><i class="fas fa-envelope"></i></a>
      </div>
      <div class="hero-content">
        <h1>Hi, I'm <span class="highlight">Jahid Hasan</span></h1>
        <p id="typingText"></p>
        <p class="intro-text">
          A passionate Mobile Engineer specializing in <b>React Native</b> and
          <b>full-stack development</b>. With hands-on experience building
          cross-platform mobile apps, I love creating elegant, scalable, and
          high-performance solutions that improve user experiences.
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
            src="img/primary_logo1.webp"
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
            </li>
            <li>
              <img src="img/c++.png" alt="C++" /> C++
              <span class="badge expert">Expert</span>
            </li>
            <li>
              <img src="img/java.png" alt="Java" /> Java
              <span class="badge advanced">Advanced</span>
            </li>
            <li>
              <img src="img/machine.png" alt="Assembly" /> Assembly
              <span class="badge intermediate">Intermediate</span>
            </li>
            <li>
              <img src="img/python.png" alt="Python" /> Python
              <span class="badge advanced">Advanced</span>
            </li>
            <li>
              <img src="img/c-sharp.png" alt="C#" /> C#
              <span class="badge intermediate">Intermediate</span>
            </li>
            <li>
              <img src="img/php.png" alt="PHP" /> PHP
              <span class="badge intermediate">Intermediate</span>
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
            </li>
            <li>
              <img src="img/css.png" alt="CSS" /> CSS
              <span class="badge expert">Expert</span>
            </li>
            <li>
              <img src="img/java-script.png" alt="JavaScript" /> JavaScript
              <span class="badge advanced">Advanced</span>
            </li>
            <li>
              <img src="img/web.png" alt="ASP.NET" /> ASP.NET
              <span class="badge intermediate">Intermediate</span>
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
            </li>
            <li>
              <img src="img/artificial-intelligence.png" alt="AI" /> Artificial
              Intelligence <span class="badge advanced">Advanced</span>
            </li>
            <li>
              <img src="img/computer.png" alt="Deep Learning" /> Deep Learning
              <span class="badge intermediate">Intermediate</span>
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
            </li>
            <li>
              <img src="img/leetcode.png" alt="LeetCode" /> LeetCode
              <span class="badge advanced">Advanced</span>
            </li>
            <li>
              <img src="img/drone.png" alt="Drone Systems" /> Drone Systems
              <span class="badge intermediate">Intermediate</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section id="myworks" class="fade_in">
      <h2>My Works</h2>

      <!-- GitHub Section -->
      <div class="works-category">
        <h3>GitHub Projects</h3>
        <div class="project-grid">
          <div class="project-card">
            <img
              src="img/numerical_lab1.jpeg"
              alt="Numerical Method Assignment"
            />
            <div class="project-content">
              <h4>Numerical Method Assignment</h4>
              <p>
                Solutions of different numerical methods assignments including
                linear equations, ODE, and integration.
              </p>
              <a
                href="https://github.com/Jahid-kuet/NemericalMethodLaboratoryAssignment_35"
                target="_blank"
                class="btn"
                >View on GitHub</a
              >
            </div>
          </div>

          <div class="project-card">
            <img src="img/numerical.avif" alt="Numerical Method Lab" />
            <div class="project-content">
              <h4>Numerical Method Lab</h4>
              <p>
                Self-implemented algorithms for numerical methods with
                step-by-step solutions and examples.
              </p>
              <a
                href="https://github.com/Jahid-kuet/Numerical_method_Laboratory_self"
                target="_blank"
                class="btn"
                >View on GitHub</a
              >
            </div>
          </div>

          <div class="project-card">
            <img src="img/human_activity.png" alt="Human Activity Detection" />
            <div class="project-content">
              <h4>Human Activity Detection</h4>
              <p>
                Deep learning model that recognizes and classifies human
                activities using sensor and video data.
              </p>
              <a
                href="https://github.com/Kuet-BD-Org/human_activity"
                target="_blank"
                class="btn"
                >View on GitHub</a
              >
            </div>
          </div>

          <div class="project-card">
            <img src="img/face_detection.png" alt="Face Detection" />
            <div class="project-content">
              <h4>Face Detection</h4>
              <p>
                Computer vision project using OpenCV to detect human faces in
                images and real-time video streams.
              </p>
              <a
                href="https://github.com/Kuet-BD-Org/Face_Detection"
                target="_blank"
                class="btn"
                >View on GitHub</a
              >
            </div>
          </div>

          <div class="project-card">
            <img src="img/ecommerce_api.jpg" alt="eCommerce API" />
            <div class="project-content">
              <h4>eCommerce Web API</h4>
              <p>
                A RESTful API built with Java for managing products, users, and
                orders in an eCommerce system.
              </p>
              <a
                href="https://github.com/Jahid-kuet/ecommserse-web-api"
                target="_blank"
                class="btn"
                >View on GitHub</a
              >
            </div>
          </div>

          <div class="project-card">
            <img src="img/placement.jpg" alt="Placement Prediction" />
            <div class="project-content">
              <h4>Placement Prediction</h4>
              <p>
                Machine learning project predicting student placement outcomes
                based on academic performance.
              </p>
              <a
                href="https://github.com/Jahid-kuet/Placement_Prediction"
                target="_blank"
                class="btn"
                >View on GitHub</a
              >
            </div>
          </div>

          <div class="project-card">
            <img src="img/face_recognition.jpeg" alt="Face Recognition" />
            <div class="project-content">
              <h4>Face Recognition</h4>
              <p>
                Face recognition system combining YOLO and FaceNet for accurate
                identity verification.
              </p>
              <a
                href="https://github.com/Kuet-BD-Org/face-recognition"
                target="_blank"
                class="btn"
                >View on GitHub</a
              >
            </div>
          </div>

          <div class="project-card">
            <img src="img/deepface.png" alt="YOLO with DeepFace" />
            <div class="project-content">
              <h4>YOLO with DeepFace</h4>
              <p>
                YOLO integrated with DeepFace for real-time face recognition and
                detection applications.
              </p>
              <a
                href="https://github.com/Kuet-BD-Org/yolo-deepface"
                target="_blank"
                class="btn"
                >View on GitHub</a
              >
            </div>
          </div>
        </div>
      </div>
    </section>
<!-- ===== CERTIFICATIONS & ACHIEVEMENTS ===== -->
<section id="certifications">
  <h2 class="section-title">Certifications & Achievements</h2>
  <div class="certifications-container">
    
    <!-- Dean's Award 1st Year -->
    <div class="cert-card fade-in">
      <img src="img/deans1.jpg" alt="Dean's Award 1st Year" />
      <div class="cert-content">
        <h3>Dean's Award – 1st Year</h3>
        <p>Recognized for exceptional academic performance with CGPA above 3.75.</p>
        <span class="date">2023</span>
      </div>
    </div>

    <!-- Dean's Award 2nd Year -->
    <div class="cert-card fade-in">
      <img src="img/certi.jpg" alt="Dean's Award 2nd Year" />
      <div class="cert-content">
        <h3>Dean's Award – 2nd Year</h3>
        <p>Achieved the Dean's Award again for CGPA above 3.75 across the year.</p>
        <span class="date">2024</span>
      </div>
    </div>

    <!-- Competitive Hackathon -->
    <div class="cert-card fade-in">
      <img src="img/certi3.jpg" alt="Hackathon Winner" />
      <div class="cert-content">
        <h3>Hackathon Winner</h3>
        <p>1st place at KUET Inter-University Hackathon with an AI-powered project.</p>
        <span class="date">2024</span>
      </div>
    </div>

    <!-- Machine Learning Specialization -->
    <div class="cert-card fade-in">
      <img src="img/deans1.jpg" alt="Machine Learning Specialization" />
      <div class="cert-content">
        <h3>Machine Learning Specialization</h3>
        <p>Completed Coursera's ML Specialization by Andrew Ng, gaining hands-on ML experience.</p>
        <span class="date">2023</span>
      </div>
    </div>
  </div>
</section>

<!-- ==== IMAGE MODAL ==== -->
<div id="imgModal" class="modal">
  <span class="close">&times;</span>
  <img class="modal-content" id="modalImage" />
</div>

    <section id="contact" class="fade_in">
      <h2>Contact</h2>
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
          action="mailto:hasan2107064@stud.kuet.ac.bd"
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
    <script src="first1.js"></script>
  </body>
</html>
