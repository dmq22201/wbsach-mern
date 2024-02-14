const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

module.exports = async (file, folderName) => {
  const image = await cloudinary.uploader.upload(
    file,
    { folder: folderName },
    (result) => result
  );
  return image;
};
