import { db } from "../config/index.js";
import bcrypt from "bcrypt";


  
export const me = async (id) => {
  const query = `SELECT id, email FROM users WHERE id = $1`;
  const result = await db.query(query, [id]);
  const user = result.rows[0];
  if (!user) {
    return null;
  }
  // Remove password before returning user
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const login = async ({ email, password }) => {
  const query = `SELECT * FROM users WHERE email = $1`;
    const result = await db.query(query, [email]);
    const foundUser = result.rows[0];
    if (!foundUser) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return null;
    }
    // Set httpOnly cookie (readonly from JS)
    // res.cookie("user_id", foundUser.id, {
    //   httpOnly: true,
    //   sameSite: "strict",
    //   secure: process.env.NODE_ENV === "production",
    // });
    // Remove password before returning user
    const { password: _, ...userWithoutPassword } = foundUser;
    return userWithoutPassword;
};

export const createUser = async ({ name, email, password, role }) => {
  const now = new Date();
  const result = await db.query(
    `INSERT INTO users (name, email, password, role, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, email, password, role, now, now]
  );
  return result.rows[0];
};

// Function to delete a user by ID
export const deleteUser = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
  const result = await db.query(query, [id]);
  if (result.rowCount === 0) {
    return null;
  }
  return result.rows[0];
};

//list users
export const listUsers = async () => {
  const query = `SELECT id, name, email, role FROM users`;
  const result = await
  db.query(query);
  return result.rows;
};