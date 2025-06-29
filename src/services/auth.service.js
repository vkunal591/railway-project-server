import User from "#models/user";
import Service from "#services/base";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { session } from "#middlewares/session";
import httpStatus from "#utils/httpStatus";

class UserService extends Service {
  static Model = User;

  static async register(data) {
    const { name, email, password, role, profilePic, mobileNo } = data;
    let user = await this.Model.findOne({ mobileNo });
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
      mobileNo,
    });
    await user.save();

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
    const { mobileNo, email, password } = data;
    const user = await this.Model.findOne({
      $or: [
        { mobileNo },
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
    // session.set("user", user);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobileNo: user.mobileNo
      },
    };
  }
}

export default UserService;
