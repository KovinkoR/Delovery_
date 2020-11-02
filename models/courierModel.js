import mongoose from "mongoose";
import { offerScheme } from "./offerModel.js";

const courierScheme = mongoose.Schema({
  userName: String,
  phone: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  ordersArchive: [offerScheme],
  currentOrder: offerScheme,
});

export default mongoose.model("couriers", courierScheme);
