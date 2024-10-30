import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const port = 3019;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware to parse JSON request bodies

mongoose.connect("mongodb://127.0.0.1:27017/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => console.log("MongoDB connection successful"));

const userSchema = new mongoose.Schema({
  breed: String, // This will hold the breed name
  age: Number,
  address: String,
  email: String,
});

const Users = mongoose.model("data", userSchema);

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// Fetch up to 10 records from MongoDB
app.get("/data", async (req, res) => {
  try {
    const users = await Users.find().limit(10); // Limit results to 10 entries
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Delete a record from MongoDB
app.delete("/data/:id", async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// Handle form submission
app.post("/post", async (req, res) => {
  console.log(req.body); // Log the incoming request body for debugging
  const { breed, age, address, email } = req.body; // `name` should hold the breed now

  // Server-side validation
  

  if (isNaN(age) || age <= 0) {
   // return res.send(`<script>alert("Please enter a valid age."); window.location.href = "/";</script>`);
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    //return res.send(`<script>alert("Please enter a valid email address."); window.location.href = "/";</script>`);
  }

  // Create a new user instance
  const user = new Users({ breed, age, address, email }); // Here `name` is the breed name

  try {
    // Save the user to the database
    await user.save();
    res.send(`<script>alert("Form submitted successfully!"); window.location.href = "/";</script>`);
  } catch (error) {
    // Handle any errors that occur during saving
    console.error(error);
    res.send(`<script>alert("An error occurred while submitting the form. Please try again."); window.location.href = "/";</script>`);
  }
});

app.listen(port, () => console.log(`Server started on port ${port}`));
