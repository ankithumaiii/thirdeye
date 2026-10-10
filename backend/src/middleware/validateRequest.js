export function validateRequest(schema) {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (err) {
      if (err.errors) {
        return res.status(400).json({
          error: 'VALIDATION_FAILED',
          message: 'Request payload validation failed',
          issues: err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: err.message
      });
    }
  };
}
