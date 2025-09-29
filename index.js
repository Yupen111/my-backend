require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bookRoutes = require("./routes/BookRoutes");
const path = require("path");
const userRoutes = require("./routes/UserRoutes");
const cartRoutes = require("./routes/CartRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const verifyToken = require("./middleware/verifyToken");
const blogRoutes = require("./routes/BlogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const contactRoutes = require("./routes/contactRoutes");


const app = express();

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve uploaded files

// MongoDB connect
mongoose
  .connect("mongodb://127.0.0.1:27017/bookstore")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes register
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/categories", categoryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);   // ✅ register here
app.use("/api/contacts",contactRoutes); 


// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



//hello world   
//helo world uuhlgh

// hello world





