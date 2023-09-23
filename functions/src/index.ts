import { onRequest } from "firebase-functions/v2/https";
import fetch from "node-fetch";
let cachedStations: null | [{ id: number, latitude: number, longitude: number, state: { id: number, name: string } }] = null;
/**
 * @return {Promise<{id: number,latitude: number,longitude: number,state: {id: number,name: string}}>} Promise object represents the stations
 */
async function loadStations() {
  if(!cachedStations) {
    cachedStations = await fetch(
      "https://api.publibike.ch/v1/public/stations"
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }
  return cachedStations;
}
export const getStations = onRequest((request, response) => {
  loadStations().then(s => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET");
    response.send(s)
  });
});
