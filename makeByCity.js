import { GBizINFO } from "./GBizINFO.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const gbiz = new GBizINFO();

const code = 18207; // 鯖江市
//const code = 27140; // 堺市
const data = await gbiz.getBasicByCityID(code);
data.sort(gbiz.filterByCorporateID);
console.log(JSON.stringify(data, null, 2), data?.length);
await Deno.mkdir("data/" + code, { recursive: true });
await Deno.writeTextFile("data/" + code + "/company.csv", CSV.stringify(data));
