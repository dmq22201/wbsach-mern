const slugify = require("slugify");

exports.generateSlug = function (str) {
  return slugify(str, {
    lower: true,
    replacement: "-",
  });
};
