import { GBizINFO } from "./GBizINFO.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const gbiz = new GBizINFO();

const data = await gbiz.getBasicByKind(401); // 外国企業 9593社 2021-09-16
data.forEach((d) => d.cityID = d.cityID ? d.cityID.substring(d.cityID.length - 5) : "");
data.sort(gbiz.filterByCorporateID);
console.log(JSON.stringify(data, null, 2), data?.length);
await Deno.writeTextFile("data/foreigns.csv", CSV.stringify(data));
