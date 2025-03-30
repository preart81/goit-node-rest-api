const ctrlWrapper = (ctrlFunc) => {
  const wrappedFunc = async (req, res, next) => {
    try {
      await ctrlFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return wrappedFunc;
};

export default ctrlWrapper;
