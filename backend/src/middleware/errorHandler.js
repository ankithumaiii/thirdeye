export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(err, req, res, next) {
  console.error('[ServerError]', err.message);

  const status = err.status || 500;
  res.status(status).json({
    error: err.code || 'INTERNAL_SERVER_ERROR',
    message: status === 500 ? 'An unexpected server error occurred. Simulation state remains protected.' : err.message
  });
}
