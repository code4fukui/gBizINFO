import { CSV } from "https://js.sabae.cc/CSV.js";
import { fetchBin } from "https://js.sabae.cc/fetchBin.js";
import { unzip } from "https://taisukef.github.io/zlib.js/es/unzip.js";
//import { existFile } from "https://js.sabae.cc/existFile.js";
//import { scrapeDiff } from "./scrapeDiff.js";
import { Day } from "https://js.sabae.cc/DateTime.js";

//await scrapeDiff();


const list = CSV.toJSON(await CSV.fetch("data/diff.csv"));

const res = [];
for (const l of list) {
  const fn = "data/diff_" + new Day(l.date).toStringYMD() + ".csv";
  const data = CSV.toJSON(await CSV.fetch(fn));
  const fnc = "data/diff_" + new Day(l.date).toStringYMD() + "_created.csv";
  const datac = CSV.toJSON(await CSV.fetch(fnc));
  const fnt = "data/diff_" + new Day(l.date).toStringYMD() + "_terminated.csv";
  const datat = CSV.toJSON(await CSV.fetch(fnt));

  const d = { date: l.date, ndiff: data.length, ncreated: datac.length, nterminated: datat.length };
  console.log(d);
  res.push(d);
}
await Deno.writeTextFile("data/diff_summary.csv", CSV.stringify(res));
