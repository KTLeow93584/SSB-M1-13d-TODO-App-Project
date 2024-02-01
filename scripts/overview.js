// ================================================
import { addTask, clearTasks, redrawTaskTable } from "./task-manager.js";
// ================================================
const tableHeaderElement = document.getElementById("overview-task-table-header");

// Reference: "https://github.com/typicode/json-server".
const baseAPIURL = "https://jsonplaceholder.typicode.com/todos";
const exampleUserID = "1";
const exampleUserName = "Anonymous User";
const defaultSampleSize = 200;
// ================================================
export function loadDefaultOverviewTable() {
  // All IDs on sample.
  const fullURL = baseAPIURL + "?_limit=" + defaultSampleSize;

  // Only target specific ID.
  //const fullURL = baseAPIURL + "?userId=" + exampleUserID + "&_limit=" + defaultSampleSize;

  // Debug
  console.log("[Load Overview's Default Tasks] Full URL: " + fullURL);
  // ================================================
  fetch(fullURL)
    .then((response) => response.json())
    .then((result) => {
    // Debug
    //console.log("Results.", result);

    clearTasks();

    result.forEach((task) => {
      const todayDate = new Date();
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);

      addTask({
        userId: task.userId,
        taskId: task.id,
        name: task.title,
        url: null,
        dateAdded: todayDate,
        deadline: tomorrowDate,
        status: task.completed
      });
    });

    tableHeaderElement.textContent = "Welcome, " + exampleUserName;
    redrawTaskTable();
  });
}
// ================================================
// User Data Format:
/*
 * {
 *   id: 1,
 *   email: email,
 *   name: "First Name Last Name",
 *   password: "dsadsjkaldksla",
 *   taskList: [
 *     {
 *        id: 1,
 *        name: "Task name here",
 *        url: "Insert URL here",
 *        dateAdded: "01/01/1999",
 *        deadline: "01/01/2999",
 *        status: false,
 *     }
 *   ]
 * }
*/
export function loadUserTable(userData) {
  clearTasks();
  userData.taskList.forEach((task) => {
    // Debug
    //console.log("Data Row.", row);

    addTask({
      userId: userData.id,
      taskId: task.id,
      name: task.name,
      url: task.url,
      dateAdded: typeof(task.dateAdded) === "string" ? new Date(task.dateAdded) : task.dateAdded,
      deadline: typeof(task.deadline) === "string" ? new Date(task.deadline) : task.deadline,
      status: task.status
    });
  });

  tableHeaderElement.textContent = "Welcome, " + userData.name;
  redrawTaskTable();
}
// ================================================
