import mongoose from "mongoose";
import BaseSchema from "#models/base";
import { saveFile } from "#utils/uploadFile";

const { Schema } = mongoose;

const geoPointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point',
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
}, { _id: false }); // Prevents creation of subdocument _id fields

const projectSchema = new BaseSchema({
  title: { type: String, required: true },
  description: { type: String },

  // Separate geospatial fields
  startLocation: { type: geoPointSchema, required: true },
  endLocation: { type: geoPointSchema, required: true },

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

  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  manager: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  team: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  assets: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
  images: [{ type: String, file: true }]  ,
});

// Add geospatial indexes
projectSchema.index({ startLocation: "2dsphere" });
projectSchema.index({ endLocation: "2dsphere" });

// Pre-save hook for file handling
projectSchema.pre("save", saveFile);

export default mongoose.model("Project", projectSchema);
