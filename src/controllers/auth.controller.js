import { asyncHandler } from "../utils/helpers.js";
import { successResponse, errorResponse } from "../utils/response.js";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import Users from "../models/users.model.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

// Google OAuth2 client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

//  Get logged-in user info
export const me = asyncHandler(async (req, res) => {
  const id = req.user?.id; // from auth middleware

  if (!id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  const user = await Users.findByPk(id); //  FIXED
  if (!user) {
    return errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
  }

  return successResponse(res, user, "User details retrieved successfully");
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //  find user by email
  const user = await Users.findOne({ where: { email } });
  if (!user) {
    return errorResponse(res, "Invalid email or password", StatusCodes.UNAUTHORIZED);
  }

  //  compare passwords
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return errorResponse(res, "Invalid email or password", StatusCodes.UNAUTHORIZED);
  }

  // generate token
  const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  console.log("Generated Token:", token); // Debugging log

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 86400000,
    })
    .status(StatusCodes.OK)
    .json({
      message: "Login successful",
      user,
      token,
    });
});

 
export const createUser = async (req, res) => {
  try {
    const { full_name, email, password, phone, role,last_login, email_verified } = req.body;
    const image = req.file ? req.file.filename : null;

    //  Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      role,
      image,
      status: "ACTIVE",
      last_login,
      email_verified,
    });

    res.json({ message: "User created successfully", user });
  } catch (error) {
    console.error(" Create User Error:", error);
    res.status(500).json({ message: error.message });
  }
};

//  Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const deleted = await Users.destroy({ where: { id } });
  res.json({ deleted });
});

//  Get one user by ID
export const getUsers = asyncHandler(async (req, res) => {
  const id = req.body.id;
  const data = await Users.findByPk(id);
  res.json(data);
});

//  Get all users
export const listUsers = asyncHandler(async (req, res) => {
  const data = await Users.findAll();
  res.json(data);
});


export const updateUser = asyncHandler(async (req, res) => {
  const { id, full_name, password,gender, phone, country,city, address, date_of_birth } = req.body;
  const { file } = req;

  const user = await Users.findByPk(id);
  if (!user) {
    return errorResponse(res, "User not found", 404);
  }

  user.full_name = full_name;
  if (password) user.password = await bcrypt.hash(password, 10);
  user.phone = phone;
  user.gender = gender; // Assuming you have a gender field in your model, adjust as necessary
  user.country = country;
  user.city = city;
  user.address = address;
  user.date_of_birth = date_of_birth;
  user.image = file ? file.filename : user.image;

  await user.save();
  res.json({ message: "User updated", user });
});

// ─── Google OAuth ────────────────────────────────────────────────────────────

// Step 1: Redirect user to Google consent screen
export const googleAuthRedirect = asyncHandler(async (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["profile", "email"],
      prompt: "consent",
    });
    res.redirect(url);
  } catch (error) {
    console.error('Google redirect error:', error);
    return errorResponse(res, 'Failed to initiate Google OAuth', 500);
  }
});

// Step 2: Handle Google callback, create/link user, issue JWT
export const googleAuthCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return errorResponse(res, "Missing authorization code", StatusCodes.BAD_REQUEST);
  }

  // Exchange code for tokens
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Verify ID token and get user profile
  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { sub: googleId, email, name: fullName, picture } = payload;

  // Find user by google_id, or by email (link existing account), or create new
  let user = await Users.findOne({ where: { google_id: googleId } });

  if (!user) {
    user = await Users.findOne({ where: { email } });
    if (user) {
      // Link existing account to Google
      user.google_id = googleId;
      user.google_access_token = tokens.access_token;
      user.google_refresh_token = tokens.refresh_token || user.google_refresh_token;
      user.email_verified = true;
      await user.save();
    } else {
      // Create brand-new user from Google profile
      user = await Users.create({
        full_name: fullName,
        email,
        password: null,
        google_id: googleId,
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token || null,
        image: picture || null,
        role: "CUSTOMER",
        status: "ACTIVE",
        email_verified: true,
      });
    }
  } else {
    // Update tokens for returning Google user
    user.google_access_token = tokens.access_token;
    if (tokens.refresh_token) user.google_refresh_token = tokens.refresh_token;
    user.last_login = new Date();
    await user.save();
  }

  // Issue JWT (same format as normal login)
  const token = jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // Set cookie and redirect/respond
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 86400000, // 1 day
  });

  if (req.xhr || req.headers.accept?.includes("json") || req.query.json === "true") {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Google authentication successful",
      user,
      token,
      needsPassword: !user.password
    });
  }

  res.redirect(`${process.env.WEB_URL}?token=${token}`);
});

// Set Password (for users who registered via Google without a password)
export const setPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const id = req.user?.id; // from authMiddleware

  if (!id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  if (!password || password.length < 6) {
    return errorResponse(res, "Password must be at least 6 characters long", StatusCodes.BAD_REQUEST);
  }

  const user = await Users.findByPk(id);
  if (!user) {
    return errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  return successResponse(res, null, "Password set successfully");
});
