import User from "#models/user";
import Service from "#services/base";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { session, setSessionData } from "#middlewares/session";
import httpStatus from "#utils/httpStatus";
import { sendEmail } from "#utils/mail";
import crypto from 'crypto';

class UserService extends Service {
  static Model = User;

  static async register(data) {
    const { name, email, password, role, profilePic } = data;
    let user = await this.Model.findOne({ email });
    if (user)
      return {
        httpStatus: httpStatus.CONFLICT,
        message: "User already exists",
      };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new this.Model({
      name,
      email,
      password: hashedPassword,
      role,
      profilePic,
    });
    console.log(user)
    await user.save();
    setSessionData("user", user)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    // session.set("user", user);
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNo,
        role: user.role,
      },
    };
  }

  static async login(data) {
    const { email, password } = data;
    console.log(email, password)
    const user = await this.Model.findOne({
      $or: [
        // { mobileNo },
        { email }
      ]
    });
    // const user = await this.Model.findOne({ mobileNo });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        httpStatus: httpStatus.UNAUTHORIZED,
        message: "Invalid credentials",
      };
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    session.set("user", user);
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }


  static async resetPasswordByEmail(email) {
    const user = await this.Model.findOne({ email });

    if (!user) {
      return {
        httpStatus: httpStatus.NOT_FOUND,
        message: "User not found",
      };
    }

    // Generate random password (10 characters)
    const newPassword = crypto.randomBytes(5).toString("hex");

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Save the new password
    user.password = hashedPassword;
    await user.save();

    const emailHtml = `
    <p>Hello <strong>${user.name}</strong>,</p>
    <p>Your password has been reset. Here is your new temporary password:</p>
    <p><strong>${newPassword}</strong></p>
    <p>Please log in and change your password as soon as possible.</p>
    <p>Thanks,<br>${process.env.APP_NAME || 'Your App Team'}</p>
  `;

    try {
      await sendEmail(user.email, "Password Reset Request", emailHtml);
      return {
        success: true,
        message: "A new password has been sent to your email address.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to send email.",
        error: error.message,
      };
    }
  }



  static async getAllUsers(currentUser) {
    // Check if current user has permission
    if (!['admin', 'manager'].includes(currentUser.role)) {
      return {
        httpStatus: httpStatus.FORBIDDEN,
        message: "You are not authorized to access this resource",
      };
    }

    try {
      const users = await this.Model.find({}, "-password"); // Exclude password
      return {
        users,
      };
    } catch (err) {
      return {
        httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to fetch users",
        error: err.message,
      };
    }
  }

}

export default UserService;
