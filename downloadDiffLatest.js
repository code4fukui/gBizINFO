import { CSV } from "https://js.sabae.cc/CSV.js";
import { fetchBin } from "https://js.sabae.cc/fetchBin.js";
import { unzip } from "https://taisukef.github.io/zlib.js/es/unzip.js";
//import { existFile } from "https://js.sabae.cc/existFile.js";
//import { scrapeDiff } from "./scrapeDiff.js";
import { makeCreated } from "./makeCreated.js";
import { Day } from "https://js.sabae.cc/DateTime.js";

//await scrapeDiff();

const token = "f83622bb-6551-440a-95b4-1192ff13fb5a"; // いつまで有効?
//const token = "f075ad01-bf30-444f-abbc-4b7cfc11be02";

const list = CSV.toJSON(await CSV.fetch("data/diff.csv"));
const lastid = list[list.length - 1].fileNo;
const nextid = parseInt(lastid) + 3; // 固定?

const url =
  "https://www.houjin-bangou.nta.go.jp/download/sabun/index.html?event=download&selDlFileNo=" +
  nextid +
  "&jp.go.nta.houjin_bangou.framework.web.common.CNSFWTokenProcessor.request.token=" +
  token;
//console.log(url);

const bin = await fetchBin(url);
try {
  const zips = unzip(bin);
  const filenames = zips.getFilenames();
  let date = null;
  for (const fn of filenames.filter((f) => f.endsWith(".csv"))) {
    const data = zips.decompress(fn);
    await Deno.writeFile("data/" + fn, data);
    console.log(fn, "download");
    const ndate = fn.substring(5, 5 + 8);
    console.log(ndate);
    date = new Day(ndate).toString();
    await makeCreated(ndate);
    break;
  }
  list.push({ date, fileNo: nextid, token });
  await Deno.writeTextFile("data/diff.csv", CSV.stringify(list));
} catch (e) {
  if (e.toString().indexOf("End of Central Directory Record not found") == -1) {
    console.log(e);
    throw e;
  }
  console.log("not yet uploaded");
}
