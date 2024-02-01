// ===================================================
import { loadTopPage, showTopPanelOptions, hideTopPanelOptions} from "./top-panel.js";
// ===================================================
const emailForm = document.getElementById("email");

const firstNameForm = document.getElementById("first-name");
const lastNameForm = document.getElementById("last-name");

const passwordForm = document.getElementById("password");
const passwordConfirmationForm = document.getElementById("password-confirmation");

const passwordFormIcon = document.getElementById("password-preview");
const passwordConfirmationFormIcon = document.getElementById("confirm-password-preview");

const emailWarningText = document.getElementById("warning-text-email");
const passwordWarningText = document.getElementById("warning-text-password");
const passwordConfirmationWarningText = document.getElementById("warning-text-password-confirmation");

const unlockedSrc = "../../images/auth/eye-unlocked.svg";
const lockedSrc = "../../images/auth/eye-locked.svg";

const minimumPaswordCharacterCount = 8;
const regexUpperLetters = /[A-z]/;
const regexLowerLetters = /[a-z]/;
const regexNumbers = /[0-9]/;
const regexSymbols = /[^a-zA-z0-9]/;
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
function changePasswordType(formType) {
  switch (formType) {
    case "password":
      passwordForm.type = passwordForm.type === "password" ? "text" : "password";
      passwordFormIcon.src = passwordForm.type === "text" ? unlockedSrc : lockedSrc;
        
      break;
    case "password-confirmation":
      passwordConfirmationForm.type = passwordConfirmationForm.type === "password" ? "text" : "password";
      passwordConfirmationFormIcon.src = passwordConfirmationForm.type === "text" ? unlockedSrc : lockedSrc;
      
      break;
  }
}
// ===================================================
function register() {
  // ====================================
  // Stops the submit button from refreshing the page.
  event.preventDefault();

  // Debug - Reset Keys.
  //localStorage.removeItem("users");
  //localStorage.removeItem("uniqueID");
  //localStorage.removeItem("activeUser");
  // ====================================
  const email = emailForm.value;
  const name = firstNameForm.value + " " + lastNameForm.value;
  
  const password = passwordForm.value;
  const passwordConfirmation = passwordConfirmationForm.value;
  // ====================================
  if (passwordConfirmation != password) {
    passwordConfirmationWarningText.textContent = `Password does not much with confirmation.`;
    return;
  }
  else 
    passwordConfirmationWarningText.textContent = "";
  // ====================================
  let cachedUsers = localStorage.getItem("users");
  if (cachedUsers === null || cachedUsers === undefined || cachedUsers.trim().length === 0)
    cachedUsers = [];
  else
    cachedUsers = JSON.parse(cachedUsers);
  
  // Debug
  //console.log("Cached Users.", cachedUsers);

  let nextUserID = localStorage.getItem("uniqueID");
  if (nextUserID === null || nextUserID === undefined || nextUserID.trim().length === 0)
    nextUserID = 1;
  else
    nextUserID = JSON.parse(nextUserID);
  
  // Debug
  //console.log("Next Available User ID.", nextUserID);
  // ====================================
  const existingUser = cachedUsers.find((element) => element.email === email);
  
  //const passwordFilter = regexUpperLetters.test(password) & regexLowerLetters.test(password) & 
    //regexNumbers.test(password) & regexSymbols.test(password);
  let passwordFilter = regexUpperLetters.test(password);
  passwordFilter &= regexLowerLetters.test(password);
  passwordFilter &= regexNumbers.test(password);
  passwordFilter &= regexSymbols.test(password);

  // User already existed in the registered list.
  if (existingUser !== null && existingUser !== undefined) {
    emailWarningText.textContent = `Email (${email}) is already in use.`;
    return;
  }
  // Less than minimum number of characters (Password).
  else if (password.length < minimumPaswordCharacterCount) {
    passwordWarningText.textContent = `Password cannot be less than ${minimumPaswordCharacterCount} characters.`;
    return;
  }
  // Password Filter (Must meet the conditions - 1 symbol, number, lowercase letter and uppcase letter)
  else if (!passwordFilter) {
    passwordWarningText.textContent = "Password must contain at least 1 symbol, number, upper case letter and lower case letter";
    return;
  }
  else {
    emailWarningText.textContent = "";
    passwordWarningText.textContent = "";
  }
  // ====================================
  const newUserData = {
    id: nextUserID,
    name: name,
    email: email,
    password: password,
    taskList: []
  };
  
  cachedUsers.push(newUserData);

  // Debug
  //console.log("Saved Users.", cachedUsers);
  // ====================================
  localStorage.setItem("users", JSON.stringify(cachedUsers));
  localStorage.setItem("uniqueID", JSON.stringify(nextUserID + 1));
  // ====================================
  onMoveToPage("../../subdirectories/auth/login.html");
}
// ===================================================
window.onPageLoaded = onPageLoaded;

window.changePasswordType = changePasswordType;
window.register = register;

window.onMoveToPage = onMoveToPage;
window.onMoveToAuthPage = onMoveToAuthPage;

window.showTopPanelOptions = showTopPanelOptions;
window.hideTopPanelOptions = hideTopPanelOptions;
// ===================================================