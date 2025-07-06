import User from "#models/user";
import { verifyToken } from "#utils/jwt";
import httpStatus from "#utils/httpStatus";
import { session } from "#middlewares/session";
import asyncHandler from "#utils/asyncHandler";
import jwt from 'jsonwebtoken';
import env from "#configs/env";


export const ADMIN = "admin";


function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET); // replace 'your-secret-key' with your actual secret
    return decoded;
  } catch (error) {
    console.log(error)
    throw new Error('Token is invalid or expired');
  }
}

export async function authentication(req, res, next) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw {
        status: false,
        httpStatus: httpStatus.UNAUTHORIZED,
        message: "Invalid token please login again",
      };
    }
    const payload = verifyToken(token);
    let user = await User.findById(payload.id)
      .populate("role", "name permissions")
      .select("name mobileNo email role profilePic mobileNo");
    if (!user) {
      throw {
        status: false,
        httpStatus: httpStatus.UNAUTHORIZED,
        message: "User doesn't exist",
      };
    }
    user = user.toJSON();
    user.permissions = user.role.permissions;
    user.role = user.role;
    delete user.password;

    req.user = user;
    // session.set("user", user);
    // session.set("payload", payload);
    next();
  } catch (err) {
    next(err);
  }
}

export function authorization(role) {
  return asyncHandler(async function (req, _res, next) {
    // const payload = session.get("user");
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token)
    if (!token) {
      return ('No token provided');
    }
    const payload = decodeToken(token); // Decoding the token
    // You can access user data like this
    const userId = payload.id; // This will give you the 'id' from the token payload
    const userRole = payload.role; // This will give you the 'role' from the token payload

    console.log(role, payload)
    if (userRole === ADMIN) return next();
    // role = user
    // if (!role) return;
    if (role !== userRole) {
      throw {
        status: false,
        message: "Operation not permitted",
        httpStatus: httpStatus.FORBIDDEN,
      };
    }
    next();
  });
}

