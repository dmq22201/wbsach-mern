const CustomError = require("../utils/CustomError.util");

const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req?.currentUser.role) {
      return next(
        new CustomError(
          "Bạn không có quyền hạn truy cập hay thực hiện hành vi này",
          403
        )
      );
    }

    const rolesArray = [...allowedRoles];
    const result = rolesArray.includes(req.currentUser.role);

    if (!result) {
      return next(
        new CustomError(
          "Bạn không có quyền hạn truy cập hay thực hiện hành vi này",
          403
        )
      );
    }

    next();
  };
};

module.exports = verifyRole;
