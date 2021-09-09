
import { GBizINFO } from "./GBizINFO.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const gbiz = new GBizINFO();

const data = await gbiz.getBasicByKind(101); // 101:国の機関 at kind.csv
data.forEach(d => d.cityID = d.cityID.substring(d.cityID.length - 5));
data.sort((a, b) => a.cityID.localeCompare(b.cityID) * 1000 + a.location.localeCompare(b.location));

console.log(JSON.stringify(data, null, 2), data?.length);
await Deno.writeTextFile("jpgovs.csv", CSV.stringify(data));
