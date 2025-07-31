import mongoose from "mongoose";
import BaseSchema from "#models/base";
import { saveFile } from "#utils/uploadFile";

const { Schema } = mongoose;

const userSchema = new BaseSchema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  role: { type: String, enum: ['admin', 'manager', 'viewer'], default: 'viewer' },
  streetAddress: { type: String },
  city: { type: String },
  landMark: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  isActive: {
    type: String,
    default: true,
  },
  password: {
    type: String,
    required: true,
  },

  // Company & Employee Information
  companyName: { type: String },
  department: { type: String },
  employeeId: { type: String, unique: true, sparse: true },
  designation: { type: String },
  joiningDate: { type: Date },
  manager: { type: Schema.Types.ObjectId, ref: 'User' },
  salary: { type: Number },  // optional

  profilePic: { type: String }, // if you want to save image URL or filename
});

userSchema.pre("save", saveFile);

export default mongoose.model("User", userSchema);
