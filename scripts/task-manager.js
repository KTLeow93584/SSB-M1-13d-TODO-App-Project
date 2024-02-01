import { fillerTasks } from "./filler-task.js";
import { saveUserData } from "./account-manager.js";
// ================================================
let storedTasks = [];
// ================================================
const tableElement = document.getElementById("task-table");
const emptyTableNoticeElement = document.getElementById("empty-table-notifier");

const taskFilterElement = document.getElementById("task-filter-selector");

const filterQueryInputElement = document.getElementById("task-filter-input");
let filterQuery = "";
const statusFilterElement = document.getElementById("task-filter-status-selector");
let statusFilterQuery = "";

const filterButtonElement = document.getElementById("task-filter-button");

const newTaskFormElement = document.getElementById("new-task-form");
const newTaskNameInputElement = document.getElementById("new-task-name");
const newTaskDateInputElement = document.getElementById("new-task-deadline");
const newTaskURLInputElement = document.getElementById("new-task-url");
const newTaskURLWarningElement = document.getElementById("new-task-url-warning");

const modifyTaskFormElement = document.getElementById("modify-task-form");
const modifyTaskNameInputElement = document.getElementById("modify-task-name");
const modifyTaskDateInputElement = document.getElementById("modify-task-deadline");
const modifyTaskURLInputElement = document.getElementById("modify-task-url");
const modifyTaskURLWarningElement = document.getElementById("modify-task-url-warning");
let targetTaskArrayIndex = 0;
// ================================================
// Pure Task-related functions
export function addTask(task, addToFront = false, forceAddToTable = false) {
  if (addToFront)
    storedTasks.unshift(task);
  else
    storedTasks.push(task);

  if (task.taskId === undefined)
    task.taskId = storedTasks.length;

  if (forceAddToTable)
    appendTaskToTable(task, addToFront);

  if (!emptyTableNoticeElement.classList.contains("hidden"))
    emptyTableNoticeElement.classList.add("hidden");
  
  if (emptyTableNoticeElement.classList.contains("d-flex"))
    emptyTableNoticeElement.classList.remove("d-flex");
}

export function modifyTask(arrayIndex) {
  updateTableRowTaskName(arrayIndex);
  updateTableRowTaskURL(arrayIndex);
  updateTableRowTaskDeadline(arrayIndex);
  updateTableRowTaskStatus(arrayIndex);

  saveUserData(storedTasks);
}

// Row's Cells currently arranged as follows:
// [User ID, Date Added, Task Name, URL, Deadline, Status, Actions]
function updateTableRowTaskName(arrayIndex) {
  const tableRow = tableElement.rows[arrayIndex + 1];
  tableRow.cells[3].textContent = storedTasks[arrayIndex].name;
}

function updateTableRowTaskURL(arrayIndex) {
  const tableRow = tableElement.rows[arrayIndex + 1];
  tableRow.cells[4].innerHTML = (storedTasks[arrayIndex].url === null) ? `<p>Not provided</p>` : `
    <a href="${storedTasks[arrayIndex].url}" class="text-info" target="_blank" role="button">Link</a>
  `;
}

function updateTableRowTaskDeadline(arrayIndex) {
  const tableRow = tableElement.rows[arrayIndex + 1];

  const date = storedTasks[arrayIndex].deadline;
  if (date !== null)
    tableRow.cells[5].textContent = date.getDate().toString().padStart(2, "0") + "/" +
      (date.getMonth() + 1).toString().padStart(2, "0") + "/" + date.getFullYear();
  else
    tableRow.cells[4].textContent = "N/A";
}

function updateTableRowTaskStatus(arrayIndex) {
  const tableRow = tableElement.rows[arrayIndex + 1];
  const task = storedTasks[arrayIndex];
  console.log("Task.", task);

  if (task.deadline === null)
    tableRow.cells[6].innerHTML = `<p class="pe-none">♾️</p>`;
  else {
    tableRow.cells[6].innerHTML = `
      <button id="task-toggle-status-${task.taskId}" class="btn btn-sm">${task.status ? "✅" : "❎"}</button>
    `;

    const toggleStatusButton = document.getElementById(`task-toggle-status-${task.taskId}`);
    toggleStatusButton.addEventListener("click", () => toggleTaskStatus(task.taskId));
  }
}

export function deleteTask(id, deleteFromTable = true) {
  // Debug
  //console.log("On Delete: " + id);

  const taskIndex = storedTasks.findIndex((task) => task.taskId === id);

  // Debug
  //console.log(`[Delete] Looking for Task #${id}: `, (taskIndex === -1 ? "No Task Found" : "Task Found"));

  if (taskIndex !== -1) {
    if (deleteFromTable)
      tableElement.deleteRow(taskIndex + 1);

    storedTasks.splice(taskIndex, 1);

    if (storedTasks.length <= 0) {
      if (emptyTableNoticeElement.classList.contains("hidden"))
        emptyTableNoticeElement.classList.remove("hidden");

      if (!emptyTableNoticeElement.classList.contains("d-flex"))
        emptyTableNoticeElement.classList.add("d-flex");
    }
  }

  saveUserData(storedTasks);
}

export function clearTasks() {
  storedTasks = [];
}

// Task addition, for distraction purposes.
export function addRandomDistraction() {
  const randomTask = fillerTasks[Math.floor(Math.random() * fillerTasks.length)];

  let activeUser = localStorage.getItem("activeUser");
  if (activeUser)
    activeUser = JSON.parse(activeUser);
  
  const taskObj = {
    userId: activeUser ? activeUser.id : 1,
    taskId: storedTasks.length + 1,
    name: randomTask.name,
    url: randomTask.url,
    dateAdded: new Date(),
    deadline: null,
    status: false
  };

  // Debug
  //console.log("[Add Distraction] Random Task.", taskObj);

  addTask(taskObj, true, true);
}

function toggleTaskStatus(id) {
  const taskIndex = storedTasks.findIndex((task) => task.taskId === id);
  
  const task = storedTasks[taskIndex];
  task.status = !task.status;
  
  updateTableRowTaskStatus(taskIndex);
}
// ================================================
// Filtering-related
export function setFilterQuery(typeName) {
  switch (typeName.toLowerCase()) {
    case "user-id":
      filterQuery = "User-ID";
      taskFilterElement.textContent = filterQuery;

      filterQueryInputElement.value = "";
      filterQueryInputElement.type = "number"
      break;
    case "task-id":
      filterQuery = "Task-ID";
      taskFilterElement.textContent = filterQuery;

      filterQueryInputElement.value = "";
      filterQueryInputElement.type = "number"
      break;
    case "name":
      filterQuery = "Name";
      taskFilterElement.textContent = filterQuery;

      filterQueryInputElement.value = "";
      filterQueryInputElement.type = "text"
      break;
    case "status":
      filterQuery = "Status";
      taskFilterElement.textContent = filterQuery;

      statusFilterQuery = "Completed";
      statusFilterElement.textContent = statusFilterQuery;
      break;
    default:
      filterQuery = "None";
      taskFilterElement.textContent = "Click Me to Select";
      startFilter();
  }

  if (typeName === "status") {
    filterQueryInputElement.classList.add("hidden");

    statusFilterElement.classList.remove("hidden");
    statusFilterElement.classList.add("btn", "btn-secondary", "dropdown-toggle");

    filterButtonElement.classList.remove("hidden");
    filterButtonElement.classList.add("btn", "btn-sm", "btn-info");
  }
  else if (typeName === "none") {
    filterQueryInputElement.classList.add("hidden");

    statusFilterElement.classList.add("hidden");
    statusFilterElement.classList.remove("btn", "btn-secondary", "dropdown-toggle");

    filterButtonElement.classList.add("hidden");
    filterButtonElement.classList.remove("btn", "btn-sm", "btn-info");
  }
  else {
    filterQueryInputElement.classList.remove("hidden");

    statusFilterElement.classList.add("hidden");
    statusFilterElement.classList.remove("btn", "btn-secondary", "dropdown-toggle");

    filterButtonElement.classList.remove("hidden");
    filterButtonElement.classList.add("btn", "btn-sm", "btn-info");
  }
}

export function setStatusFilterQuery(typeName) {
  switch (typeName.toLowerCase()) {
    case "completed":
      statusFilterQuery = typeName;
      statusFilterElement.textContent = typeName;
      break;
    case "not completed":
      statusFilterQuery = typeName;
      statusFilterElement.textContent = typeName;
      break;
    case "permanent":
      statusFilterQuery = typeName;
      statusFilterElement.textContent = typeName;
      break;
  }
}

export function startFilter() {
  redrawTaskTable();
}
// ================================================
// HTML DOM Task Form Manipulations

// Add New
export function promptNewTask() {
  newTaskFormElement.classList.remove("hidden");
  newTaskFormElement.classList.add("container-fluid");
}

export function removePendingNewTask() {
  newTaskFormElement.classList.add("hidden");
  newTaskFormElement.classList.remove("container-fluid");

  newTaskNameInputElement.value = "";
  newTaskDateInputElement.value = "";
  newTaskURLInputElement.value = "";
}

export function removeDeadlineNew() {
  newTaskDateInputElement.value = "";
}

export function addNewTask() {
  event.preventDefault();
  let activeUser = localStorage.getItem("activeUser");
  if (activeUser)
    activeUser = JSON.parse(activeUser);
  
  let isValidURL = newTaskURLInputElement.value.trim().length > 0;

  // Reference: https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url
  try {
    let newURL = null;

    if (isValidURL)
      newURL = new URL(newTaskURLInputElement.value);
  }
  catch (error) {
    newTaskURLWarningElement.textContent = "Error: Invalid URL Format";
    return;
  }

  newTaskURLWarningElement.textContent = "";

  const newTaskObj = {
    userId: activeUser.id,
    taskId: storedTasks.length + 1,
    name: newTaskNameInputElement.value,
    url: isValidURL ? newTaskURLInputElement.value : null,
    dateAdded: new Date(),
    deadline: newTaskDateInputElement.value.trim().length > 0 ? new Date(newTaskDateInputElement.value) : null,
    status: false
  };

  // Debug
  //console.log("[New Task Created] Task.", newTaskObj);

  addTask(newTaskObj, false, true);

  saveUserData(storedTasks);
  removePendingNewTask();
}

// Modify Existing
export function promptModifyTask(taskId) {
  const taskIndex = storedTasks.findIndex((task) => task.taskId === taskId);
  const task = storedTasks[taskIndex];

  console.log("Stored Tasks.", storedTasks);

  // Debug
  console.log("ID: " + taskId + ", Array Index: " + taskIndex);
  console.log("Task.", task);
  
  modifyTaskFormElement.classList.remove("hidden");
  modifyTaskFormElement.classList.add("container-fluid");

  modifyTaskNameInputElement.value = task.name;
  
  if (task.deadline !== null)
    modifyTaskDateInputElement.valueAsDate = task.deadline;
  else
    modifyTaskDateInputElement.value = "";
  
  modifyTaskURLInputElement.value = task.url !== null ? task.url : "";
  
  targetTaskArrayIndex = taskIndex;
}

export function stopTaskModification() {
  modifyTaskFormElement.classList.add("hidden");
  modifyTaskFormElement.classList.remove("container-fluid");

  newTaskNameInputElement.value = "";
  newTaskDateInputElement.value = "";
  newTaskURLInputElement.value = "";
}

export function removeDeadlineModify() {
  modifyTaskDateInputElement.value = "";
}

export function onCompleteTaskModification() {
  event.preventDefault();
  let isValidURL = modifyTaskURLInputElement.value.trim().length > 0;

  // Reference: https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url
  try {
    let newURL = null;

    if (isValidURL)
      newURL = new URL(modifyTaskURLInputElement.value);
  }
  catch (error) {
    modifyTaskURLWarningElement.textContent = "Error: Invalid URL Format";
    return;
  }

  modifyTaskURLWarningElement.textContent = "";

  storedTasks[targetTaskArrayIndex].name = modifyTaskNameInputElement.value;
  storedTasks[targetTaskArrayIndex].url = isValidURL ? modifyTaskURLInputElement.value : null;
  storedTasks[targetTaskArrayIndex].deadline = modifyTaskDateInputElement.value.trim().length > 0 ? new Date(modifyTaskDateInputElement.value) : null;

  // Debug
  //console.log("[On Submit Modifications] Name: " + storedTasks[targetTaskArrayIndex].name + 
              //", URL: " + storedTasks[targetTaskArrayIndex].url + 
              //", Deadline: " + storedTasks[targetTaskArrayIndex].deadline);
  
  modifyTask(targetTaskArrayIndex);
  stopTaskModification();
}
// ===================================================
// HTML DOM Task Table Manipulations

// Recreate Header
function addTaskTableHeader() {
  const headerRow = tableElement.insertRow();
  headerRow.classList.add("text-center");

  // User ID
  let headerCell = headerRow.insertCell();
  headerCell.textContent = "User ID";
  headerCell.scope = "col";
  headerCell.classList.add("w-5");
  headerCell.classList.add("text-center");

  // Task ID
  headerCell = headerRow.insertCell();
  headerCell.textContent = "Task ID";
  headerCell.scope = "col";
  headerCell.classList.add("w-5");
  headerCell.classList.add("text-center");

  // Date Added
  headerCell = headerRow.insertCell();
  headerCell.textContent = "Date Added";
  headerCell.scope = "col";
  headerCell.classList.add("w-15");
  headerCell.classList.add("text-center");

  // Task Name
  headerCell = headerRow.insertCell();
  headerCell.textContent = "Task Name";
  headerCell.scope = "col";
  headerCell.classList.add("w-20");
  headerCell.classList.add("text-center");

  // Resource URL
  headerCell = headerRow.insertCell();
  headerCell.textContent = "URL";
  headerCell.scope = "col";
  headerCell.classList.add("w-15");
  headerCell.classList.add("text-center");

  // Deadline
  headerCell = headerRow.insertCell();
  headerCell.textContent = "Deadline";
  headerCell.scope = "col";
  headerCell.classList.add("w-15");
  headerCell.classList.add("text-center");

  // Status (Completed/Not Completed)
  headerCell = headerRow.insertCell();
  headerCell.textContent = "Status";
  headerCell.scope = "col";
  headerCell.classList.add("w-15");
  headerCell.classList.add("text-center");

  // Actions
  headerCell = headerRow.insertCell();
  headerCell.innerHTML = "Actions";
  headerCell.scope = "col";
  headerCell.classList.add("w-10");
  headerCell.classList.add("text-center");
}

// Append new task as a new (bottom) row in the table.
function appendTaskToTable(task, addToFront = false) {
  let newRow = addToFront ? tableElement.insertRow(1) : tableElement.insertRow();
  const userId = task.userId;
  const taskId = task.taskId;

  // Debug
  //console.log("On Add.", task);

  // User ID
  let newCell = newRow.insertCell();
  newCell.textContent = userId;
  newCell.scope = "col";
  newCell.classList.add("w-5");
  newCell.classList.add("text-center");

  // Task ID
  newCell = newRow.insertCell();
  newCell.textContent = taskId;
  newCell.scope = "col";
  newCell.classList.add("w-5");
  newCell.classList.add("text-center");

  // Date Added
  let date = task.dateAdded;
  newCell = newRow.insertCell();
  newCell.textContent = date.getDate().toString().padStart(2, "0") + "/" +
    (date.getMonth() + 1).toString().padStart(2, "0") + "/" + date.getFullYear();
  newCell.scope = "col";
  newCell.classList.add("w-15");
  newCell.classList.add("text-center");

  // Task Name
  newCell = newRow.insertCell();
  newCell.textContent = task.name;
  newCell.scope = "col";
  newCell.classList.add("w-20");

  // URL
  newCell = newRow.insertCell();
  newCell.innerHTML = (task.url === null) ? `<p>Not provided</p>` : `
    <a href="${task.url}" class="text-info" target="_blank" role="button">Link</a>
  `;
  newCell.scope = "col";
  newCell.classList.add("w-15");
  newCell.classList.add("text-center");

  // Deadline
  newCell = newRow.insertCell();
  date = task.deadline;

  if (date !== null) {
    newCell.textContent = date.getDate().toString().padStart(2, "0") + "/" +
      (date.getMonth() + 1).toString().padStart(2, "0") + "/" + date.getFullYear();
  }
  else
    newCell.textContent = "N/A";

  newCell.scope = "col";
  newCell.classList.add("w-15");
  newCell.classList.add("text-center");

  // Status
  newCell = newRow.insertCell();

  if (date === null) {
    newCell.innerHTML = `
      <p class="pe-none">♾️</p>
    `;
  }
  else {
    newCell.innerHTML = `
      <button id="task-toggle-status-${taskId}" class="btn btn-sm">${task.status ? "✅" : "❎"}</button>
    `;
  }
  
  newCell.scope = "col";
  newCell.classList.add("w-15");
  newCell.classList.add("text-center");

  // Actions
  newCell = newRow.insertCell();
  newCell.innerHTML = `
    <div class="d-flex flex-row justify-content-evenly">
      <button id="task-modify-${taskId}" class="btn btn-sm btn-success fw-bold pt-2"><i class="fa-solid fa-wrench"></i></button>
      <button id="task-delete-${taskId}" class="btn btn-sm btn-danger fw-bold pt-2"><i class="fa-solid fa-x"></i></button>
    </div>
  `;

  const modifyButton = document.getElementById(`task-modify-${taskId}`);
  modifyButton.addEventListener("click", () => promptModifyTask(taskId));

  const deleteButton = document.getElementById(`task-delete-${taskId}`);
  deleteButton.addEventListener("click", () => deleteTask(taskId));

  const toggleStatusButton = document.getElementById(`task-toggle-status-${taskId}`);
  if (toggleStatusButton !== null)
    toggleStatusButton.addEventListener("click", () => toggleTaskStatus(taskId));

  newCell.scope = "col";
  newCell.classList.add("w-10");
  newCell.classList.add("text-center");
}

export function redrawTaskTable() {
  tableElement.innerHTML = "";
  addTaskTableHeader();

  // Debug
  //console.log("Filter Query: " + filterQuery);

  let passFilter = true;
  storedTasks.forEach((task) => {
    // Only add to table if filter query is met.

    // Debug
    //console.log("[Task] ID: " + task.taskId + ", Name: " + task.name + ", Status: " + task.status + ", Deadline: " + task.deadline);
    //console.log("Query Value: " + filterQueryInputElement.value);
    
    switch (filterQuery.toLowerCase()) {
      case "user-id":
        if (filterQueryInputElement.value.trim().length > 0)
          passFilter = parseInt(task.userId) === parseInt(filterQueryInputElement.value);
        break;
      case "task-id":
        if (filterQueryInputElement.value.trim().length > 0)
          passFilter = parseInt(task.taskId) === parseInt(filterQueryInputElement.value);
        break;
      case "name":
        if (filterQueryInputElement.value.trim().length > 0)
          passFilter = task.name.includes(filterQueryInputElement.value);
        break;
      case "status":
        switch (statusFilterQuery.toLowerCase()) {
          case "completed":
            passFilter = task.deadline !== null && task.status;
            break;
          case "not completed":
            passFilter = task.deadline !== null && !task.status;
            break;
          case "permanent":
            passFilter = task.deadline === null;
            break;
        }
        break;
    }

    if (!passFilter)
      return;

    appendTaskToTable(task);
  });

  if (storedTasks.length > 0) {
    emptyTableNoticeElement.classList.add("hidden");
    emptyTableNoticeElement.classList.remove("d-flex");
  }
  else {
    emptyTableNoticeElement.classList.add("d-flex");
    emptyTableNoticeElement.classList.remove("hidden");
  }
}
// ================================================