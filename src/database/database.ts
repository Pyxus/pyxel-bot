import mongoose from "mongoose";
import { color } from "../utils/functions";

mongoose.set('strictQuery', false);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(color("text", "🍃 MongoDB connection has been " + color("variable", "established.")));
  } catch (error) {
    console.log(color("text", "🍃 MongoDB connection has " + color("error", "failed.")));
  }
};

export default connectToDatabase;