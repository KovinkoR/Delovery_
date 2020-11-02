import mongoose from "mongoose";
import UserModel from "../models/userModel.js";
import CourierModel from "../models/courierModel.js";
import { OfferModel } from "../models/offerModel.js";
import bcrypt from "bcrypt";

mongoose.pluralize(null);
mongoose.connect("mongodb://localhost:27017/delovery", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on(
  "error",
  console.error.bind(console, "Ошибка соединения с MongoDB")
);

(async function () {
  const courier1 = new CourierModel({
    userName: "Alex",
    phone: "+79161234567",
    email: "alex@example.com",
    password: await bcrypt.hash("password", 10),
  });
  await courier1.save();

  await mongoose.disconnect();
})();
