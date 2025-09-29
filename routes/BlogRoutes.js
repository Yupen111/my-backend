const express = require("express");
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const verifyToken = require("../middleware/verifyToken");
const uploadBlog = require("../middleware/upload");

// Public
router.get("/", getBlogs);
router.get("/:id", getBlogById);

// Protected (only logged-in users)
router.post("/", verifyToken, uploadBlog.single("thumbnail"), createBlog);
router.put("/:id", verifyToken, uploadBlog.single("thumbnail"), updateBlog);
router.delete("/:id", verifyToken, deleteBlog);

module.exports = router;
