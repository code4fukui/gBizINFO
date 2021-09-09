
import { GBizINFO } from "./GBizINFO.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const gbiz = new GBizINFO();

const data = await gbiz.getBasicByKind(201); // 201:地方公共団体 at kind.csv
data.forEach(d => d.cityID = d.cityID.substring(d.cityID.length - 5));
data.sort((a, b) => a.cityID.localeCompare(b.cityID) * 1000 + a.location.localeCompare(b.location));

console.log(JSON.stringify(data, null, 2), data?.length);
await Deno.writeTextFile("localgovs.csv", CSV.stringify(data));
