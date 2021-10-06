import { CSV } from "https://js.sabae.cc/CSV.js";
import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { Day } from "https://js.sabae.cc/DateTime.js";
//import { Browser } from "./Browser.js";

//const browser = await new Browser().init();

// 原則として作成日の16時に公開します
export const scrapeDiff = async () => {
  const url = "https://www.houjin-bangou.nta.go.jp/download/sabun/";
  /*
  const headers = new Headers({
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
  });
  const html = await (await fetch(url, { headers })).text();
  */
  const html = await (await fetch(url)).text();
  await Deno.mkdir("temp", { recursive: true });
  //const html = await browser.fetchText(url, { sleepms: 3000 });
  await Deno.writeTextFile("temp/list.html", html);
  //const html = await Deno.readTextFile("list.html"); // for initial data

  const dom = HTMLParser.parse(html);
  const token = dom.querySelector(
    'input[name="jp.go.nta.houjin_bangou.framework.web.common.CNSFWTokenProcessor.request.token"]',
  )?.attributes.value;
  console.log(token);
  if (!token) {
    console.log(html);
    throw new Error("can't find token");

  }
  const trs = dom.querySelectorAll(".tbl03 tr");
  const list = trs.map((tr) => {
    const a = tr.querySelector("a");
    if (!a) {
      return null;
    }
    return {
      date: new Day(tr.querySelector("th").text.trim()).toString(),
      fileNo: a.attributes.onclick.match(/\((\d+)\)/)[1],
      token,
    };
  }).filter((a) => a);
  console.log(trs.length);
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

if (Deno.mainModule.endsWith("/scrapeDiff.js")) {
  await scrapeDiff();
}
