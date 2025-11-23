export function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Unexpected error';

  res.status(status).json({
    success: false,
    error: {
      message,
      status
    }
  });
}
