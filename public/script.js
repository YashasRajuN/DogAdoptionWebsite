async function showData() {
  try {
    const response = await fetch("/data"); // Fetch data from MongoDB
    const peopleList = await response.json();

    let html = "";
    peopleList.forEach((element, index) => {
      html += `<tr>`;
      html += `<td>${element.name}</td>`;
      html += `<td>${element.age}</td>`;
      html += `<td>${element.address}</td>`;
      html += `<td>${element.email}</td>`;
      html += `
        <td>
          <button onclick="deleteData('${element._id}')" class="btn btn-danger">Delete</button>
          <!-- <button onclick="updateData('${element._id}')" class="btn btn-warning m-2">Edit</button> -->
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
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;

    const response = await fetch("/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age, address, email })
    });

    if (response.ok) {
      showData(); // Refresh the table
    }

    // Clear form fields
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("address").value = "";
    document.getElementById("email").value = "";
  }
}

// Delete function
async function deleteData(id) {
  try {
    const response = await fetch(`/data/${id}`, { method: "DELETE" });
    if (response.ok) {
      alert("Data deleted successfully!"); // Popup alert nofication
      showData(); // Refresh the table after deletion
      
    }
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}

// Validate form inputs before submitting data
function validateForm() {
  var name = document.getElementById("name").value;
  var age = document.getElementById("age").value;
  var address = document.getElementById("address").value;
  var email = document.getElementById("email").value;

  if (name == "") {
    alert("Dog Breed Name is required");
    return false;
  }

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
