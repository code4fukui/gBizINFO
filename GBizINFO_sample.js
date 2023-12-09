import { GBizINFO } from "./GBizINFO.js";

const cidjig = "3011101042092";
const cidnintendo = "1130001011420";
const cidnihonkeiei = "9120901025281";
//const cid = cidnintendo;
//const cid = "2010001173536"; // 
const cid = "2010401081974"; // プライム・ストラテジー株式会社

const gbiz = new GBizINFO();
//const res = await gbiz.getDetail(cid);
const res = await gbiz.getBornDate(cid);
//const res = await gbiz.getBasic(cid);
//const res = await gbiz.getAddress(cid);
console.log(res);
