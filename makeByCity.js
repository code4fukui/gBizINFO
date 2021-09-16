import { GBizINFO } from "./GBizINFO.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const gbiz = new GBizINFO();

const data = await gbiz.getBasicByCityID(18207); // 18207 = 鯖江市
data.sort(gbiz.filterByCorporateID);
console.log(JSON.stringify(data, null, 2), data?.length);
await Deno.writeTextFile("data/18207/company.csv", CSV.stringify(data));
