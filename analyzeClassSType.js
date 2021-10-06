import { CSV } from "https://js.sabae.cc/CSV.js";
import { ArrayUtil } from "https://js.sabae.cc/ArrayUtil.js";

const fn = "./data/18207/company2.csv"; // 鯖江市
//const fn = "./data/27140/company.csv"; // 堺市
const data = CSV.toJSON(await CSV.fetch(fn));

const type = ArrayUtil.toUnique(data.map(d => d.classSType));
console.log(type); // [ "01", "12", "11", "21", "71", "22" ]
for (const t of type) {
  console.log(data.filter(d => d.classSType == t).length);
}
/*
01 1935 // jigこっち
11 30
12 162 // 移転してきた？、B Incは12?
21 183 合併による解散等,清算の結了等
22 1 2210002012689 破産？ https://gazette365.com/2021/08/0549-5/
71 11 ?? 7210001013023
*/

// 21, 81, 99
//console.log(data.filter(d => d.classSType == "11"));
//console.log(data.filter(d => d.corporateName.startsWith("株式会社Ｂ")));
// 法人番号システム	2021年10月04日	2021年05月18日
