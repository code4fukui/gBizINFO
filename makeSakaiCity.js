import { GBizINFO } from "./GBizINFO.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const gbiz = new GBizINFO();

const data = await gbiz.getCityIDs("大阪府", "堺市");

const res = [];
const basecode = 27140;
for (const d of data) {
  //const code = 18207; // 鯖江市
  const code = d.code;
  const data = await gbiz.getBasicByCityID(code);
  data.sort(gbiz.filterByCorporateID);
  data.forEach(d => res.push(d));
  console.log(d.cityname, data.length);
  //console.log(JSON.stringify(data, null, 2), data?.length);
}
console.log(res.length);
await Deno.mkdir("data/" + basecode, { recursive: true });
await Deno.writeTextFile("data/" + basecode + "/company.csv", CSV.stringify(res));

