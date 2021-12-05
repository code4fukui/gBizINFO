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
  const data = await api("hojin/" + cid);
  console.log(data);
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
  await Deno.writeTextFile(fn, JSON.stringify(res, null, 2));
  return true;
};
