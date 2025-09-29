const multer = require("multer");
const path = require("path");

const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogs"); // Separate folder from books
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadBlog = multer({ storage: blogStorage });
module.exports = uploadBlog;
