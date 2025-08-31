export function globalErrorHandler(err, req, res, next) {
  res.status(err.statusCode || 500).json({
    status: err.statusText || "error",
    message: err.message,
    data: null,
  });
}