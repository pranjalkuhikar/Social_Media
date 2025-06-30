import mongoose from "mongoose";
import config from "../config/config.js";

const connectDB = () => {
  mongoose
    .connect(config.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.log(error));
};

export default connectDB;
