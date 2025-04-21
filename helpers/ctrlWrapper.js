const ctrlWrapper = (ctrlFunc) => {
  const wrappedFunc = async (req, res, next) => {
    try {
      await ctrlFunc(req, res, next);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        error.status = 400;
      }
      if (error.name === "SequelizeUniqueConstraintError") {
        error.status = 409;
      }
      next(error);
    }
  };

  return wrappedFunc;
};

export default ctrlWrapper;
