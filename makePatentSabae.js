import { dir2array } from "https://js.sabae.cc/dir2array.js";
import { ZenkakuAlpha } from "https://code4fukui.github.io/mojikiban/ZenkakuAlpha.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const savePatent = async (path, type_ja, type) => {
  const fns = await dir2array(path);
  const res = [];
  for (const f of fns) {
    if (!f.endsWith(".json")) {
      continue;
    }
    const d = JSON.parse(await Deno.readTextFile(path + f));
    const set = {};
    for (const p of d.patent) {
      if (p.patent_type == type_ja) {
        const title = ZenkakuAlpha.toHan(p.title);
        const company = ZenkakuAlpha.toHan(d.name);
        set[p.title] = { date: p.application_date, title, company };
      }
    }
    for (const name in set) {
      res.push(set[name]);
    }
  }
  res.sort((a, b) => -a.date.localeCompare(b.date));
  await Deno.writeTextFile(path + "../" + type + ".csv", CSV.stringify(res));
};

const path = "data/18207/info/";
await savePatent(path, "商標", "trademark");
await savePatent(path, "特許", "patent");
