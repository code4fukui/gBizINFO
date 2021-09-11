import { CSV } from "https://js.sabae.cc/CSV.js";

// https://www.houjin-bangou.nta.go.jp/download/sabun/

export const makeCreated = async (date) => {
  const csv = await CSV.fetch("data/diff_" + date + ".csv");
  console.log(csv.length, csv[0].length);

  const houjin = CSV.toJSON(await CSV.fetch("./houjin.csv"));
  const head = houjin.map((d) => d.name);
  csv.unshift(head);

  const data = CSV.toJSON(csv);
  //console.log(data[0]);

  // enum
  const enums = houjin.filter((d) => d.type == "enum").map((d) => {
    return { name: d.name };
  });
  for (const e of enums) {
    console.log(e);
    e.data = CSV.toJSON(await CSV.fetch(e.name + ".csv"));
  }

  data.forEach((d) => {
    enums.forEach((e) => {
      if (d[e.name]) {
        const v = e.data.find((e1) => e1.name == d[e.name]);
        d[e.name] = v.label;
      }
    });
  });
  //console.log(data[0]);

  /* // process.csv
  name,label
  01,新規
  11,商号又は名称の変更
  12,国内所在地の変更
  13,国外所在地の変更
  21,登記記録の閉鎖等
  22,登記記録の復活等
  71,吸収合併 // 存続会社が記載されている
  72,吸収合併無効
  81,商号の登記の抹消
  99,削除
  */
  // filter
  const data2 = data.filter((d) => d.process == "新規" && d.correct == 0);
  await Deno.writeTextFile(
    "data/diff_" + date + "_created.csv",
    CSV.stringify(data2),
  );
  const data3 = data.filter((d) =>
    (d.process == "登記記録の閉鎖等" || d.process == "商号の登記の抹消" || d.process == "削除") &&
    d.correct == 0
  );
  await Deno.writeTextFile(
    "data/diff_" + date + "_terminated.csv",
    CSV.stringify(data3),
  );
};

if (Deno.mainModule.endsWith("/makeCreated.js")) {
  //const date = "20210908";
  //const date = "20210909";
  const date = "20210910";
  await makeCreated(date);
  for (let i = 6; i < 10; i++) {
    const date = "2021090" + i;
    await makeCreated(date);
  }
}
