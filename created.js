import { CSV } from "https://js.sabae.cc/CSV.js";

// https://www.houjin-bangou.nta.go.jp/download/sabun/
//const date = "20210908";
//const date = "20210909";
const date = "20210910";
const csv = await CSV.fetch("data/diff_" + date + ".csv");
console.log(csv.length, csv[0].length);

const houjin = CSV.toJSON(await CSV.fetch("./houjin.csv"));
const head = houjin.map(d => d.name);
csv.unshift(head);

const data = CSV.toJSON(csv);
//console.log(data[0]);

// enum
const enums = houjin.filter(d => d.type == "enum").map(d => {
  return { name: d.name };
});
for (const e of enums) {
  console.log(e);
  e.data = CSV.toJSON(await CSV.fetch(e.name + ".csv"));
}

data.forEach(d => {
  enums.forEach(e => {
    if (d[e.name]) {
      const v = e.data.find(e1 => e1.name == d[e.name]);
      d[e.name] = v.label;
    }
  });
});
//console.log(data[0]);

// filter
const data2 = data.filter(d => d.process == "新規" && d.correct == 0);
await Deno.writeTextFile("data/diff_" + date + "_created.csv", CSV.stringify(data2));

