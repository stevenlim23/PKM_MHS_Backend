// ExpressError with status included, original Error class doens't include status
class ExpressError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
  static destroyPost(table, id) {
    table.destroy({
      where: { id },
    });
  }
}

const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => {
      if (e) {
        if (e.status > 400 || !e.status) {
          console.log("\x1b[31m", "Catch Error: ");
          console.log("\x1b[37m", e.stack);
        }
        next(e);
      }
    });
  };
};

const errorHandler = {
  wrapAsync: wrapAsync,
  ExpressError: ExpressError,
};

module.exports = errorHandler;
