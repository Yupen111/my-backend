const Book = require("../models/Book");
const Category = require("../models/Category")



// 📌 Create Book
exports.createBook = async (req, res) => {
  try {

    // 🔹 Convert category name to Category ID
    let categoryName = req.body.category?.trim();
    let categoryDoc = await Category.findOne({ name: categoryName });
    if (!categoryDoc) {
      categoryDoc = await Category.create({ name: categoryName });
    }
    req.body.category = categoryDoc._id;
    // 🔹 End

    const images = req.files.map((file) => ({
      url: `/uploads/${file.filename}`,
      alt: req.body.name || "Book Image",
    }));

    
    const newBook = new Book({
      ...req.body,
      size: req.body.size ? req.body.size.split(",") : [],
      images,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 📌 Get All Books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Get Single Book
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Update Book
exports.updateBook = async (req, res) => {
  try {
    const images = req.files && req.files.length > 0
      ? req.files.map((file) => ({
          url: `/uploads/${file.filename}`,
          alt: req.body.name || "Book Image",
        }))
      : [];

    const updateData = {
      $set: {
        ...req.body,
      },
    };
     // 🔹 Update category if provided
    if (req.body.category) {
      let categoryDoc = await Category.findOne({ name: req.body.category.trim() });
      if (!categoryDoc) categoryDoc = await Category.create({ name: req.body.category.trim() });
      updateData.$set.category = categoryDoc._id;
    }


    // size only update if provided
    if (req.body.size !== undefined) {
      updateData.$set.size = req.body.size ? req.body.size.split(",") : [];
    }

    // images push only if provided
    if (images.length > 0) {
      updateData.$push = { images: { $each: images } };
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// 📌 Delete Book
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// GET books with search, filter, pagination
exports.getBooks =  async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort, page = 1, limit = 2 } = req.query;

    let filter = {};

    // 🔍 search keyword
    if (q) {
      filter.$text = { $search: q };
    }

    // 📂 category filter (by ID or Name)
if (category) {
  // Check if it looks like ObjectId (24 hex chars)
  if (category.match(/^[0-9a-fA-F]{24}$/)) {
    filter.category = category; // directly use ObjectId
  } else {
    // else treat as category name (case-insensitive)
    const categoryDoc = await Category.findOne({
      name: { $regex: new RegExp(`^${category}$`, "i") }
    });
    if (categoryDoc) {
      filter.category = categoryDoc._id;
    } else {
      return res.status(404).json({ message: "Category not found" });
    }
  }
}


    // 💰 price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // sorting options
    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    else if (sort === "price_desc") sortOption.price = -1;
    else if (sort === "newest") sortOption.createdAt = -1;

    // pagination
    const skip = (page - 1) * limit;

    const books = await Book.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Book.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      books
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
