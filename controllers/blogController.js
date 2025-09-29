const Blog = require("../models/Blog");

// Create Blog (logged-in users only)
exports.createBlog = async (req, res) => {
  try {
    const { title, content, tags, category } = req.body;
    const thumbnail = req.file ? req.file.path : null;

    const blog = await Blog.create({
      title,
      content,
      tags,
      category,
      thumbnail,
      author: req.user.id, // from verifyToken middleware 
    });

    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (err) {
    res.status(500).json({ message: "Error creating blog", error: err.message });
  }
};

// Get all blogs with pagination & optional search
exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 2, search = "" } = req.query;
    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const blogs = await Blog.find(query)
      .populate("author", "firstname lastname")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.json({ blogs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "firstname lastname");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    const { title, content, tags, category } = req.body;
    const thumbnail = req.file ? req.file.path : blog.thumbnail;

    Object.assign(blog, { title, content, tags, category, thumbnail });
    await blog.save();

    res.json({ message: "Blog updated", blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

