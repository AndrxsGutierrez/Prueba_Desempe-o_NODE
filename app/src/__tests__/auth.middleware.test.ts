/// <reference types="jest" />
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../error/appError";
import { authenticateToken, AuthRequest } from "../middlewares/auth.middleware";
import { createMockToken } from "./setup";

describe("AuthMiddleware - authenticateToken", () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {};
    mockNext = jest.fn();
    process.env.JWT_SECRET = "test-secret";
  });

  it("should validate token and call next()", () => {
    const token = createMockToken({ userId: 1, roleId: 1 });
    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    authenticateToken(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user?.userId).toBe(1);
  });

  it("should throw error if Bearer token is missing", () => {
    mockReq.headers = {
      authorization: undefined,
    };

    authenticateToken(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = (mockNext as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.status).toBe(401);
  });

  it("should throw error if authorization header doesn't start with Bearer", () => {
    mockReq.headers = {
      authorization: "Basic xyz123",
    };

    authenticateToken(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = (mockNext as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.status).toBe(401);
  });

  it("should throw error if token is invalid", () => {
    mockReq.headers = {
      authorization: "Bearer invalid.token.here",
    };

    authenticateToken(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = (mockNext as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.status).toBe(401);
  });

  it("should throw error if JWT_SECRET is not configured", () => {
    delete process.env.JWT_SECRET;
    const token = jwt.sign({ userId: 1, roleId: 1 }, "some-secret");
    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    authenticateToken(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const error = (mockNext as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.status).toBe(500);
  });
});
