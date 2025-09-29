const express = require("express");
const router = express.Router();
const bookController = require("../controllers/Bookcontroller");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");


// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//router.post("/", upload.array("images", 5), bookController.createBook); // max 5 images
router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBook);
//router.put("/:id", upload.array("images", 5), bookController.updateBook);
//router.delete("/:id", bookController.deleteBook);

//serching functionality
router.get("/", bookController.getBooks);

// 🔹 New route for GET books by category name
router.get("/category/:categoryName", bookController.getBooks); 

// Admin-only routes 💡 CHANGE HERE
router.post("/", verifyToken, verifyAdmin, upload.array("images", 5), bookController.createBook);
router.put("/:id", verifyToken, verifyAdmin, upload.array("images", 5), bookController.updateBook);
router.delete("/:id", verifyToken, verifyAdmin, bookController.deleteBook);

module.exports = router;
