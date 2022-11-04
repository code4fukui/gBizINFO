import { CSV } from "https://js.sabae.cc/CSV.js";
import { fetchBin } from "https://js.sabae.cc/fetchBin.js";
import { unzip } from "https://taisukef.github.io/zlib.js/es/unzip.js";
import { existFile } from "https://js.sabae.cc/existFile.js";
import { makeCreated } from "./makeCreated.js";
//import { scrapeDiff } from "./scrapeDiff.js";
//await scrapeDiff();
import "./scrapeDiff2.js";

const list = CSV.toJSON(await CSV.fetch("data/diff.csv"));
for (const d of list) {
  const date = d.date.replace(/\-/g, "");
  const base = "data/diff_" + date;
  const fn = base + ".csv";
  if (await existFile(fn)) {
    console.log(fn, "exist");
    continue;
  }
  const url =
    "https://www.houjin-bangou.nta.go.jp/download/sabun/index.html?event=download&selDlFileNo=" +
    d.fileNo +
    "&jp.go.nta.houjin_bangou.framework.web.common.CNSFWTokenProcessor.request.token=" +
    d.token;
  //console.log(url);

  const bin = await fetchBin(url);
  const zips = unzip(bin);
  const filenames = zips.getFilenames();
  for (const fn of filenames.filter((f) => f.endsWith(".csv"))) {
    const data = zips.decompress(fn);
    await Deno.writeFile("data/" + fn, data);
    console.log(fn, "download");
    await makeCreated(date);
  }
}
