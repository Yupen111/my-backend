const { name } = require("ejs");
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Book name is required"], 
      unique: true 
    },
    vendor: { 
      type: String, 
      required: [true, "Vendor is required"] 
    },
    type: { 
      type: String, 
      required: [true, "Type is required"]  
    },
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category", // Reference to Category model
      required: [true, "Category is required"] 
    },
    manufacturingDate: { 
      type: Date 
    },
    color: { 
      type: String, 
      required: [true, "Color is required"] 
    },
    size: {
      type: [String], 
      validate: {
        validator: function (arr) {
          const allowedSizes = ["S", "M", "L", "XL"];
          return arr.every((s) => allowedSizes.includes(s));
        },
        message: (props) => `${props.value} is not a valid size. Allowed: S, M, L, XL`,
      },
    },
    price: { 
      type: Number, 
      required: [true, "Price is required"], 
      min: [1, "Price must be greater than 0"] 
    },
    stock: { 
      type: Number, 
      required: [true, "Stock is required"], 
      min: [0, "Stock cannot be negative"] 
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          alt: { type: String, default: "Book Image" },
        },
      ],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one image is required",
      },
    },
  
  },
  
  { timestamps: true }
);


//foe serching purpose
bookSchema.index({ name: "text", vendor: "text", type: "text", description: "text" });
module.exports = mongoose.model("Book", bookSchema);

// 🔑 ensure index create
//book.init();


