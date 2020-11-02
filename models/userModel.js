import mongoose from "mongoose";
import { offerScheme } from "./offerModel.js";

const userScheme = mongoose.Schema({
  userName: String,
  phone: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  location: String,
  coordinates: String,
  ordersArchive: [offerScheme],
  currentOrder: offerScheme,
});

export default mongoose.model("users", userScheme);
