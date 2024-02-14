const jwt = require("jsonwebtoken");
const {
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
} = require("../configs/jwt.config");

exports.generateAccessToken = function (user) {
  const accessToken = jwt.sign(
    {
      userId: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: accessTokenExpiresIn,
    }
  );

  return accessToken;
};

exports.generateRefreshToken = function (user) {
  const refreshToken = jwt.sign(
    {
      userId: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: refreshTokenExpiresIn,
    }
  );

  return refreshToken;
};
