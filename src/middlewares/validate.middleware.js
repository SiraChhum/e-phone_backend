import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: JSON.parse(error.message).map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }
    next(error);
  }
};
