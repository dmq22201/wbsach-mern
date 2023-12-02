const express = require("express");
const authController = require("../controllers/auth.controller");

const reqLimiter = require("../middlewares/reqLimiter.middleware");
const checkVerifyEmail = require("../middlewares/checkVerifiedEmail.middleware");
const verifyJWT = require("../middlewares/verifyJWT.middleware");
const verifyRole = require("../middlewares/verifyRole.middleware");
const verifyPasswordResetToken = require("../middlewares/verifyPasswordResetToken.middleware");
const verifyEmailToken = require("../middlewares/verifyEmailToken.middleware");
const multer = require("multer");

const storage = new multer.memoryStorage();
const upload = multer({
  storage,
});

const router = express.Router();

router.route("/login").post(checkVerifyEmail, authController.login);
router.route("/logout").post(authController.logout);

router
  .route("/register")
  .post(authController.register, authController.sendEmailVerify);

router
  .route("/send-email-verify")
  .post(
    reqLimiter(
      5,
      15 * 60 * 1000,
      "Bạn đã yêu cầu gửi lại email xác thực quá nhiều lần. Vui lòng thử lại sau 15 phút"
    ),
    authController.sendEmailVerify
  );

router
  .route("/verify-email/:emailVerifyToken")
  .get(verifyEmailToken, authController.verifyingEmail);

router.route("/refresh").post(authController.refresh);
router.route("/check-duplicate").get(authController.checkDuplicate);

router
  .route("/forgot")
  .post(
    reqLimiter(
      5,
      15 * 60 * 1000,
      "Bạn đã yêu cầu lấy lại thông tin tài khoản của bạn quá nhiều. Vui lòng thử lại sau 15 phút"
    ),
    authController.forgot
  );
router
  .route("/reset-password/:passwordResetToken")
  .get(verifyPasswordResetToken)
  .post(verifyPasswordResetToken, authController.resetPassword);

router
  .route("/profile")
  .get(verifyJWT, verifyRole(["user", "admin"]), authController.profile);

router
  .route("/update-information")
  .patch(
    verifyJWT,
    verifyRole(["user", "admin"]),
    authController.updateInformation
  );

router
  .route("/update-security-password")
  .patch(
    verifyJWT,
    verifyRole(["user", "admin"]),
    authController.updateSecurityPassword
  );

router
  .route("/update-security-email")
  .patch(
    verifyJWT,
    verifyRole(["user", "admin"]),
    authController.updateSecurityEmail
  );

router
  .route("/delete-account")
  .delete(
    verifyJWT,
    verifyRole(["user", "admin"]),
    authController.deleteAccount
  );

router
  .route("/upload-avatar")
  .patch(
    verifyJWT,
    verifyRole(["user", "admin"]),
    upload.single("avatar"),
    authController.uploadAvatar
  );

module.exports = router;
