import { CSV } from "https://js.sabae.cc/CSV.js";
import { sleep } from "https://js.sabae.cc/sleep.js";
import { fetchInfo } from "./fetchInfo.js";

const fn = "/Users/fukuno/data/js/datacnv/gBizINFO/data/18207/company.csv"; // sabae
const outpath = "/Users/fukuno/data/js/datacnv/gBizINFO/data/18207/info/";
const data = CSV.toJSON(await CSV.fetch(fn));
for (const d of data) {
  const cid = d.corporateID;
  console.log(cid);
  if (await fetchInfo(cid, outpath)) {
    await sleep(100);
  }
}
