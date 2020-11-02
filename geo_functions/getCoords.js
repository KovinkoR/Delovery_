import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export default async function (address) {
  const addressArr = address.split(", ");
  try {
    const response = await fetch(
      `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${process.env.API_KEY}&geocode=${addressArr[0]}+${addressArr[1]}+${addressArr[2]}`
    );
    const data = await response.json();
    return data.response.GeoObjectCollection.featureMember[0].GeoObject.Point
      .pos;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

