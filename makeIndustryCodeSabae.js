import { dir2array } from "https://js.sabae.cc/dir2array.js";
import { ZenkakuAlpha } from "https://code4fukui.github.io/mojikiban/ZenkakuAlpha.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { IndustryCode } from "https://code4fukui.github.io/IndustryCode/IndustryCode.js";

const saveIndustoryCode = async (path, type_ja) => {
  const type = "industrycode";
  const fns = await dir2array(path);
  const res = [];
  let cnt = 0;
  for (const f of fns) {
    if (!f.endsWith(".json")) {
      continue;
    }
    const d = JSON.parse(await Deno.readTextFile(path + f));
    //console.log(d);
    const company = ZenkakuAlpha.toHan(d.name);
    const set = new Set();
    if (d.business_items) {
      for (const bitem of d.business_items) {
        const ccode = await IndustryCode.encodeTree(bitem);
        if (!ccode) {
          throw new Error("can't encode " + ccode);
        }
        ccode.forEach(c => set.add(c));
        //console.log(code, bitem, ccode);
      }
      cnt++;
    }
    //console.log(set.keys());
    const items = IndustryCode.sortByCode(Array.from(set.keys()));
    const names = [];
    for (const item of items) {
      names.push(await IndustryCode.decode(item));
    }
    res.push({ company, business_codes: items.join(","), business_items: names.join(",") });
  }
  res.sort((a, b) => !a ? -1: (!b ? -1 : (-a.business_codes.localeCompare(b.business_codes))));
  await Deno.writeTextFile(path + "../" + type + ".csv", CSV.stringify(res));
  console.log(cnt, res.length);
};

const path = "data/18207/info/";
await saveIndustoryCode(path);
