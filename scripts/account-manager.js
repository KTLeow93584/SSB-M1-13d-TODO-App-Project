// Extremely iffy to have sensitive info stored in local cache.
// Once back-end knowledge acquired, use servers instead.
/*
 * User Data Format:
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
 *        deadline: "01/01/2999" (Nullable),
 *        status: false,
 *     }
 *   ]
 * }
*/
// ============================================
export function loadCachedUser() {
  let activeUser = localStorage.getItem("activeUser");

  if (activeUser) {
    activeUser = JSON.parse(activeUser);
    return activeUser;
  }
  
  return null;
}

export function saveUserData(tasks) {
  // ============================================
  // 1. Update Active User Data.
  let activeUser = localStorage.getItem("activeUser");
  // No Active User.
  if (activeUser === null || activeUser === undefined || activeUser.trim().length === 0)
    return;

  // Debug.
  //console.log("[Data Save] Current Task List for Active User.", tasks);
  
  activeUser = JSON.parse(activeUser);
  activeUser.taskList = tasks;

  localStorage.setItem("activeUser", JSON.stringify(activeUser));
  // ============================================
  // 2. Update All Users Data.
  let cachedUsers = localStorage.getItem("users");
  
  if (cachedUsers === null || cachedUsers === undefined || cachedUsers.trim().length === 0)
    cachedUsers = [];
  else
    cachedUsers = JSON.parse(cachedUsers);

  // Debug
  //console.log("[Data Save] Cached Users.", cachedUsers);

  const existingUser = cachedUsers.find((user) => user.email === activeUser.email && activeUser.password && activeUser.password);
  if (existingUser !== null && existingUser !== undefined)
    existingUser.taskList = activeUser.taskList;
  else
    cachedUsers.push(activeUser);

  // Debug
  //console.log("[Data Save] Saved!", existingUser);
  
  localStorage.setItem("users", JSON.stringify(cachedUsers));
  // ============================================
}
// ============================================