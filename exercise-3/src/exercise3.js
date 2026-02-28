// exercise3.js

// ----- DOM SELECTORS -----
const userGrid = document.getElementById("userGrid");
const viewToggleBtn = document.getElementById("viewToggleBtn");
const deleteIdInput = document.getElementById("deleteIdInput");
const deleteBtn = document.getElementById("deleteBtn");
const sortByGroupBtn = document.getElementById("sortByGroupBtn");
const sortByIdBtn = document.getElementById("sortByIdBtn");

// ----- DATA STORE -----
let users = [];

const API_URL = "https://69a1dad52e82ee536fa260fc.mockapi.io/users_api";

// ----- RENDER FUNCTION -----
function render(userArray) {
  if (!userArray || userArray.length === 0) {
    userGrid.innerHTML = "No users loaded.";
    return;
  }

  let html = "";

  userArray.forEach((user) => {
    html += `
      <article class="user-card">
        <h3>${user.first_name ?? ""}</h3>
        <p>first_name: ${user.first_name ?? ""}</p>
        <p>user_group: ${user.user_group ?? ""}</p>
        <p>id: ${user.id ?? ""}</p>
      </article>
    `;
  });

  userGrid.innerHTML = html;
}

// ----- FETCH / RETRIEVE DATA -----
async function retrieveData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    users = data;          
    console.log(users);    
    render(users);           
  } catch (error) {
    console.error("Error fetching users:", error);
    userGrid.innerHTML = "Failed to load users.";
  }
}

// Run as soon as the page loads
retrieveData();

// ----- EVENT LISTENERS -----

// 1. View toggle: grid <-> list
viewToggleBtn.addEventListener("click", () => {
  if (userGrid.classList.contains("grid-view")) {
    userGrid.classList.remove("grid-view");
    userGrid.classList.add("list-view");
  } else if (userGrid.classList.contains("list-view")) {
    userGrid.classList.remove("list-view");
    userGrid.classList.add("grid-view");
  } else {
    // Fallback (if neither class is set for some reason)
    userGrid.classList.add("grid-view");
  }
});

// 2. Sort by group (ascending)
sortByGroupBtn.addEventListener("click", () => {
  if (!Array.isArray(users) || users.length === 0) {
    console.error("No users available to sort by group.");
    return;
  }

  users.sort((a, b) => {
    const groupA = (a.user_group ?? "").toString().toLowerCase();
    const groupB = (b.user_group ?? "").toString().toLowerCase();

    if (groupA < groupB) return -1;
    if (groupA > groupB) return 1;
    return 0;
  });

  render(users);
});

// 3. Sort by ID (numeric ascending)
sortByIdBtn.addEventListener("click", () => {
  if (!Array.isArray(users) || users.length === 0) {
    console.error("No users available to sort by ID.");
    return;
  }

  users.sort((a, b) => {
    const idA = Number(a.id);
    const idB = Number(b.id);

    return idA - idB;
  });

  render(users);
});

// 4. Delete user by ID
deleteBtn.addEventListener("click", async () => {
  const idToDelete = deleteIdInput.value.trim();

  // Validate ID input
  if (!idToDelete || Number.isNaN(Number(idToDelete))) {
    console.error("Invalid ID: please enter a numeric ID.");
    return;
  }

  // Check if user exists in current list
  const existingUser = users.find((user) => String(user.id) === idToDelete);
  if (!existingUser) {
    console.error(`No user found with id ${idToDelete}.`);
    return;
  }

  try {
    const deleteUrl = `${API_URL}/${idToDelete}`;
    const response = await fetch(deleteUrl, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete user with id ${idToDelete}. Status: ${response.status}`
      );
    }

    // Remove from local array
    users = users.filter((user) => String(user.id) !== idToDelete);

    // Re-render list
    render(users);

    // Clear the input
    deleteIdInput.value = "";
  } catch (error) {
    console.error("Error deleting user:", error);
  }
});