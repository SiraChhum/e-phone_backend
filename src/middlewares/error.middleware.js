import { StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: err.message || "Internal Server Error",
  });
};
