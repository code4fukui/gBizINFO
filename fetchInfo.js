import { ZenkakuAlpha } from "https://code4fukui.github.io/mojikiban/ZenkakuAlpha.js";

const api = async (path, req) => {
  const token = Deno.env.get("GBIZ_ACCESS_TOKEN");
  const opt = {
    method: req ? "POST" : "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-hojinInfo-api-token": token,
    },
  };
  if (req) {
    opt.body = JSON.stringify(req);
  }
  const url = "https://info.gbiz.go.jp/hojin/v1/" + path;
  const res = await (await fetch(url, opt)).json();
  return res;
};

export const fetchInfo = async (cid, outpath) => {
  const fn = outpath + cid + ".json";
  try {
    await Deno.readTextFile(fn);
    return false;
  } catch (e) {
  }
  //const data = await api("hojin/" + cid);
  //console.log(data);
  let res = null;
  //const list = ["", "certification", "commendation", "finance", "patent", "procurement", "subsidy", "workplace"];
  const list = ["certification", "commendation", "finance", "patent", "procurement", "subsidy", "workplace"];
  for (const name of list) {
    const data = await api("hojin/" + cid + (name ? "/" + name : ""));
    //console.log(data);
    //await Deno.writeTextFile(cid + "_" + name + ".json", JSON.stringify(data, null, 2));
    if (!res) {
      res = data["hojin-infos"][0];
    } else {
      res[name] = data["hojin-infos"][0][name];
    }
  }
  if (outpath) {
    await Deno.writeTextFile(fn, JSON.stringify(res, null, 2));
    return true;
  }
  return res;
};

export const fetchInfoSummary = async (cid) => {
  const addUnique = (array, s) => {
    if (array.indexOf(s) == -1) {
      array.push(s);
    }
  };
  const limit10 = (array) => {
    const res = [];
    for (let i = 0; i < Math.min(array.length, 10); i++) {
      res.push(array[i]);
    }
    return  ZenkakuAlpha.toHan(res.join("、"));
  }

  const info = await fetchInfo(cid);
  const patent = []; // 特許
  const design = []; // 意匠
  const trademark = []; // 商標
  info.patent.sort((a, b) => b.application_date.localeCompare(a.application_date));
  for (const d of info.patent) {
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
    //console.log(d.application_date, d.title);
  }
  return {
    特許: limit10(patent),
    意匠: limit10(design),
    商標: limit10(trademark),
  };
};
