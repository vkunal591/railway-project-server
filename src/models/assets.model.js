import mongoose from "mongoose";
import BaseSchema from "#models/base";
import { saveFile } from "#utils/uploadFile";

const assetSchema = new BaseSchema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  assetId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: (v) => v.length === 2,
        message: "Coordinates must be an array of [longitude, latitude]",
      },
    },
  },

  remarks: {
    type: String,
    maxlength: 500,
  },

  image: [{
    type: String, 
  }],
});

assetSchema.index({ location: "2dsphere" });

assetSchema.pre("save", saveFile);

export default mongoose.model("Asset", assetSchema);
