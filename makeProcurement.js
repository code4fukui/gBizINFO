import { CSV } from "https://js.sabae.cc/CSV.js";
import { Day } from "https://js.sabae.cc/DateTime.js";
import { dir2array } from "https://js.sabae.cc/dir2array.js";
import { ArrayUtil } from "https://js.sabae.cc/ArrayUtil.js";

const getProcurement = async (startdate, enddate) => {
  // https://info.gbiz.go.jp/hojin/swagger-ui.html#/gBizINFO_REST_API_(Period-specified_Search)
  const fetchData = async (page) => {
    const url = `https://info.gbiz.go.jp/hojin/v1/hojin/updateInfo/procurement?page=${page}&from=${startdate}&to=${enddate}`;
    console.log(url);
    const apitoken = (await Deno.readTextFile("apitoken.txt")).trim();
    const headers = new Headers({
      "Accept": "application/json",
      "X-hojinInfo-api-token": apitoken,
    });
    const json = await (await fetch(url, { headers })).json();
    return json;
  };
  const res = [];
  for (let page = 1;; page++) {
    const json = await fetchData(page);
    console.log(json);
    if (!json["totalPage"]) {
      return null;
    }
    //const totalCount = json.totalCount;
    const totalPage = json.totalPage;
    for (const d of json["hojin-infos"]) {
      const cid = d.corporate_number;
      for (const p of d.procurement) {
        p.corporate_number = cid;
        res.push(p);
      }
    }
    console.log(page, "/", totalPage);
    if (page == totalPage) {
      break;
    }
  }
  return res;
};

const downloadProcurement = async (start) => {
  const nextmonth = new Day().nextMonth().getFirstDayOfMonth();
  for (let day = start; day.isBefore(nextmonth); day = day.nextMonth()) {
    const end = day.getLastDayOfMonth();
    console.log(day.toStringYMD(), end.toStringYMD());
    const data = await getProcurement(day.toStringYMD(), end.toStringYMD());
    if (data) {
      const fn = day.toStringYMD().substring(0, 6);
      await Deno.writeTextFile("data/procurement/" + fn + ".csv", CSV.stringify(data));
    }
  }
};
const downloadProcurementPast = async () => {
  //const start = new Day(2020, 3, 1);
  const start = new Day(2020, 4, 1);
  //const start = new Day(2021, 5, 1);
  return await downloadProcurement(start);
};

const downloadProcurementThisMonth = async () => {
  const start = new Day().getFirstDayOfMonth();
  return await downloadProcurement(start);
};


const makeByAmount = async (name, f) => {
  const path = "data/procurement/";
  const list = await dir2array(path);
  const res = [];
  for (const l of list) {
    if (!l.endsWith(".csv") || l.indexOf("/") >= 0) {
      continue;
    }
    const fn = path + l;
    console.log(l);
    const data = CSV.toJSON(await CSV.fetch(fn));
    const data2 = data.filter(d => f(d.amount));
    data2.forEach(d => res.push(d));
  }
  console.log(res.length);
  const res2 = ArrayUtil.toUniqueByString(res);
  //const res2 = res;
  console.log(res2.length);
  res2.sort((a, b) => parseInt(b.amount) - parseInt(a.amount));
  await Deno.writeTextFile(path + "yen/" + name + ".csv", CSV.stringify(res2));
};

//await downloadProcurementPast();
await downloadProcurementThisMonth();

//await makeByAmount(10);
//await makeByAmount(11);
//await makeByAmount(1);
//await makeByAmount(100, (yen) => yen <= 100);
//await makeByAmount(1, (yen) => yen == 1);
await makeByAmount("0", (yen) => yen == 0);
await makeByAmount("over1G", (yen) => yen >= 1000 * 1000 * 1000);




/*
const data = await getProcurement("20200301", "20200331");
//console.log(data);
//await Deno.writeTextFile("procurement.json", JSON.stringify(data, null, 2));
await Deno.writeTextFile("data/procurement/202003.csv", CSV.stringify(data));
*/
