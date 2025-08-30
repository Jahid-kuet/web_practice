// --- Admin Login ---
document.addEventListener("DOMContentLoaded", function () {
  const loginModal = document.getElementById("loginModal");
  const loginForm = document.getElementById("adminLoginForm");
  const loginMsg = document.getElementById("adminLoginMsg");

  // Show login modal on load
  loginModal.classList.add("active");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();
    if (username === "admin" && password === "admin123") {
      loginMsg.textContent = "Login successful!";
      loginMsg.style.color = "#0077b5";
      setTimeout(() => {
        loginModal.classList.remove("active");
      }, 700);
    } else {
      loginMsg.textContent = "Invalid username or password.";
      loginMsg.style.color = "#e53e3e";
    }
  });

  // --- Password & Remember Me ---
  // Default password if not set
  if (!localStorage.getItem("adminPwd")) {
    localStorage.setItem("adminPwd", "admin123");
  }

  // Remember login
  if (localStorage.getItem("adminLoggedIn") === "true") {
    loginModal.classList.remove("active");
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();
    const savedPwd = localStorage.getItem("adminPwd");
    if (username === "admin" && password === savedPwd) {
      loginMsg.textContent = "Login successful!";
      loginMsg.style.color = "#0077b5";
      localStorage.setItem("adminLoggedIn", "true");
      setTimeout(() => {
        loginModal.classList.remove("active");
      }, 700);
    } else {
      loginMsg.textContent = "Invalid username or password.";
      loginMsg.style.color = "#e53e3e";
    }
  });

  // Logout
  document.getElementById("logoutBtn").onclick = function () {
    localStorage.setItem("adminLoggedIn", "false");
    location.reload();
  };

  // --- Change Password Modal ---
  const pwdModal = document.getElementById("pwdModal");
  const pwdForm = document.getElementById("pwdForm");
  const changePwdLink = document.getElementById("changePwdLink");
  const cancelPwdBtn = document.getElementById("cancelPwdBtn");
  const pwdMsg = document.getElementById("pwdMsg");

  changePwdLink.onclick = function () {
    pwdForm.reset();
    pwdMsg.textContent = "";
    pwdModal.classList.add("active");
  };
  cancelPwdBtn.onclick = function () {
    pwdModal.classList.remove("active");
  };
  pwdForm.onsubmit = function (e) {
    e.preventDefault();
    const oldPwd = document.getElementById("oldPwd").value;
    const newPwd = document.getElementById("newPwd").value;
    const savedPwd = localStorage.getItem("adminPwd");
    if (oldPwd !== savedPwd) {
      pwdMsg.textContent = "Old password is incorrect.";
      pwdMsg.style.color = "#e53e3e";
      return;
    }
    if (newPwd.length < 4) {
      pwdMsg.textContent = "New password must be at least 4 characters.";
      pwdMsg.style.color = "#e53e3e";
      return;
    }
    localStorage.setItem("adminPwd", newPwd);
    pwdMsg.textContent = "Password updated!";
    pwdMsg.style.color = "#0077b5";
    setTimeout(() => pwdModal.classList.remove("active"), 900);
  };


  // --- CRUD Table Logic ---
  let users = [
    { id: 1, name: "Jahid Hasan", email: "jahid@email.com", role: "Admin" },
    { id: 2, name: "Jane Doe", email: "jane@email.com", role: "Editor" }
  ];
  let editingId = null;

  const userTableBody = document.querySelector("#userTable tbody");
  const userModal = document.getElementById("userModal");
  const userForm = document.getElementById("userForm");
  const addUserBtn = document.getElementById("addUserBtn");
  const cancelUserBtn = document.getElementById("cancelUserBtn");
  const userFormTitle = document.getElementById("userFormTitle");

  function renderTable() {
    userTableBody.innerHTML = "";
    users.forEach(user => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="edit-btn" data-id="${user.id}">Update</button>
          <button class="delete-btn" data-id="${user.id}">Delete</button>
        </td>
      `;
      userTableBody.appendChild(tr);
    });
  }

  // Show Add User Modal
  addUserBtn.addEventListener("click", () => {
    editingId = null;
    userFormTitle.textContent = "Add User";
    userForm.reset();
    userModal.classList.add("active");
  });

  // Cancel Add/Edit
  cancelUserBtn.addEventListener("click", () => {
    userModal.classList.remove("active");
  });

  // Save User (Add or Update)
  userForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const role = document.getElementById("userRole").value.trim();

    if (!name || !email || !role) return;

    if (editingId) {
      // Update
      const idx = users.findIndex(u => u.id === editingId);
      if (idx !== -1) {
        users[idx] = { id: editingId, name, email, role };
      }
    } else {
      // Add
      const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      users.push({ id: newId, name, email, role });
    }
    userModal.classList.remove("active");
    renderTable();
  });

  // Edit/Delete Handlers
  userTableBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-btn")) {
      const id = Number(e.target.dataset.id);
      const user = users.find(u => u.id === id);
      if (user) {
        editingId = id;
        userFormTitle.textContent = "Update User";
        document.getElementById("userName").value = user.name;
        document.getElementById("userEmail").value = user.email;
        document.getElementById("userRole").value = user.role;
        userModal.classList.add("active");
      }
    }
    if (e.target.classList.contains("delete-btn")) {
      const id = Number(e.target.dataset.id);
      users = users.filter(u => u.id !== id);
      renderTable();
    }
  });

  // Hide modal on outside click
  window.addEventListener("click", function (e) {
    if (e.target === userModal) userModal.classList.remove("active");
    if (e.target === loginModal && !loginModal.classList.contains("active")) loginModal.classList.remove("active");
  });

  renderTable();
});