import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

// URL of the json-server API
const API_URL = "http://localhost:3000/items";

// DOM elements (initially null, will be populated after HTML rendering)
let createForm: HTMLFormElement | null,
  itemNameInput: HTMLInputElement | null,
  itemList: HTMLElement | null;

// Function to fetch and display items from the API
async function fetchItems() {
  // Ensure itemList is not null
  if (!itemList) {
    console.error("Item list not found!");
    return;
  }

  try {
    const response = await fetch(API_URL);
    const items = await response.json();

    // Clear the current list
    itemList.innerHTML = "";

    // Display items from the API
    items.forEach((item: { name: string; id: number }) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerHTML = `${item.name} <button class="btn btn-danger btn-sm float-right" data-id="${item.id}">Delete</button>`;

      // Add event listener to the delete button
      const deleteButton = li.querySelector("button");
      if (deleteButton) {
        deleteButton.addEventListener("click", () => deleteItem(item.id));
      }
    });
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

// Function to create a new item
async function createItem(event: SubmitEvent) {
  event.preventDefault(); // Prevent form submission

  const itemName = itemNameInput?.value.trim();
  if (itemName) {
    try {
      // Send a POST request to the API to create a new item
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: itemName }),
      });

      // Refresh the list of items
      fetchItems();

      // Clear the input field
      if (itemNameInput) itemNameInput.value = "";
    } catch (error) {
      console.error("Error creating item:", error);
    }
  }
}

// Function to delete an item
async function deleteItem(itemId: number) {
  try {
    // Send a DELETE request to the API to delete the item
    await fetch(`${API_URL}/${itemId}`, {
      method: "DELETE",
    });

    // Refresh the list of items after deletion
    fetchItems();
  } catch (error) {
    console.error("Error deleting item:", error);
  }
}

// Function to initialize the DOM and event listeners
function initializeApp() {
  // Now we can safely access DOM elements after they are rendered
  createForm = document.getElementById("createForm") as HTMLFormElement | null;
  itemNameInput = document.getElementById(
    "itemName"
  ) as HTMLInputElement | null;
  itemList = document.getElementById("itemList");

  // If any of the essential elements are missing, we can log an error
  if (!createForm || !itemNameInput || !itemList) {
    console.error("Required DOM elements are missing");
    return;
  }

  // Event listener for form submission to create a new item
  createForm.addEventListener("submit", createItem);

  // Fetch and display items when the page loads
  fetchItems();
}

// Set the HTML content dynamically (injected inside #app)
document.querySelector("#app")!.innerHTML = `
  <div class="container mt-5">
    <h1 class="text-center">CRUD Application</h1>
    <!-- Form to create new entity -->
    <form id="createForm">
      <div class="form-group">
        <label for="itemName">Item Name:</label>
        <input type="text" class="form-control" id="itemName" required />
      </div>
      <button type="submit" class="btn btn-primary">Create Item</button>
    </form>

    <hr />

    <h2>Items List</h2>
    <!-- List of entities will be displayed here -->
    <ul id="itemList" class="list-group"></ul>
  </div>
`;

// Initialize the app once the HTML is ready
initializeApp();
