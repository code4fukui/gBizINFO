import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { Day } from "https://js.sabae.cc/DateTime.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const url = "https://www.houjin-bangou.nta.go.jp/download/sabun/index.html";

const html = await (await fetch(url)).text();
//await Deno.writeTextFile("temp/list2.html", html);
//const html = await Deno.readTextFile("temp/list2.html");
const dom = HTMLParser.parse(html);

//const trs = dom.querySelectorAll(".type1_corpHistory1"); // utf8
const trs = dom.querySelectorAll(".type0_corpHistory1"); // utf8
const list = [];
for (const tr of trs) {
  console.log(tr.text);
  const date = new Day(tr.querySelector("th").text.trim()).toString();
  const fileNo = tr.querySelector("td a").getAttribute("onclick").match(/\((\d+)\)/)[1];
  const d = { date, fileNo, token: "" };
  list.push(d);
}
//console.log(list);
/*
<tr class="type1_corpHistory1">                                
<th scope="row">
    令和4年11月2日
</th>
<td>    
        <a href="#" onclick="return doDownload(17586);">zip 164KB</a><br>
</td>
</tr>
*/

// update
const data = CSV.toJSON(await CSV.fetch("data/diff.csv"));
list.forEach((l) => {
  if (!data.find((d) => d.date == l.date)) {
    data.push(l);
  }
});
data.sort((a, b) => a.date.localeCompare(b.date));
await Deno.writeTextFile("data/diff.csv", CSV.stringify(data));
