// Script to fetch the breeds available
async function fetchBreeds() {
  try {
    // Fetch breeds data from the JSON file
    const response = await fetch("dogs.json");
    const breeds = await response.json();

    // Get only the breed names (keys)
    const breedNames = Object.keys(breeds);
    populateBreedsDropdown(breedNames);
  } catch (error) {
    console.error("Error fetching breeds:", error);
  }
}

function populateBreedsDropdown(breedNames) {
  const breedSelect = document.getElementById("breed"); // Updated to use "breed"

  // Clear any existing options
  breedSelect.innerHTML = '<option value="" disabled selected>Select a breed</option>';

  breedNames.forEach(breed => {
    const option = document.createElement("option");
    option.value = breed;
    option.textContent = breed.charAt(0).toUpperCase() + breed.slice(1); // Capitalize the first letter
    breedSelect.appendChild(option);
  });
}

async function showData() {
  try {
    const response = await fetch("/data"); // Fetch data from MongoDB
    const peopleList = await response.json();

    let html = "";
    peopleList.forEach((element) => {
      html += `<tr>`;
      html += `<td>${element.breed}</td>`;
      html += `<td>${element.age}</td>`;
      html += `<td>${element.address}</td>`;
      html += `<td>${element.email}</td>`;
      html += `
        <td>
          <button onclick="deleteData('${element._id}')" class="btn btn-danger">Delete</button>
        </td>`;
      html += `</tr>`;
    });

    document.querySelector("#crudTable tbody").innerHTML = html;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Call showData() on page load to display data from MongoDB
document.addEventListener("DOMContentLoaded", showData);

// Add data function to submit new entries
async function AddData() {
  if (validateForm()) {
    const breed = document.getElementById("breed").value; // Use the updated ID "breed"
    const age = document.getElementById("age").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;

    const response = await fetch("/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: breed, age, address, email }) // Use `breed` for the name field
    });

    if (response.ok) {
      showData(); // Refresh the table
      // Clear form fields
      document.getElementById("breed").value = ""; // Clear breed selection
      document.getElementById("age").value = "";
      document.getElementById("address").value = "";
      document.getElementById("email").value = "";
    }
  }
}

// Delete function
async function deleteData(id) {
  try {
    const response = await fetch(`/data/${id}`, { method: "DELETE" });
    if (response.ok) {
      alert("Data deleted successfully!"); // Popup alert notification
      showData(); // Refresh the table after deletion
    }
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}

// Validate form inputs before submitting data
function validateForm() {
  var breed = document.getElementById("breed").value; // Update to match ID
  var age = document.getElementById("age").value;
  var address = document.getElementById("address").value;
  var email = document.getElementById("email").value;

  

  if (age == "") {
    alert("Age is required");
    return false;
  } else if (age < 1) {
    alert("Age must not be zero or less than zero");
    return false;
  } else if (age > 10) {
    alert("We keep old age dogs at our homes");
    return false;
  }

  if (address == "") {
    alert("Address is required");
    return false;
  }

  if (email == "") {
    alert("Email is required");
    return false;
  } else if (!email.includes("@")) {
    alert("Invalid email address");
    return false;
  }

  return true;
}

// Fetch and populate the breeds on page load
document.addEventListener("DOMContentLoaded", fetchBreeds);
