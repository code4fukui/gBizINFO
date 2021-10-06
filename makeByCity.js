import { GBizINFO } from "./GBizINFO.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const gbiz = new GBizINFO();

const code = 18207; // 鯖江市
//const code = 27140; // 堺市 区別に別れているので -> use makeSakaiCity.js
// 2139法人
const data0 = await gbiz.getBasicByCityID(code);
const data = data0.filter(gbiz.filterByActive);
data.sort(gbiz.filterByCorporateID);
console.log(JSON.stringify(data, null, 2), data?.length);
await Deno.mkdir("data/" + code, { recursive: true });
await Deno.writeTextFile("data/" + code + "/company2.csv", CSV.stringify(data));
