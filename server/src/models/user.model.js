const mongoose = require("mongoose");
const {
  REGEX_USERNAME,
  REGEX_PASSWORD,
  REGEX_EMAIL,
  REGEX_FULLNAME,
  REGEX_PHONENUMBER,
} = require("../configs/regex.config");
const bcrypt = require("bcrypt");

/*

  ShippingAddress: mối quan hệ 1:FEW . Một user chỉ có vài địa chỉ nhận hàng

*/
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    validate: {
      validator(fieldValue) {
        return REGEX_USERNAME.test(fieldValue);
      },
      message:
        "Username có ít nhất 4 và cao nhất 20 ký tự và không có ký tự đặc biệt.",
    },
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Vui lòng nhập mật khẩu"],
    validate: {
      validator(fieldValue) {
        return REGEX_PASSWORD.test(fieldValue);
      },
      message:
        "Mật khẩu phải có ít nhất 4 ký tự và cao nhất 20 ký tự, 1 HOA, 1 thường, 1 số, 1 ký tự đặc biệt",
    },
  },
  passwordConfirm: {
    type: String,
    trim: true,
    required: [true, "Vui lòng nhập lại mật khẩu"],
    validate: {
      validator(fieldValue) {
        return fieldValue === this.password;
      },
      message: "Nhập lại mật khẩu không đúng",
    },
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Vui lòng nhập email"],
    validate: {
      validator(fieldValue) {
        return REGEX_EMAIL.test(fieldValue);
      },
      message: "Email của bạn không hợp lệ",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "Không chấp nhận {VALUE}",
    },
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fullName: {
    type: String,
    trim: true,
    required: [true, "Vui lòng nhập họ tên của bạn"],
    validate: {
      validator(fieldValue) {
        return REGEX_FULLNAME.test(fieldValue);
      },
      message:
        "Yêu cầu họ tên của bạn ít nhất 4 tới 20 ký tự, không có số, hay ký tự đặc biệt",
    },
  },
  avatar: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "Không tiết lộ",
    enum: ["Nam", "Nữ", "Không tiết lộ"],
  },
  shippingAddress: {
    type: [
      {
        address: {
          type: String,
          trim: true,
        },
        phoneNumber: {
          type: String,
          trim: true,
          validate: {
            validator(fieldValue) {
              return REGEX_PHONENUMBER.test(fieldValue);
            },
            message: "Số điện thoại không hợp lệ. Gồm 10 số VD: 0123456789",
          },
        },
      },
    ],
    validate: {
      validator(fieldValue) {
        return fieldValue.length <= 4;
      },
      message: "Bạn chỉ được phép thêm tối đa 4 địa chỉ giao hàng",
    },
  },
  phoneNumber: {
    type: String,
    trim: true,
    validate: {
      validator(fieldValue) {
        return REGEX_PHONENUMBER.test(fieldValue);
      },
      message: "Số điện thoại không hợp lệ. Gồm 10 số VD: 0123456789",
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  favoriteList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  cart: [Object],
  refreshToken: [String],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerifyToken: String,
  emailVerifyTokenExpires: Date,
  changeEmailTo: String,
});

// * Document Middleware
// * .pre() sẽ chạy trước khi document được lưu vào collection
// * .pre() sẽ chạy sau khi document được lưu vào collection

// * Mục đích là mã hóa mật khẩu
userSchema.pre("save", async function (next) {
  // * NOTE: this = document hiện tại

  // 1) Khi bạn tạo user thì trường password đã bị thay đổi => !true = false.
  if (!this.isModified("password")) return next();

  // 2) Mã hóa mật khẫu trước khi lưu vào collection
  this.password = await bcrypt.hash(this.password, 10);

  // 3) Ta cần set undefined để trường này không xuất hiện trong collection
  this.passwordConfirm = undefined;

  next();
});

// * Mục đích cập nhật thời gian mật khẩu của user bị thay đổi vào thời gian nào
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000; // vì mốt số lý do về hệ thống có thể sẽ sai thời gian. Nên ta không ép buốc phải đúng thời gian, ta có thể giảm ít nhất 1s ~ 2s
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
