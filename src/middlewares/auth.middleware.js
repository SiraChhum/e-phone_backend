import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers.cookie && req.headers.cookie.includes("token=")) {
    token = req.headers.cookie.split("token=")[1].split(";")[0];
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};
