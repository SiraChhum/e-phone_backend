import { StatusCodes, getReasonPhrase } from "http-status-codes";

/**
 * ✅ Success Response Helper
 * @param {Response} res
 * @param {Object} data - Data to return
 * @param {string} message - Optional custom message
 * @param {number} status - HTTP status (default 200 OK)
 */
export const successResponse = (res, data = {}, message = null, status = StatusCodes.OK) => {
  return res.status(status).json({
    success: true,
    message: message || getReasonPhrase(status),
    data,
  });
};

/**
 * ❌ Error Response Helper
 * @param {Response} res
 * @param {Error} error - The caught error
 * @param {number} status - HTTP status (default 500 Internal Server Error)
 */
export const errorResponse = (res, error, status = StatusCodes.INTERNAL_SERVER_ERROR) => {
  return res.status(status).json({
    success: false,
    message: error || getReasonPhrase(status),
    error: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};
