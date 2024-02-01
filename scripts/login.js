// ===================================================
import { loadTopPage } from "./top-panel.js";
// ===================================================
const emailForm = document.getElementById("email");

const passwordForm = document.getElementById("password");
const passwordFormIcon = document.getElementById("password-preview");
const loginWarningText = document.getElementById("warning-text-login");

const unlockedSrc = "../../images/auth/eye-unlocked.svg";
const lockedSrc = "../../images/auth/eye-locked.svg";
// ===================================================
function onPageLoaded() {
  loadTopPage();
}
// ===================================================
function onMoveToPage(page) {
  window.location.href = page;
}

function onMoveToAuthPage(isNewUser) {
  window.location.href = `./subdirectories/auth/${isNewUser === "true" ? "register" : "login"}.html`;
}
// ===================================================
function changePasswordType() {
  passwordForm.type = passwordForm.type === "password" ? "text" : "password";
  passwordFormIcon.src = passwordForm.type === "text" ? unlockedSrc : lockedSrc;
}
// ===================================================
function login() {
  // ====================================
  // Stops the submit button from refreshing the page.
  event.preventDefault();

  // Debug - Reset Keys.
  //localStorage.removeItem("users");
  //localStorage.removeItem("uniqueID");
  // ====================================
  const email = emailForm.value;
  const password = passwordForm.value;
  // ====================================
  let cachedUsers = localStorage.getItem("users");
  if (cachedUsers === null || cachedUsers === undefined || cachedUsers.trim().length === 0) {
    showInvalidUserWarning();
    return;
  }
  else
    cachedUsers = JSON.parse(cachedUsers);
  
  // Debug
  //console.log("Cached Users.", cachedUsers);
  // ====================================
  const existingUser = cachedUsers.find((element) => element.email === email && element.password === password);

  // User/Password combination does not exist.
  if (existingUser === null || existingUser === undefined) {
    showInvalidUserWarning();
    return;
  }

  // Debug
  //console.log("Loaded User.", existingUser);
  // ====================================
  localStorage.setItem("activeUser", JSON.stringify(existingUser));
  onMoveToPage("../../index.html");
}

function showInvalidUserWarning() {
  loginWarningText.textContent = "Invalid email or password.";
}
// ===================================================
window.onPageLoaded = onPageLoaded;

window.changePasswordType = changePasswordType;
window.login = login;

window.onMoveToPage = onMoveToPage;
window.onMoveToAuthPage = onMoveToAuthPage;
// ===================================================