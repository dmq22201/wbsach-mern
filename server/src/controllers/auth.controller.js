const asyncFnHandler = require("../utils/asynFnHandler.util");
const CustomError = require("../utils/CustomError.util");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateJWT.util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Email = require("../services/Email.service");
const cloudinary = require("../services/cloudinary.service");

/*
   * LUỒNG THỰC THI
    1. Lấy những gì được cấp
    2. Tra dữ liệu từ những gì được cấp
    3. Xử lý lỗi(nếu có) và phản hồi
    (Tùy chọn). Xóa Cookies nếu có thể
*/

// Chức năng: Đăng nhập
exports.login = asyncFnHandler(async function (req, res, next) {
  // 1) Lấy username, password từ req
  const { username, password } = req.body;

  // 2) Kiểm tra xem user có cung cấp đầy đủ username và password không?
  if (!username || !password) {
    return next(
      new CustomError("Vui lòng cung cấp tài khoản và mật khẩu.", 400)
    );
  }

  // 3) Tìm kiếm user trong database dựa trên thông tin được cấp
  const foundUserInDB = await User.findOne({ username }).populate({
    path: "favoriteList",
  });

  // 4) Kiểm tra xem user có tồn tại trong atabase không?
  if (!foundUserInDB) {
    return next(new CustomError("Tài khoản không tồn tại", 404));
  }

  // 5) So sánh mật khẩu
  const matchPassword = await bcrypt.compare(password, foundUserInDB.password);

  // 6) Kiểm tra mật khẩu có khớp với nhau không?
  if (!matchPassword) {
    return next(new CustomError("Sai tài khoản hoặc mật khẩu", 401));
  }

  // 7) Tạo 2 loại tokens
  const newAccessToken = generateAccessToken(foundUserInDB);
  const newRefreshToken = generateRefreshToken(foundUserInDB);

  // 8) quét cookies trong req
  const cookies = req.cookies;

  // 9) lấy refresh token từ cookies
  const oldRefreshToken = cookies?.jwt;

  // 10) Tạo 1 mảng refresh token. Nó sẽ được dùng để phát hiện refresh token của user đang bị tái sử dụng, hoặc bị trộm
  let newRefreshTokenArrInDB = [];

  if (oldRefreshToken) {
    // 10.1) Ta tìm user có liên kết với refresh token này không? trong database dựa vào refresh token user cấp
    const foundRefreshTokenInDB = await User.findOne({
      refreshToken: oldRefreshToken,
    });

    // 10.2) Nếu không tìm ra nghĩa là REFRESH TOKEN NÀY đang bị TÁI SỬ DỤNG HOẶC BỊ TRỘM. Lập tức làm sạch DANH SÁCH REFRESH TOKEN(LÚC NÀY CÁC THIẾT BỊ KHÁC SẼ BỊ LOGOUT hết). Ngược lại lọc cái cũ ra
    if (!foundRefreshTokenInDB) {
      newRefreshTokenArrInDB = [];
    } else {
      newRefreshTokenArrInDB = foundUserInDB.refreshToken.filter(
        (rt) => rt !== oldRefreshToken
      );
    }

    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
  }

  if (!oldRefreshToken) {
    newRefreshTokenArrInDB = foundUserInDB.refreshToken;
  }

  // 11) Áp dụng DANH SÁCH Refresh token đã tính toán vào database đè lên DANH SÁCH CŨ (có thể mới, có thể vẫn như cũ)
  foundUserInDB.refreshToken = [...newRefreshTokenArrInDB, newRefreshToken];

  // 12) Tránh Schema validation toàn bộ fields. Ta cần option: validateBeforeSave
  await foundUserInDB.save({ validateBeforeSave: false });

  // 13) Phản hồi cho client
  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    secure: true, // https. Trong Development ta để false
    maxAge: 1 * 24 * 60 * 60 * 1000, // phải khớp với thời gian trong refreshToken
    sameSite: "None",
  });

  res.status(200).json({
    status: "success",
    message: "Đăng nhập thành công",
    accessToken: newAccessToken,
    user: {
      fullName: foundUserInDB.fullName,
      avatar: foundUserInDB.avatar,
      email: foundUserInDB.email,
      phoneNumber: foundUserInDB.phoneNumber,
      gender: foundUserInDB.gender,
      createdAt: foundUserInDB.createdAt,
      shippingAddress: foundUserInDB.shippingAddress,
      favoriteList: foundUserInDB.favoriteList,
      cart: foundUserInDB.cart,
    },
  });
});

// Chức năng: Đăng xuất
exports.logout = asyncFnHandler(async function (req, res, next) {
  // 1) Quét cookie trong req
  const cookies = req.cookies;

  // 2) Nếu không có refresh token trong cookies trả về phản hồi luôn, đồng thời xóa cookie phía client
  const oldRefreshToken = cookies?.jwt;
  if (!oldRefreshToken) {
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
    return res.sendStatus(204);
  }

  // 3) Tìm user trong database dựa trên refresh token
  const foundUserInDB = await User.findOne({ refreshToken: oldRefreshToken });

  // 4) Nếu không tìm thì user liên kết với refresh token này thì xóa cookie ở phía client
  if (!foundUserInDB) {
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
    return res.sendStatus(204);
  }

  // 5) Nếu có user liên kết với refresh token này. Xóa refresh token khỏi array refresh token của user trong database
  foundUserInDB.refreshToken = foundUserInDB.refreshToken.filter(
    (rt) => rt !== oldRefreshToken
  );

  // 6) Ta không muốn bị Schema validation toàn bộ field. Nên ta cà option: validateBeforeSave
  await foundUserInDB.save({ validateBeforeSave: false });

  // 7) Phản hồi
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.sendStatus(204);
});

// Chức năng: Đăng ký tài khoản
exports.register = asyncFnHandler(async function (req, res, next) {
  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    email: req.body.email,
    fullName: req.body.fullName,
  });

  req.newUser = newUser;

  next();
});

// Chức năng: Gửi email xác thực tài khoản
// 1) Gửi email
exports.sendEmailVerify = asyncFnHandler(async function (req, res, next) {
  // Trường hợp user vượt quá thời hạn, và sử dụng chức năng send email verify riêng không qua bước đăng ký
  let verifyURL;
  if (req.body.email) {
    const foundUserInDB = await User.findOne({
      email: req.body.email,
      isVerified: false,
    });

    if (!foundUserInDB) {
      return next(
        new CustomError(
          "Bạn đã thực hiện việc xác minh email rồi, không thể thực hiện tiếp."
        ),
        400
      );
    }

    // 1) Tạo một loại token mới dành cho email verify
    const emailVerifyToken = crypto.randomBytes(64).toString("hex");
    const hashEmailVerifyToken = crypto
      .createHash("sha256")
      .update(emailVerifyToken)
      .digest("hex");

    // 2) Lưu emailVerifyToken đã HASH vào document
    foundUserInDB.emailVerifyToken = hashEmailVerifyToken;
    foundUserInDB.emailVerifyTokenExpires = Date.now() + 1 * 60 * 60 * 1000; // thời hạn 1 tiếng
    await foundUserInDB.save({ validateBeforeSave: false });

    // 3) Tạo URL
    if (process.env.NODE_ENV === "development") {
      verifyURL = `${process.env.DEV_CLIENT_APP_URL}/verify-email/${emailVerifyToken}`;
    }
    if (process.env.NODE_ENV === "production") {
      verifyURL = `${process.env.PROD_CLIENT_APP_URL}/verify-email/${emailVerifyToken}`;
    }

    // 4) gửi
    try {
      await new Email(foundUserInDB, verifyURL).sendWelcome();

      res.status(200).json({
        status: "success",
        message:
          "Xin hãy xác thực tài khoản thông qua đường dẫn chúng tôi gửi vào email của bạn",
      });
    } catch (err) {
      return next(
        new CustomError("Có lỗi xảy ra trong việc gửi email cho bạn.", 424)
      );
    }
  } else if (req.newUser) {
    // Trường hợp user vừa đăng ký, gửi email xác thực
    // 1) Tạo một loại token mới dành cho email verify
    const emailVerifyToken = crypto.randomBytes(64).toString("hex");
    const hashEmailVerifyToken = crypto
      .createHash("sha256")
      .update(emailVerifyToken)
      .digest("hex");

    // 2) Lưu emailVerifyToken đã HASH vào document
    req.newUser.emailVerifyToken = hashEmailVerifyToken;
    req.newUser.emailVerifyTokenExpires = Date.now() + 1 * 60 * 60 * 1000; // thời hạn 1 tiếng
    await req.newUser.save({ validateBeforeSave: false });

    // 3) Tạo URL
    if (process.env.NODE_ENV === "development") {
      verifyURL = `${process.env.DEV_CLIENT_APP_URL}/verify-email/${emailVerifyToken}`;
    }
    if (process.env.NODE_ENV === "production") {
      verifyURL = `${process.env.PROD_CLIENT_APP_URL}/verify-email/${emailVerifyToken}`;
    }

    // 4) gửi
    try {
      await new Email(req.newUser, verifyURL).sendWelcome();

      res.status(200).json({
        status: "success",
        message:
          "Chúc mừng bạn đã đăng ký thành công. Xin hãy xác thực tài khoản thông qua đường dẫn chúng tôi gửi vào email của bạn",
      });
    } catch (err) {
      return next(
        new CustomError("Có lỗi xảy ra trong việc gửi email cho bạn.", 424)
      );
    }
  }
});

// 2) Quá trình xác thực
exports.verifyingEmail = asyncFnHandler(async function (req, res, next) {
  req.currentUser.isVerified = true;
  req.currentUser.emailVerifyTokenExpires = undefined;
  req.currentUser.emailVerifyToken = undefined;

  if (req.currentUser.changeEmailTo) {
    req.currentUser.email = req.currentUser.changeEmailTo;
    req.currentUser.changeEmailTo = undefined;
  }

  await req.currentUser.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    message: "Xác minh email thành công",
  });
});

// Chức năng: Cấp lại access token
exports.refresh = asyncFnHandler(async function (req, res, next) {
  const cookies = req.cookies;
  // 1) Trích xuất refresh token nằm trong cookies
  const oldRefreshToken = cookies?.jwt;

  // 2) Không có refresh token trả về lỗi
  if (!oldRefreshToken) {
    return next(new CustomError("Xác thực thất bại", 401));
  }

  // 3) Xóa cookie phía user để sau này ta gửi cookie mới về
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });

  // 4) Tìm user trong database dựa trên refresh token
  const foundUserInDB = await User.findOne({
    refreshToken: oldRefreshToken,
  }).populate({
    path: "favoriteList",
  });

  // 5) Kiểm tra user KHÔNG CÓ liên kết với refresh token này
  if (!foundUserInDB) {
    jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async function (err, decoded) {
        if (err) {
          return next(new CustomError("Forbidden", 403));
        }

        const hackedUser = await User.findById(decoded.userId);

        if (!hackedUser) return next(new CustomError("Forbidden", 403));

        hackedUser.refreshToken = [];
        await hackedUser.save({ validateBeforeSave: false });
      }
    );

    return next(new CustomError("Forbidden", 403));
  }

  // 6) Trường hợp này ta nhận refresh token nhưng refresh token tồn tại trong ảng refreshToken của 1 user

  // 6.1) xóa bỏ refresh token cũ khỏi danh sách refreshToken trong database
  const newRefreshTokenArrInDB = foundUserInDB.refreshToken.filter(
    (rt) => rt !== oldRefreshToken
  );

  // 7) Kiểm tra user CÓ liên kết với refresh token này
  jwt.verify(
    oldRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async function (err, decoded) {
      if (err) {
        foundUserInDB.refreshToken = [...newRefreshTokenArrInDB];
        await foundUserInDB.save({ validateBeforeSave: false });
      }

      // 7.1) Lỗi trường hợp XẢY RA CÙNG LÚC. Nghĩa là refresh token vừa hết hạn đúng lúc ta tìm thấy user trong database
      if (err || decoded.userId !== foundUserInDB._id.toString()) {
        return next(new CustomError("Forbidden", 403));
      }

      //  7.2 Tạo mới accessToken và refresh token gửi về cho user
      const newAccessToken = generateAccessToken(foundUserInDB);
      const newRefreshToken = generateRefreshToken(foundUserInDB);

      // 7.3 Lưu refresh token mới vào database
      foundUserInDB.refreshToken = [...newRefreshTokenArrInDB, newRefreshToken];
      await foundUserInDB.save({ validateBeforeSave: false });

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true, // https
        maxAge: 1 * 24 * 60 * 60 * 1000, // phải khớp với thời gian trong refreshToken
        sameSite: "None",
      });

      res.status(200).json({
        status: "success",
        accessToken: newAccessToken,
        user: {
          fullName: foundUserInDB.fullName,
          avatar: foundUserInDB.avatar,
          email: foundUserInDB.email,
          phoneNumber: foundUserInDB.phoneNumber,
          gender: foundUserInDB.gender,
          createdAt: foundUserInDB.createdAt,
          shippingAddress: foundUserInDB.shippingAddress,
          favoriteList: foundUserInDB.favoriteList,
          cart: foundUserInDB.cart,
        },
      });
    }
  );
});

// Chức năng: Quên tài khoản và mật khẩu
// 1) Gửi email
exports.forgot = asyncFnHandler(async function (req, res, next) {
  // 1) Lấy thông tin email từ req.body
  const { email } = req.body;

  // 1.1) Kiểm tra nếu không có email trong req.body báo lỗi
  if (!email)
    return next(new CustomError("Vui lòng cung cấp email của bạn", 400));

  // 2) Nếu có cung cấp email ta tìm user đó trong database
  const foundUserInDB = await User.findOne({ email });

  // 2.1) Nếu không có email liên kết với tài khoản nào trong database báo lỗi
  if (!foundUserInDB) {
    return next(
      new CustomError("Không có bất kỳ tài khoản liên kết với email này", 404)
    );
  }

  // 3) Tạo một lại token mói: Password Reset Token
  const passwordResetToken = crypto.randomBytes(64).toString("hex");
  const hashPasswordResetToken = crypto
    .createHash("sha256")
    .update(passwordResetToken)
    .digest("hex");

  // 4) Lưu passwordResetToken đã HASH vào document
  foundUserInDB.passwordResetToken = hashPasswordResetToken;
  foundUserInDB.passwordResetExpires = Date.now() + 5 * 60 * 1000; // thời hạn 5 phút
  await foundUserInDB.save({ validateBeforeSave: false });

  // 5) Tạo URL với password Reset Token CHƯA HASH

  let forgotURL;
  if (process.env.NODE_ENV === "development") {
    forgotURL = `${process.env.DEV_CLIENT_APP_URL}/reset-password/${passwordResetToken}`;
  }
  if (process.env.NODE_ENV === "production") {
    forgotURL = `${process.env.PROD_CLIENT_APP_URL}/reset-password/${passwordResetToken}`;
  }

  // 6) Gửi email
  try {
    await new Email(foundUserInDB, forgotURL).sendForgot();

    res.status(200).json({
      status: "success",
      message:
        "Đường dẫn lấy lại thông tin tài khoản. Chúng tôi đã gửi nó vào email của bạn",
    });
  } catch (err) {
    foundUserInDB.passwordResetToken = undefined;
    foundUserInDB.passwordResetExpires = undefined;
    await foundUserInDB.save({ validateBeforeSave: false });

    return next(
      new CustomError("Có lỗi xảy ra trong việc gửi email cho bạn.", 424)
    );
  }
});
// 2) Thay đổi mật khẩu qua email
exports.resetPassword = asyncFnHandler(async function (req, res, next) {
  // 1) Quét refresh token từ cookies
  const cookies = req.cookies;
  const oldRefreshToken = cookies?.jwt;

  // 2) Nếu có cookies thì xóa
  if (oldRefreshToken)
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });

  // 3) thay đổi mật khẩu
  req.currentUser.password = req.body.password;
  req.currentUser.passwordConfirm = req.body.passwordConfirm;
  req.currentUser.passwordResetToken = undefined;
  req.currentUser.passwordResetExpires = undefined;

  // 4) Xóa danh sách refresh token. Nghĩa là toàn bộ thiết bị đang đăng nhập với user này sẽ bị logout
  req.currentUser.refreshToken = [];
  await req.currentUser.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    message: "Thay đổi mật khẩu thành công",
  });
});

// Chức năng: Kiểm tra user dữ liệu email, username có trùng vs ai khác không?
exports.checkDuplicate = asyncFnHandler(async function (req, res, next) {
  const foundDuplicate = await User.find(req.query).select("fullName");

  const result = Boolean(foundDuplicate.length);

  res.status(200).json({
    status: "success",
    isExist: result,
  });
});

// Chức năng: Cập nhật thông tin tài khoản khi user đã đăng nhập
exports.updateInformation = asyncFnHandler(async function (req, res, next) {
  const { fullName, phoneNumber, gender } = req.body;

  req.currentUser.fullName = fullName;
  req.currentUser.phoneNumber = phoneNumber;
  req.currentUser.gender = gender;

  await req.currentUser.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    message: "Cập nhật thông tin thành công",
  });
});

// Chức năng: Cập nhật mật khẩu tài khoản khi user đã đăng nhập
exports.updateSecurityPassword = asyncFnHandler(async function (
  req,
  res,
  next
) {
  const { oldPassword, password, passwordConfirm } = req.body;

  if (!oldPassword) {
    return next(new CustomError("Vui lòng nhập mật khẩu cũ", 400));
  }

  if (!password || !passwordConfirm) {
    return next(new CustomError("Vui lòng nhập mật khẩu mới", 400));
  }

  const matchPassword = await bcrypt.compare(
    oldPassword,
    req.currentUser.password
  );

  if (!matchPassword) {
    return next(new CustomError("Bạn nhập sai mật khẩu cũ", 401));
  }

  req.currentUser.password = password;

  await req.currentUser.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    message: "Cập nhật mật khẩu thành công",
  });
});

exports.updateSecurityEmail = asyncFnHandler(async function (req, res, next) {
  const { email } = req.body;

  if (!email) {
    return next(new CustomError("Vui lòng cung cấp email", 400));
  }

  const foundUserInDB = await User.findOne({ email });

  if (foundUserInDB) {
    return next(
      new CustomError(
        "Email này đã liên kết với tài khoản khác vui lòng chọn email khác",
        400
      )
    );
  }

  // 1) Tạo một loại token mới dành cho email verify
  const emailVerifyToken = crypto.randomBytes(64).toString("hex");
  const hashEmailVerifyToken = crypto
    .createHash("sha256")
    .update(emailVerifyToken)
    .digest("hex");

  // 2) Lưu emailVerifyToken đã HASH vào document
  req.currentUser.emailVerifyToken = hashEmailVerifyToken;
  req.currentUser.emailVerifyTokenExpires = Date.now() + 1 * 60 * 60 * 1000; // thời hạn 1 tiếng
  req.currentUser.changeEmailTo = email;
  await req.currentUser.save({ validateBeforeSave: false });

  // 3) Tạo URL
  let verifyURL;
  if (process.env.NODE_ENV === "development") {
    verifyURL = `${process.env.DEV_CLIENT_APP_URL}/verify-email/${emailVerifyToken}`;
  }
  if (process.env.NODE_ENV === "production") {
    verifyURL = `${process.env.PROD_CLIENT_APP_URL}/verify-email/${emailVerifyToken}`;
  }

  // 4) gửi
  try {
    await new Email(req.currentUser, verifyURL).sendUpdateEmail();

    res.status(200).json({
      status: "success",
      message:
        "Xin hãy xác thực tài khoản thông qua đường dẫn chúng tôi gửi vào email của bạn",
    });
  } catch (err) {
    return next(
      new CustomError("Có lỗi xảy ra trong việc gửi email cho bạn.", 424)
    );
  }
});

// Chức năng: Cung cấp thông tin  về tài khoản cho trang profile
exports.profile = asyncFnHandler(async function (req, res, next) {
  const foundUserInDB = await User.findById(
    req.currentUser._id.toString()
  ).populate({ path: "favoriteList" });

  res.status(200).json({
    status: "success",
    user: {
      fullName: foundUserInDB.fullName,
      avatar: foundUserInDB.avatar,
      email: foundUserInDB.email,
      phoneNumber: foundUserInDB.phoneNumber,
      gender: foundUserInDB.gender,
      createdAt: foundUserInDB.createdAt,
      shippingAddress: foundUserInDB.shippingAddress,
      favoriteList: foundUserInDB.favoriteList,
      cart: foundUserInDB.cart,
    },
  });
});

// Chức năng: Xóa tài khoản
exports.deleteAccount = asyncFnHandler(async function (req, res, next) {
  if (req.body.username !== req.currentUser.username) {
    return next(
      new CustomError(
        "username bạn nhập không chính xác với tài khoản này",
        400
      )
    );
  }

  await User.findByIdAndDelete(req.currentUser._id.toString());

  res.status(200).json({
    status: "success",
    message: "Xóa tài khoản thành công",
  });
});

// Chức năng: Cập nhật ảnh đại diện tài khoản khi user đã đăng nhập
exports.uploadAvatar = asyncFnHandler(async function (req, res, next) {
  // const { avatar } = req.files;

  // chỉ lưu ở server
  // const createFileName = `${Date.now()}-${req.currentUser._id.toString()}-${
  //   req.files.avatar.name
  // }`;
  //const createPath = `./public/users/${req.currentUser._id.toString()}/${createFileName}`;

  // avatar.mv(createPath, async function (err) {
  //   if (err) {
  //     return next(new CustomError("Có lỗi xảy ra...", 500));
  //   }

  //   req.currentUser.avatar = createFileName;
  //   await req.currentUser.save({ validateModifiedOnly: true });

  //   res.status(200).json({
  //     status: "success",
  //     message: "Cập nhật avatar thành công",
  //   });
  // });

  // lưu trên dịch vụ cloudinary

  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const imgObj = await cloudinary(dataURI, "users/avatar");

    req.currentUser.avatar = imgObj.secure_url;
    await req.currentUser.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Cập nhật avatar thành công",
    });
  } catch (err) {
    console.log(err);
  }
});

// Chức năng: CRUD danh sách địa chỉ nhận hàng
exports.addShippingAddress = asyncFnHandler(async function (req, res, next) {
  const { address, phoneNumber } = req.body;

  if (!address || !phoneNumber) {
    return next(
      new CustomError("Vui lòng cung cấp địa chỉ và số điện thoại", 400)
    );
  }

  if (req.currentUser.shippingAddress.length === 4) {
    return next(
      new CustomError(
        "Danh sách địa chỉ giao hàng của bạn chỉ chứa tối đa 4 địa chỉ khác nhau",
        400
      )
    );
  }

  let newShippingAddressArrInDB = [];

  newShippingAddressArrInDB = [
    ...req.currentUser.shippingAddress,
    { address, phoneNumber },
  ];

  req.currentUser.shippingAddress = newShippingAddressArrInDB;

  await req.currentUser.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    message: "Thêm thành công",
  });
});

exports.updateShippingAddress = asyncFnHandler(async function (req, res, next) {
  const { _id, address, phoneNumber } = req.body;

  if (!address || !phoneNumber) {
    return next(
      new CustomError("Vui lòng cung cấp địa chỉ và số điện thoại", 400)
    );
  }

  const findIndexObj = req.currentUser.shippingAddress.findIndex(
    (el) => el._id.toString() === _id
  );

  req.currentUser.shippingAddress[findIndexObj] = {
    ...req.currentUser.shippingAddress[findIndexObj],
    address,
    phoneNumber,
  };

  await req.currentUser.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    message: "Sửa thành công",
  });
});

exports.deleteShippingAddress = asyncFnHandler(async function (req, res, next) {
  const newShippingAddressArrInDB = req.currentUser.shippingAddress.filter(
    (el) => el._id.toString() !== req.body._id
  );

  req.currentUser.shippingAddress = newShippingAddressArrInDB;
  await req.currentUser.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    message: "Xóa thành công",
  });
});

// Chức năng: Update danh sách yêu thích hoặc xóa
exports.updateFavoriteList = asyncFnHandler(async function (req, res, next) {
  const { bookId } = req.body;

  const isAlreadyAdded = await req.currentUser.favoriteList.some(
    (id) => id.toString() === bookId
  );

  if (isAlreadyAdded)
    return next(
      new CustomError(
        "Bạn đã thêm quyển sách này vào danh sách yêu thích trước đó rồi",
        400
      )
    );

  req.currentUser.favoriteList.push({
    _id: bookId,
  });

  await req.currentUser.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    message: "Thêm vào danh sách yêu thích thành công.",
  });
});

exports.deleteFavoriteList = asyncFnHandler(async function (req, res, next) {
  const { bookId } = req.body;

  const newFavoriteList = req.currentUser.favoriteList.filter(
    (id) => id.toString() !== bookId
  );

  req.currentUser.favoriteList = newFavoriteList;

  await req.currentUser.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    message: "Xóa khỏi danh sách yêu thích thành công.",
  });
});

// Chức năng: lưu lại giỏ hàng. Nhầm tiện nghi cho user đỡ phải mò và thêm lại
exports.updateCurrentCart = asyncFnHandler(async function (req, res, next) {
  const { cart } = req.body;

  req.currentUser.cart = cart;
  await req.currentUser.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    message: "Cập nhật giỏ hàng thành công",
  });
});
