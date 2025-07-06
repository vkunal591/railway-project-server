import mongoose from "mongoose";
import BaseSchema from "#models/base";
import { saveFile } from "#utils/uploadFile";

const projectSchema = new BaseSchema({
  title: { type: String, required: true },
  description: { type: String },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  
  address: { type: String },
  country: { type: String },
  city: { type: String },

  status: {
    type: String,
    enum: [
      'not_started',
      'in_progress',
      'on_hold',
      'completed',
      'cancelled'
    ],
    default: 'not_started',
  },

  budget: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },

  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  images: [{ type: String }],
});

// Add 2dsphere index for geospatial queries
projectSchema.index({ location: '2dsphere' });

// Save uploaded files if needed
projectSchema.pre("save", saveFile);

export default mongoose.model("Project", projectSchema);
