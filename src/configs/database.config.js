import mongoose from "mongoose";

const connectDb = async (DB_URI) => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to database successfully");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDb;
