import { CSV } from "https://js.sabae.cc/CSV.js";
import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { Day } from "https://js.sabae.cc/DateTime.js";

export const scrapeDiff = async () => {
  const url = "https://www.houjin-bangou.nta.go.jp/download/sabun/";
  const html = await (await fetch(url)).text();
  const dom = HTMLParser.parse(html);
  const token =
    dom.querySelector(
      'input[name="jp.go.nta.houjin_bangou.framework.web.common.CNSFWTokenProcessor.request.token"]',
    ).attributes.value;
  const trs = dom.querySelectorAll(".tbl03 tr.type1_corpHistory1");
  const list = trs.map((tr) => {
    return {
      date: new Day(tr.querySelector("th").text.trim()).toString(),
      fileNo: tr.querySelector("a").attributes.onclick.match(/\((\d+)\)/)[1],
      token,
    };
  });
  // update
  const data = CSV.toJSON(await CSV.fetch("data/diff.csv"));
  list.forEach((l) => {
    if (!data.find((d) => d.date == l.date)) {
      data.push(l);
    }
  });
  data.sort((a, b) => a.date.localeCompare(b.date));
  await Deno.writeTextFile("data/diff.csv", CSV.stringify(data));
};

console.log(Deno.mainModule);
if (Deno.mainModule.endsWith("/scrapeDiff.js")) {
  await scrapeDiff();
}
