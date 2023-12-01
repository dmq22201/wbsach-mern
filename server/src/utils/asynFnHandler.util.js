function asyncFnHandler(asyncFn) {
  return function (req, res, next) {
    asyncFn(req, res, next).catch(next);
  };
}

module.exports = asyncFnHandler;
