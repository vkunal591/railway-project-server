import mongoose from "mongoose";
import BaseSchema from "#models/base";
import { saveFile } from "#utils/uploadFile";

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
});

userSchema.pre("save", saveFile);

export default mongoose.model("User", userSchema);
