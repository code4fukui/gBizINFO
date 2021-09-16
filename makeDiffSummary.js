import { CSV } from "https://js.sabae.cc/CSV.js";
import { Day } from "https://js.sabae.cc/DateTime.js";
import { GBizINFO } from "./GBizINFO.js";

const makeDiffSummary = async () => {
  const gbiz = new GBizINFO();

  //await scrapeDiff();
  
  
  const list = CSV.toJSON(await CSV.fetch("data/diff.csv"));
  
  const chk = {};
  
  const res = [];
  for (const l of list) {
    const fnc = "data/diff_" + new Day(l.date).toStringYMD() + "_created.csv";
    const datac = CSV.toJSON(await CSV.fetch(fnc));
    const fnt = "data/diff_" + new Day(l.date).toStringYMD() + "_terminated.csv";
    const datatx = await CSV.fetch(fnt);
    const datat = CSV.toJSON(datatx);
    const fn = "data/diff_" + new Day(l.date).toStringYMD() + ".csv";
    const datax = await CSV.fetch(fn);
    datax.unshift(datatx[0]);
    const data = CSV.toJSON(datax);
    
    const d = { date: l.date, ndiff: data.length, ncreated: datac.length, nterminated: datat.length };
    console.log(d);
    res.push(d);
    
    for (const dd of data) {
      const corporateID = dd[6];
      const type = await gbiz.parseCorporateID(dd.corporateNumber);
      //console.log(type)
      if (!chk[type.tokitype]) {
        chk[type.tokitype] = dd;
      }
    }
  }
  console.log(Object.keys(chk));
  await Deno.writeTextFile("data/diff_summary.csv", CSV.stringify(res));
};

if (Deno.mainModule.endsWith("/makeDiffSummary.js")) {
  await makeDiffSummary();
}

export { makeDiffSummary };

