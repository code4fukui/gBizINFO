import { CSV } from "https://js.sabae.cc/CSV.js";

const fn = "./data/18207/company.csv";
const data = CSV.toJSON(await CSV.fetch(fn));
//data.sort((a, b) => a.corporateID.localeCompare(b.corporateID));
//await Deno.writeTextFile(fn, CSV.stringify(data));

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
console.log(data2, data2.length);
await Deno.writeTextFile("_temp_company.csv", CSV.stringify(data2));
