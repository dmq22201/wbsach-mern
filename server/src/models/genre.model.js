const mongoose = require("mongoose");
const { generateSlug } = require("../utils/helper.util");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
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
genreSchema.pre("save", function (next) {
  this.slug = generateSlug(this.name);
  next();
});

const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;
