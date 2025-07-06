import mongoose from "mongoose";
import BaseSchema from "#models/base";
import { saveFile } from "#utils/uploadFile";

const assetSchema = new BaseSchema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  assetId: {
    type: String,
    required: true,
    unique: true,
  },
  remarks: {
    type: String,
  },
  image: [{
    type: String, // Typically store image URL or path
  }],
});

assetSchema.pre("save", saveFile);


export default mongoose.model("Asset", assetSchema);
