const mongoose = require("mongoose");
const { generateSlug } = require("../utils/helper.util");

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

// ! Virtual Property
// * Relationship: MANY - MANY
authorSchema.virtual("books", {
  foreignField: "authors",
  ref: "Book",
  localField: "_id",
});

// ! Document Middleware
// * Tạo giá trị cho trường slug. Middlware này sẽ chạy trước khi document được lưu vào collection
authorSchema.pre("save", function (next) {
  this.slug = generateSlug(this.name);
  next();
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
