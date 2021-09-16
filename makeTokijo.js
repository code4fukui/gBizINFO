import { CSV } from "https://js.sabae.cc/CSV.js";

const data = await CSV.fetch("tokijo_.csv");
const res = [];
for (const d of data) {
  for (let i = 0; i < 4; i++) {
    const name = d[i * 2];
    res.push([name.length == 3 ? "0" + name : name, d[i * 2 + 1]]);
  }
}
const data2 = res.filter(d => d[0] != "").sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
data2.unshift(["name", "label"]);
console.log(data2);
await Deno.writeTextFile("tokijo.csv", CSV.encode(data2));
