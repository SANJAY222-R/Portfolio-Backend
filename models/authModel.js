import { query } from "../db.js";

export const findUserByEmail = async (email) => {
  const text = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  const { rows } = await query(text, values);
  return rows[0];
};

export const createUser = async (name, email, password) => {
  const text =
    "INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *";
  const values = [name, email, password];
  const { rows } = await query(text, values);
  return rows[0];
};

export const findUserByResetToken = async (token) => {
    const text = "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > $2";
    const values = [token, Date.now()];
    const { rows } = await query(text, values);
    return rows[0];
};

export const setResetToken = async (email, token, expires) => {
    const text = "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3 RETURNING *";
    const values = [token, expires, email];
    const { rows } = await query(text, values);
    return rows[0];
};

export const updateUserPassword = async (id, password) => {
    const text = "UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2 RETURNING *";
    const values = [password, id];
    const { rows } = await query(text, values);
    return rows[0];
};
