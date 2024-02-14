const mongoose = require("mongoose");
const { generateSlug } = require("../utils/helper.util");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  coverImage: {
    type: String,
    default: "default-book.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stockQuantity: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
  },
  status: {
    type: String,
    enum: ["inStock", "outOfStock"],
  },
  genres: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
    },
  ],
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
  ],
});

// ! Document Middleware
// * Tạo giá trị cho trường slug. Middlware này sẽ chạy trước khi document được lưu vào collection
bookSchema.pre("save", function (next) {
  this.slug = generateSlug(this.name);
  next();
});

bookSchema.pre("save", function (next) {
  if (this.stockQuantity <= 0) {
    this.status = "outOfStock";
  }

  if (this.stockQuantity > 0) {
    this.status = "inStock";
  }

  next();
});

// ! Query Middleware
bookSchema.post("find", function (docs) {
  this.totalItems = docs.length;
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
