const mongoose = require("mongoose");
const { generateSlug } = require("../utils/helper.util");

const authorSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  slug: {
    type: String,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

// ! Document Middleware
// * Tạo giá trị cho trường slug. Middlware này sẽ chạy trước khi document được lưu vào collection
authorSchema.pre("save", function (next) {
  this.slug = generateSlug(this.fullName);
  next();
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
