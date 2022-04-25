import { fetchInfo, fetchInfoSummary } from "./fetchInfo.js";

// 2020年までしか入ってない？

const cidjig = "3011101042092";
const cidsharp = "6120001005484"; // 特許情報 22644件
const cidnintendo = "1130001011420";
const cidkirishima = "8120001003239";
//const cid = cidsharp;
//const cid = cidjig;
const cid = cidnintendo;
//const cid = cidkirishima;

const info = await fetchInfoSummary(cid);
console.log(info);
Deno.exit(0);


//const res = await fetchInfo(cid, "temp/");
const res = JSON.parse(await Deno.readTextFile("temp/" + cid + ".json"));
//console.log(res);

const patent = []; // 特許
const design = []; // 意匠
const trademark = []; // 商標
const addUnique = (array, s) => {
    if (array.indexOf(s) == -1) {
        array.push(s);
    }
};
res.patent.sort((a, b) => b.application_date.localeCompare(a.application_date));

for (const d of res.patent) {
    switch (d.patent_type) {
        case "特許": {
            addUnique(patent, d.title);
            break;
        }
        case "意匠": {
            addUnique(design, d.title);
            break;
        }
        case "商標": {
            addUnique(trademark, d.title);
            break;
        }
        default: {
            throw "unknown patent_type";
        }
    }
    console.log(d.application_date, d.title);
}
//console.log(patent.join(", "), design.join(", "), trademark.join(", "));
