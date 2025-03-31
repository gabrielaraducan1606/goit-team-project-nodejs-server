export function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: error.details.map(detail => detail.message).join(', '),
      });
    }
    next();
  };
}
