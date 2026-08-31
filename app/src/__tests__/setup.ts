import jwt from "jsonwebtoken";

/** Shared test data and helpers for authentication tests. */
export const mockJwtSecret = "test-secret";

export const createMockToken = (payload: any): string => {
  return jwt.sign(payload, mockJwtSecret, { expiresIn: "1h" });
};

export const mockUser = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "$2b$10$hashedpassword123", // bcrypt hash
  roleId: 1,
};

export const mockRole = {
  id: 1,
  name: "USER",
};
