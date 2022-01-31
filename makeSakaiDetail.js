import { GBizINFO } from "./GBizINFO.js";
//import { CSV } from "https://js.sabae.cc/CSV.js";

const gbiz = new GBizINFO();

const cid = "6120001005484"; // sharp
// const cid = "3011101077122"; // B Inc.
const data = await gbiz.getDetail(cid);
console.log(data);

/*
// 基本
PREFIX  hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
PREFIX  ic: <http://imi.go.jp/ns/core/rdf#>
SELECT DISTINCT ?corporateID ?corporateName ?corporateKana ?location ?moddate ?systemName ?classSInfo 
 FROM <http://hojin-info.go.jp/graph/hojin> { 
     ?s hj:法人基本情報 ?key. 
     ?key ic:ID/ic:識別値 '6120001005484'. 
     OPTIONAL{?key ic:ID/ic:識別値 ?corporateID .} 
     OPTIONAL{?key ic:名称 _:keyCorporateName . 
     _:keyCorporateName ic:種別 '商号又は名称'. 
     _:keyCorporateName ic:表記 ?corporateName .} 
     OPTIONAL{?key ic:名称 _:keyCorporateNameKana . 
     _:keyCorporateNameKana ic:種別 '商号又は名称'. 
     _:keyCorporateNameKana ic:カナ表記 ?corporateKana .} 
     OPTIONAL{?key ic:住所 _:keyAddress . 
     _:keyAddress ic:種別 '住所' . 
     _:keyAddress ic:表記 ?location .} 
     OPTIONAL{?key hj:更新日時/ic:標準型日時 ?moddate .} 
     OPTIONAL{?key hj:システム名/ic:表記 ?systemName .} 
     OPTIONAL{?key hj:区分 _:keyStatus. 
              _:keyStatus ic:種別 '処理区分'. 
              _:keyStatus ic:表記 ?classSInfo .} 
 } GROUP BY ?corporateID ?corporateName ?corporateKana ?location ?moddate ?systemName ?classSInfo 

// 詳しい情報をとりたい
https://info.gbiz.go.jp/hojin/ichiran?hojinBango=6120001005484

*/


/*
const data = await gbiz.getCityIDs("大阪府", "堺市");

const res = [];
const basecode = 27140;
for (const d of data) {
  //const code = 18207; // 鯖江市
  const code = d.code;
  const data = await gbiz.getBasicByCityID(code);
  data.sort(gbiz.filterByCorporateID);
  data.forEach(d => res.push(d));
  console.log(d.cityname, data.length);
  //console.log(JSON.stringify(data, null, 2), data?.length);
}
console.log(res.length);
await Deno.mkdir("data/" + basecode, { recursive: true });
await Deno.writeTextFile("data/" + basecode + "/company.csv", CSV.stringify(res));
*/