const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    ok: false,
    msg: "Something went wrong, please try again later.",
    error: err.message,
  });
};

module.exports = errorHandler;