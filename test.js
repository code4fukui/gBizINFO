const sparql = async (query) => {
  const baseurl = "https://api.info.gbiz.go.jp/sparql";
  const url = `${baseurl}?query=${encodeURIComponent(query)}`;
  const json = await (await fetch(url)).json();
  return json;
};

const sparqlTypes = async () => {
  const query = "select distinct ?o { ?s a ?o. } order by ?o";
  return await sparql(query);
};
const sparqlItems10 = async (uri) => {
  //const query = `select ?s { ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${uri}>. } order by rand() limit 10`;
  //const query = `select ?s { ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${uri}>. } limit 10`;
  const query = `select ?p ?o { ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${uri}>. ?s ?p ?o } limit 10`;
  return await sparql(query);
};
const sparqlItem = async (uri) => {
  const query = `select * { <${uri}> ?p ?o. }`;
  return await sparql(query);
};
const sparqlProperties = async () => {
  const query = `select distinct ?p { ?s ?p ?o. } order by ?p`;
  return await sparql(query);
};

const values = (json) => {
  const name = json.head.vars[0];
  return json.results.bindings.map(d => d[name].value);
};

//const data = values(await sparqlTypes());
//const data = values(await sparqlProperties());
//const data = await sparqlItems10("http://hojin-info.go.jp/ns/domain/biz/1#法人基本情報型");
//const data = await sparql("select * { ?p <http://hojin-info.go.jp/ns/domain/biz/1#法人基本情報型> ?o } limit 10"); // なし
//const data = values(await sparql("select ?o { ?s a <http://hojin-info.go.jp/ns/domain/biz/1#法人基本情報型>; <http://imi.go.jp/ns/core/rdf#ID>/<http://imi.go.jp/ns/core/rdf#識別値> ?o } limit 10")); // 法人番号を10コ
//const data = values(await sparql("select distinct ?o { ?s <http://imi.go.jp/ns/core/rdf#市区町村> '堺市'; <http://imi.go.jp/ns/core/rdf#市区町村コード>/<http://imi.go.jp/ns/core/rdf#識別値> ?o }")); // 堺市の市区町村コード 27140
const data = await sparql("select (count(?s) as ?c) { ?s <http://imi.go.jp/ns/core/rdf#住所>/<http://imi.go.jp/ns/core/rdf#市区町村コード>/<http://imi.go.jp/ns/core/rdf#識別値> '27140' }"); // 堺市の市区町村コード 27140 // 14?
//const data = await sparql("select ?s { ?s <http://imi.go.jp/ns/core/rdf#住所>/<http://imi.go.jp/ns/core/rdf#市区町村コード>/<http://imi.go.jp/ns/core/rdf#識別値> '27140' }");
//const data = await sparqlItem("http://hojin-info.go.jp/data/basic/7120105001131");

console.log(JSON.stringify(data, null, 2));


/*
[
  // link切れ
  "http://hojin-info.go.jp/ns/domain/biz/1#住所型",
  "http://hojin-info.go.jp/ns/domain/biz/1#届出認定型",
  "http://hojin-info.go.jp/ns/domain/biz/1#数量コレクション型",
  "http://hojin-info.go.jp/ns/domain/biz/1#数量型",
  "http://hojin-info.go.jp/ns/domain/biz/1#株主情報型",
  "http://hojin-info.go.jp/ns/domain/biz/1#法人基本情報型", // 法人基本情報
  "http://hojin-info.go.jp/ns/domain/biz/1#法人情報型",
  "http://hojin-info.go.jp/ns/domain/biz/1#特許型",
  "http://hojin-info.go.jp/ns/domain/biz/1#職場情報型",
  "http://hojin-info.go.jp/ns/domain/biz/1#表彰型",
  "http://hojin-info.go.jp/ns/domain/biz/1#表記型",
  "http://hojin-info.go.jp/ns/domain/biz/1#補助金型",
  "http://hojin-info.go.jp/ns/domain/biz/1#調達型",
  "http://hojin-info.go.jp/ns/domain/biz/1#財務型",

  // imi、型の情報はなし
  "http://imi.go.jp/ns/core/rdf#ID体系型",
  "http://imi.go.jp/ns/core/rdf#ID型",
  "http://imi.go.jp/ns/core/rdf#コードリスト型",
  "http://imi.go.jp/ns/core/rdf#コード型",
  "http://imi.go.jp/ns/core/rdf#人型",
  "http://imi.go.jp/ns/core/rdf#人数型",
  "http://imi.go.jp/ns/core/rdf#名称型",
  "http://imi.go.jp/ns/core/rdf#場所型",
  "http://imi.go.jp/ns/core/rdf#文書型",
  "http://imi.go.jp/ns/core/rdf#日付型",
  "http://imi.go.jp/ns/core/rdf#日時型",
  "http://imi.go.jp/ns/core/rdf#期間型",
  "http://imi.go.jp/ns/core/rdf#構成員型",
  "http://imi.go.jp/ns/core/rdf#氏名型",
  "http://imi.go.jp/ns/core/rdf#法人型",
  "http://imi.go.jp/ns/core/rdf#状況型",
  "http://imi.go.jp/ns/core/rdf#組織型",
  "http://imi.go.jp/ns/core/rdf#組織関連型",
  "http://imi.go.jp/ns/core/rdf#記述型",
  "http://imi.go.jp/ns/core/rdf#連絡先型",
  "http://imi.go.jp/ns/core/rdf#金額型"
]

// property
[
  "http://hojin-info.go.jp/ns/domain/biz/1#キー情報",
  "http://hojin-info.go.jp/ns/domain/biz/1#システム名",
  "http://hojin-info.go.jp/ns/domain/biz/1#事業内容",
  "http://hojin-info.go.jp/ns/domain/biz/1#交付決定日",
  "http://hojin-info.go.jp/ns/domain/biz/1#備考",
  "http://hojin-info.go.jp/ns/domain/biz/1#公表組織",
  "http://hojin-info.go.jp/ns/domain/biz/1#分類",
  "http://hojin-info.go.jp/ns/domain/biz/1#創業日",
  "http://hojin-info.go.jp/ns/domain/biz/1#区分",
  "http://hojin-info.go.jp/ns/domain/biz/1#営業エリア",
  "http://hojin-info.go.jp/ns/domain/biz/1#回次",
  "http://hojin-info.go.jp/ns/domain/biz/1#対象",
  "http://hojin-info.go.jp/ns/domain/biz/1#市区町村町名番地等",
  "http://hojin-info.go.jp/ns/domain/biz/1#所有比率",
  "http://hojin-info.go.jp/ns/domain/biz/1#指標",
  "http://hojin-info.go.jp/ns/domain/biz/1#採択日",
  "http://hojin-info.go.jp/ns/domain/biz/1#数量",
  "http://hojin-info.go.jp/ns/domain/biz/1#数量コレクション",
  "http://hojin-info.go.jp/ns/domain/biz/1#更新日時",
  "http://hojin-info.go.jp/ns/domain/biz/1#書類情報",
  "http://hojin-info.go.jp/ns/domain/biz/1#株主情報",
  "http://hojin-info.go.jp/ns/domain/biz/1#業種コード",
  "http://hojin-info.go.jp/ns/domain/biz/1#法人基本情報",
  "http://hojin-info.go.jp/ns/domain/biz/1#法人活動情報",
  "http://hojin-info.go.jp/ns/domain/biz/1#活動名称",
  "http://hojin-info.go.jp/ns/domain/biz/1#状況",
  "http://hojin-info.go.jp/ns/domain/biz/1#町名番地等",
  "http://hojin-info.go.jp/ns/domain/biz/1#補助金財源",
  "http://hojin-info.go.jp/ns/domain/biz/1#認定日",
  "http://hojin-info.go.jp/ns/domain/biz/1#認定番号",
  "http://hojin-info.go.jp/ns/domain/biz/1#資格",
  "http://hojin-info.go.jp/ns/domain/biz/1#部門",
  "http://hojin-info.go.jp/ns/domain/biz/1#順位",
  "http://imi.go.jp/ns/core/rdf#FAX番号",
  "http://imi.go.jp/ns/core/rdf#ID",
  "http://imi.go.jp/ns/core/rdf#URI",
  "http://imi.go.jp/ns/core/rdf#Webサイト",
  "http://imi.go.jp/ns/core/rdf#カナ表記",
  "http://imi.go.jp/ns/core/rdf#コード種別",
  "http://imi.go.jp/ns/core/rdf#バージョン",
  "http://imi.go.jp/ns/core/rdf#人数",
  "http://imi.go.jp/ns/core/rdf#代表者",
  "http://imi.go.jp/ns/core/rdf#住所",
  "http://imi.go.jp/ns/core/rdf#体系",
  "http://imi.go.jp/ns/core/rdf#単位表記",
  "http://imi.go.jp/ns/core/rdf#名称",
  "http://imi.go.jp/ns/core/rdf#姓名",
  "http://imi.go.jp/ns/core/rdf#市区町村",
  "http://imi.go.jp/ns/core/rdf#市区町村コード",
  "http://imi.go.jp/ns/core/rdf#年",
  "http://imi.go.jp/ns/core/rdf#役割",
  "http://imi.go.jp/ns/core/rdf#数値",
  "http://imi.go.jp/ns/core/rdf#日付",
  "http://imi.go.jp/ns/core/rdf#期間",
  "http://imi.go.jp/ns/core/rdf#構成員",
  "http://imi.go.jp/ns/core/rdf#標準型日付",
  "http://imi.go.jp/ns/core/rdf#標準型日時",
  "http://imi.go.jp/ns/core/rdf#氏名",
  "http://imi.go.jp/ns/core/rdf#活動状況",
  "http://imi.go.jp/ns/core/rdf#発生日",
  "http://imi.go.jp/ns/core/rdf#発行者",
  "http://imi.go.jp/ns/core/rdf#種別",
  "http://imi.go.jp/ns/core/rdf#種別コード",
  "http://imi.go.jp/ns/core/rdf#終了日時",
  "http://imi.go.jp/ns/core/rdf#組織",
  "http://imi.go.jp/ns/core/rdf#組織種別",
  "http://imi.go.jp/ns/core/rdf#表記",
  "http://imi.go.jp/ns/core/rdf#記述",
  "http://imi.go.jp/ns/core/rdf#設立日",
  "http://imi.go.jp/ns/core/rdf#説明",
  "http://imi.go.jp/ns/core/rdf#識別値",
  "http://imi.go.jp/ns/core/rdf#資本金",
  "http://imi.go.jp/ns/core/rdf#通貨",
  "http://imi.go.jp/ns/core/rdf#通貨コード",
  "http://imi.go.jp/ns/core/rdf#連絡先",
  "http://imi.go.jp/ns/core/rdf#郵便番号",
  "http://imi.go.jp/ns/core/rdf#都道府県",
  "http://imi.go.jp/ns/core/rdf#都道府県コード",
  "http://imi.go.jp/ns/core/rdf#金額",
  "http://imi.go.jp/ns/core/rdf#開始日時",
  "http://imi.go.jp/ns/core/rdf#関連人員",
  "http://imi.go.jp/ns/core/rdf#関連組織",
  "http://imi.go.jp/ns/core/rdf#電話番号",
  "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
]
*/

