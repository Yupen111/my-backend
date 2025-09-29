const express = require("express");
const router = express.Router();
const { addComment, getCommentsByBlog,deleteComment } = require("../controllers/commentController");

// Add new comment on a blog
router.post("/:blogId", addComment);

// Get all comments + count for a blog
router.get("/:blogId", getCommentsByBlog);

// DELETE comment by ID
router.delete("/:blogId/:commentId", deleteComment);

module.exports = router;
