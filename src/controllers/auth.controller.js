import UserService from "#services/auth";
import httpStatus from "#utils/httpStatus";
import asyncHandler from "#utils/asyncHandler";
import { sendResponse } from "#utils/response";
import { session } from "#middlewares/session";
import jwt from 'jsonwebtoken';
import env from "#configs/env";

// This function will verify and decode the token
function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET); // replace 'your-secret-key' with your actual secret
    return decoded;
  } catch (error) {
    throw new Error('Token is invalid or expired');
  }
}

export const getUser = asyncHandler(async function (req, res, _next) {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return ('No token provided');
  }
  const decoded = decodeToken(token); // Decoding the token
  // You can access user data like this
  const userId = decoded.id; // This will give you the 'id' from the token payload
  const userRole = decoded.role; // This will give you the 'role' from the token payload

  const user = await UserService.get(userId);
  const { password, ...userDataWithoutPassword } = user._doc;
  sendResponse(httpStatus.OK, res, userDataWithoutPassword, "User fetched successfully");
});

export const register = asyncHandler(async function (req, res, _next) {
  const newUser = await UserService.register(req.body);
  const message = newUser.message || "User created successfully";
  const data = { token: newUser.token, user: newUser.user };
  const status = newUser.httpStatus || httpStatus.CREATED;
  sendResponse(status, res, data, message);
});

export const login = asyncHandler(async function (req, res, _next) {
  const authData = await UserService.login(req.body);
  const message = authData.message || "Login successfully";
  const data = authData.user;
  const token = authData.token;
  const status = authData.httpStatus || httpStatus.OK;
  sendResponse(status, res, { token, user: data }, message);
});

export const updateUser = asyncHandler(async function (req, res, _next) {
  const { id } = req.params;  
  const updatedUser = await UserService.update(id, req.body);
  sendResponse(httpStatus.OK, res, updatedUser, "User updated successfully");
});

export const deleteUser = asyncHandler(async function (req, res, _next) {
  const { id } = req.params;
  const deletedUser = await UserService.deleteDoc(id);
  sendResponse(httpStatus.OK, res, deletedUser, "User deleted successfully");
});

export function authorization(role) {
  return asyncHandler(async function (req, _res, next) {
    const payload = session.get("user");
    if (payload.role === "admin") return next();
    if (role !== payload.role) {
      throw {
        status: false,
        message: "Operation not permitted",
        httpStatus: httpStatus.FORBIDDEN,
      };
    }
    next();
  });
}
