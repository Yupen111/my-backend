const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

// ✅ Add Comment
exports.addComment = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = new Comment({
      blog: req.params.blogId,
      name,
      email,
      message,
    });

    await comment.save();

    // Update blog comment count
    blog.commentCount = await Comment.countDocuments({ blog: req.params.blogId });
    await blog.save();

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// ✅ Get All Comments of Blog + Count
exports.getCommentsByBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comments = await Comment.find({ blog: blogId })
      .sort({ createdAt: -1 });

    const totalComments = comments.length;

    res.json({
      totalComments,
      comments
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};
// ✅ Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    // Check Blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check Comment
    const comment = await Comment.findOne({ _id: commentId, blog: blogId });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Delete Comment
    await Comment.findByIdAndDelete(commentId);

    // Update Blog Comment Count
    blog.commentCount = await Comment.countDocuments({ blog: blogId });
    await blog.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};
