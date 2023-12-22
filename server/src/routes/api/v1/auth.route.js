const express = require("express");
const authController = require("../../../controllers/auth.controller");

// Middleware
const multerErrorHandler = require("../../../middlewares/multerErrorHandler.middleware");
const reqLimiter = require("../../../middlewares/reqLimiter.middleware");
const checkVerifyEmail = require("../../../middlewares/checkVerifiedEmail.middleware");
const verifyJWT = require("../../../middlewares/verifyJWT.middleware");
const verifyRole = require("../../../middlewares/verifyRole.middleware");
const verifyPasswordResetToken = require("../../../middlewares/verifyPasswordResetToken.middleware");
const verifyEmailToken = require("../../../middlewares/verifyEmailToken.middleware");

const router = express.Router();

// ========== User Side ========== //
router
  .route("/login")
  .post(
    reqLimiter(
      5,
      15 * 60 * 1000,
      "Bạn đã đăng nhập nhiều lần. Xin hãy thử lại sau 15 phút"
    ),
    checkVerifyEmail,
    authController.login
  );
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
router.route("/refresh").get(authController.refresh);
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
  .route("/profile/shipping-address")
  .post(
    verifyJWT,
    verifyRole(["user", "admin"]),
    authController.addShippingAddress
  )
  .delete(
    verifyJWT,
    verifyRole(["user", "admin"]),
    authController.deleteShippingAddress
  )
  .patch(
    verifyJWT,
    verifyRole(["user", "admin"]),
    authController.updateShippingAddress
  );

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
    multerErrorHandler,
    authController.uploadAvatar
  );

// ========== Not User Side ========== //
router.route("/check-duplicate").get(authController.checkDuplicate);

module.exports = router;
