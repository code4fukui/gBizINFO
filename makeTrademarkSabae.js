import { dir2array } from "https://js.sabae.cc/dir2array.js";
import { ZenkakuAlpha } from "https://code4fukui.github.io/mojikiban/ZenkakuAlpha.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const path = "data/18207/info/";
const fns = await dir2array(path);
const trademarks = [];
for (const f of fns) {
  if (!f.endsWith(".json")) {
    continue;
  }
  const d = JSON.parse(await Deno.readTextFile(path + f));
  const set = {};
  for (const p of d.patent) {
    if (p.patent_type == "商標") {
      const title = ZenkakuAlpha.toHan(p.title);
      const company = ZenkakuAlpha.toHan(d.name);
      set[p.title] = { date: p.application_date, title, company };
    }
  }
  for (const name in set) {
    trademarks.push(set[name]);
  }
}
trademarks.sort((a, b) => -a.date.localeCompare(b.date));
console.log(trademarks, trademarks.length);
await Deno.writeTextFile(path + "../trademark.csv", CSV.stringify(trademarks));
