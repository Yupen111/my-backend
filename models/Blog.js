const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Blog title is required"] },
    content: { type: String, required: [true, "Blog content is required"] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tags: { type: [String], default: [] },
    category: { type: String, default: "General" },
    thumbnail: { type: String }, // Multer file path //image url
    commentCount: { type: Number, default: 0 }  // ✅ add this
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
