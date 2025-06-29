import mongoose from "mongoose";
import BaseSchema from "#models/base";

const tagSchema = new BaseSchema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  color: {
    type: String, // Optional: used for UI tag styling
  },
});

export default mongoose.model("Tag", tagSchema);
