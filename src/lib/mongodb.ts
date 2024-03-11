import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    if ((global as any).client) return (global as any).client;
    const client = await mongoose.connect(process.env.MONGODB_URI!);
    (global as any).client = client;
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
};
