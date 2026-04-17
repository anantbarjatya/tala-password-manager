const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Development mein stack trace dikhao, production mein nahi
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;