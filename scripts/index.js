// ===================================================
import { loadDefaultOverviewTable, loadUserTable } from "./overview.js";
import { loadCachedUser as getCachedActiveUser } from "./account-manager.js";

import { 
  promptNewTask, removePendingNewTask, addNewTask, removeDeadlineNew,
  promptModifyTask, stopTaskModification, onCompleteTaskModification, removeDeadlineModify,
  addRandomDistraction, 
  setFilterQuery, setStatusFilterQuery, startFilter
} from "./task-manager.js";

import { loadTopPage, showTopPanelOptions, hideTopPanelOptions} from "./top-panel.js";
// ===================================================
const loginButtonElements = [...document.getElementsByClassName("login")];
const logoutButtonElements = [...document.getElementsByClassName("logout")];
const registerButtonElements = [...document.getElementsByClassName("register")];

const refreshButtonElement = document.getElementById("button-refresh-default-tasks");
const userIDFilterElement = document.getElementById("user-id-filter");
// ===================================================
function onPageLoaded() {
  // Debug - Reset Keys.
  //localStorage.removeItem("users");
  //localStorage.removeItem("uniqueID");
  //localStorage.removeItem("activeUser");

  loadTopPage();

  const user = getCachedActiveUser();

  // Debug
  //console.log("Found User: ", user);

  if (user) {
    loginButtonElements.forEach((button) => button.classList.remove("btn", "btn-danger", "fw-bold"));
    loginButtonElements.forEach((button) => button.classList.add("hidden"));

    logoutButtonElements.forEach((button) => button.classList.add("btn", "btn-danger", "fw-bold"));
    logoutButtonElements.forEach((button) => button.classList.remove("hidden"));
    
    registerButtonElements.forEach((button) => button.classList.remove("btn", "btn-danger", "fw-bold"));
    registerButtonElements.forEach((button) => button.classList.add("hidden"));

    refreshButtonElement.classList.remove("btn", "btn-sm", "btn-success");
    refreshButtonElement.classList.add("hidden");

    userIDFilterElement.classList.add("hidden");
    loadUserTable(user);
  }
  else {
    loginButtonElements.forEach((button) => button.classList.add("btn", "btn-danger", "fw-bold"));
    loginButtonElements.forEach((button) => button.classList.remove("hidden"));

    logoutButtonElements.forEach((button) => button.classList.remove("btn", "btn-danger", "fw-bold"));
    logoutButtonElements.forEach((button) => button.classList.add("hidden"));
    
    registerButtonElements.forEach((button) => button.classList.add("btn", "btn-danger", "fw-bold"));
    registerButtonElements.forEach((button) => button.classList.remove("hidden"));

    refreshButtonElement.classList.add("btn", "btn-sm", "btn-success");
    refreshButtonElement.classList.remove("hidden");

    userIDFilterElement.classList.remove("hidden");
    loadDefaultOverviewTable();
  }
}

function onResizePage() {
  // Debug
  //console.log("Screen Width (Inner): " + window.innerWidth);
  //console.log("Screen Width (Outer): " + window.outerWidth);

  // According to bootstrap 5's documentation, "sm" tag represents 576px or larger.
  // Once screen gets larger than the above dimension, width-wise, disable blur if originally blurred.
  // Reference: https://getbootstrap.com/docs/5.2/layout/breakpoints/
  if (window.innerWidth >= 576)
    hideTopPanelOptions();
}
// ===================================================
function logout() {
  localStorage.removeItem("activeUser");
  location.reload();
}
// ===================================================
function onMoveToPage(page) {
  window.location.href = page;
}

function onMoveToAuthPage(isNewUser) {
  window.location.href = "./subdirectories/auth/" + (isNewUser === "true" ? "register.html" : "login.html");
}
// ===================================================
window.onPageLoaded = onPageLoaded;
window.onResizePage = onResizePage;

window.onMoveToPage = onMoveToPage;
window.onMoveToAuthPage = onMoveToAuthPage;

window.loadDefaultOverviewTable = loadDefaultOverviewTable;
window.addRandomDistraction = addRandomDistraction;

window.showTopPanelOptions = showTopPanelOptions;
window.hideTopPanelOptions = hideTopPanelOptions;

window.setFilterQuery = setFilterQuery;
window.setStatusFilterQuery = setStatusFilterQuery;
window.startFilter = startFilter;

window.promptNewTask = promptNewTask;
window.removePendingNewTask = removePendingNewTask;
window.removeDeadlineNew = removeDeadlineNew;
window.addNewTask = addNewTask;

window.promptModifyTask = promptModifyTask;
window.stopTaskModification = stopTaskModification;
window.removeDeadlineModify = removeDeadlineModify;
window.onCompleteTaskModification = onCompleteTaskModification;

window.logout = logout;
// ===================================================