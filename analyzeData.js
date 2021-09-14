import { CSV } from "https://js.sabae.cc/CSV.js";
import { ArrayUtil } from "https://js.sabae.cc/ArrayUtil.js";

const fn = "./data/18207/company.csv";
const data = CSV.toJSON(await CSV.fetch(fn));
data.sort((a, b) => a.corporateID.localeCompare(b.corporateID));
//await Deno.writeTextFile(fn, CSV.stringify(data));

const map = ArrayUtil.groupBy(data, "corporateType");
for (const key in map) {
  console.log(key, map[key].length);
}
console.log(map["http://imi.go.jp/ns/code_id/code/kind#399"]); // 神社、寺、教会、宗教法人、労働組合、医療法人、社会福祉法人、協同組合(pre/post)、特定非営利活動法人、一般社団法人、公益社団法人、農事組合法人
//console.log(map["http://imi.go.jp/ns/code_id/code/kind#201"]); // 鯖江市、鯖江広域衛生施設組合、公立丹南病院組合、鯖江・丹生消防組合
//console.log(map["http://imi.go.jp/ns/code_id/code/kind#499"]); // 土地改良区、楽しくする会
  // 土地改良区、農業関係、公共事業的 https://www.inakajin.or.jp/Portals/0/pdf/midorinet/1st_04_3.pdf

const data2 = data.filter(d => {
  const s = d.corporateName;
  const list = [
    "株式会社", "有限会社", "合名会社", "合資会社", "合同会社", "特定非営利活動法人",
    "協同組合", "一般社団法人", "一般財団法人", "税理士法",
    "公益財団法人", "財団法人", "社会福祉法人", "農事組合法人", "医療法人", "公益社団法人",
    "組合",
    "神社", "寺", "教会", "院",
    "土地改良区", "開発公社",
  ];
  for (const l of list) {
    if (s.indexOf(l) >= 0) {
      return false;
    }
  }
  return true;
});
//console.log(data2, data2.length);
await Deno.writeTextFile("_temp_company.csv", CSV.stringify(data2));
