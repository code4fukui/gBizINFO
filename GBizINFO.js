import { SPARQL } from "./SPARQL.js";
import { isValid } from "./CheckDigit.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const baseurl = "https://api.info.gbiz.go.jp/sparql";
class GBizINFO extends SPARQL {
  constructor() {
    super(baseurl);
  }
  async getCityID(prefname, cityname) {
    return (await this.sparqlItem(`select distinct ?o {
      ?s
        <http://imi.go.jp/ns/core/rdf#都道府県> '${prefname}';
        <http://imi.go.jp/ns/core/rdf#市区町村> '${cityname}';
        <http://imi.go.jp/ns/core/rdf#市区町村コード>/<http://imi.go.jp/ns/core/rdf#識別値> ?o.
      } limit 1`))?.o.value;
  }
  async getCityIDs(prefname, cityname) {
    if (cityname) {
      return this.cutType(await this.sparqlItems(`select distinct ?cityname ?code {
        ?s
          <http://imi.go.jp/ns/core/rdf#都道府県> '${prefname}';
          <http://imi.go.jp/ns/core/rdf#市区町村> ?cityname;
          <http://imi.go.jp/ns/core/rdf#市区町村コード>/<http://imi.go.jp/ns/core/rdf#識別値> ?code.
          FILTER(contains(?cityname, '${cityname}'))
        }`));
    } else {
      return this.cutType(await this.sparqlItems(`select distinct ?cityname ?code {
        ?s
          <http://imi.go.jp/ns/core/rdf#都道府県> '${prefname}';
          <http://imi.go.jp/ns/core/rdf#市区町村> ?cityname;
          <http://imi.go.jp/ns/core/rdf#市区町村コード>/<http://imi.go.jp/ns/core/rdf#識別値> ?code.
        }`));
    }
  }
  async getBasic(corporateID) {
    return this.cutType(
      await this.sparqlItem(`
      PREFIX  hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
      PREFIX  ic: <http://imi.go.jp/ns/core/rdf#>
      SELECT DISTINCT ?corporateID ?corporateName ?corporateKana ?location ?moddate ?systemName ?classSInfo ?classHInfo ?cityID
      FROM <http://hojin-info.go.jp/graph/hojin> { 
          ?s hj:法人基本情報 ?key. 
          ?key ic:ID/ic:識別値 '${corporateID}'. 
          OPTIONAL{?key ic:ID/ic:識別値 ?corporateID .} 
          OPTIONAL{?key ic:名称 _:keyCorporateName . 
          _:keyCorporateName ic:種別 '商号又は名称'. 
          _:keyCorporateName ic:表記 ?corporateName .} 
          OPTIONAL{?key ic:名称 _:keyCorporateNameKana . 
          _:keyCorporateNameKana ic:種別 '商号又は名称'. 
          _:keyCorporateNameKana ic:カナ表記 ?corporateKana .} 
          OPTIONAL{
            ?key ic:住所 _:keyAddress . 
            _:keyAddress ic:種別 '住所'.
            _:keyAddress ic:表記 ?location.
            _:keyAddress ic:市区町村コード ?cityID.
          }
          OPTIONAL{?key hj:更新日時/ic:標準型日時 ?moddate .} 
          OPTIONAL{?key hj:システム名/ic:表記 ?systemName .} 
          ?key ic:組織種別 ?classHInfo.
          OPTIONAL{
            ?key hj:区分 _:keyStatus. 
            _:keyStatus ic:種別 '処理区分'. 
            _:keyStatus ic:表記 ?classSInfo.
          } 
      } GROUP BY ?corporateID ?corporateName ?corporateKana ?location ?moddate ?systemName ?classSInfo ?classHInfo ?cityID
    `),
    );
  }
  async getAddress(corporateID) {
    return this.cutType(
      await this.sparqlItem(`
      PREFIX  hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
      PREFIX  ic: <http://imi.go.jp/ns/core/rdf#>
      SELECT ?location
      FROM <http://hojin-info.go.jp/graph/hojin> { 
          ?s hj:法人基本情報 ?key.
          ?key ic:ID/ic:識別値 '${corporateID}'. 
          ?key ic:住所 _:keyAddress. 
          _:keyAddress ic:種別 '住所'.
          _:keyAddress ic:表記 ?location.
      }
    `),
    );
  }
  async getBasicByKind(kindID) {
    return this.cutType(
      await this.sparqlItems(`
      PREFIX  hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
      PREFIX  ic: <http://imi.go.jp/ns/core/rdf#>
      SELECT DISTINCT ?corporateID ?corporateName ?corporateKana ?cityID ?location ?moddate
      FROM <http://hojin-info.go.jp/graph/hojin> { 
          ?s hj:法人基本情報 ?key. 
          ?key ic:組織種別 <http://imi.go.jp/ns/code_id/code/kind#${kindID}>.
          OPTIONAL{?key ic:ID/ic:識別値 ?corporateID .} 
          OPTIONAL{?key ic:名称 _:keyCorporateName . 
            _:keyCorporateName ic:種別 '商号又は名称'. 
            _:keyCorporateName ic:表記 ?corporateName.
          } 
          OPTIONAL{
            ?key ic:名称 _:keyCorporateNameKana .
            _:keyCorporateNameKana ic:種別 '商号又は名称'. 
            _:keyCorporateNameKana ic:カナ表記 ?corporateKana .
          } 
          OPTIONAL{
            ?key ic:住所 _:keyAddress . 
            _:keyAddress ic:種別 '住所'.
            _:keyAddress ic:表記 ?location.
            _:keyAddress ic:市区町村コード ?cityID.
          }
          OPTIONAL{
            ?key hj:更新日時/ic:標準型日時 ?moddate.
          } 
      } GROUP BY ?corporateID ?corporateName ?corporateKana ?cityID ?location ?moddate
    `),
    );
  }
  async getBasicByLocation(location) {
    return this.cutType(
      await this.sparqlItems(`
      PREFIX  hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
      PREFIX  ic: <http://imi.go.jp/ns/core/rdf#>
      SELECT DISTINCT ?corporateID ?corporateName ?corporateKana ?location ?moddate ?classSInfo 
      FROM <http://hojin-info.go.jp/graph/hojin> { 
          ?s hj:法人基本情報 ?key. 
          OPTIONAL{ ?key ic:ID/ic:識別値 ?corporateID .} 
          OPTIONAL{ ?key ic:名称 _:keyCorporateName. 
          _:keyCorporateName ic:種別 '商号又は名称'. 
          _:keyCorporateName ic:表記 ?corporateName .} 
          OPTIONAL{
            ?key ic:名称 _:keyCorporateNameKana.
            _:keyCorporateNameKana ic:種別 '商号又は名称'.
            _:keyCorporateNameKana ic:カナ表記 ?corporateKana.
          } 
          ?key ic:住所/ic:表記 '${location}'. 
          OPTIONAL{
            ?key ic:住所 _:keyAddress.
            _:keyAddress ic:種別 '住所'.
            _:keyAddress ic:表記 ?location.
          } 
          OPTIONAL{ ?key hj:更新日時/ic:標準型日時 ?moddate .} 
          OPTIONAL{
            ?key hj:区分 _:keyStatus. 
            _:keyStatus ic:種別 '処理区分'. 
            _:keyStatus ic:表記 ?classSInfo .
          } 
      } GROUP BY ?corporateID ?corporateName ?corporateKana ?location ?moddate ?classSInfo 
    `),
    );
  }
  async getBasicByCityID(cityID) {
    return this.cutType(await this.sparqlItems(`
      PREFIX hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
      PREFIX ic: <http://imi.go.jp/ns/core/rdf#>
      SELECT DISTINCT ?corporateID ?corporateType ?corporateName ?corporateKana ?location ?borndate ?moddate 
      FROM <http://hojin-info.go.jp/graph/hojin> { 
        ?s hj:法人基本情報 ?key.
        OPTIONAL { ?key ic:ID/ic:識別値 ?corporateID .} 
        OPTIONAL {
          ?key ic:名称 _:keyCorporateName. 
            _:keyCorporateName ic:種別 '商号又は名称'. 
            _:keyCorporateName ic:表記 ?corporateName.
        } 
        OPTIONAL {
          ?key ic:名称 _:keyCorporateNameKana . 
            _:keyCorporateNameKana ic:種別 '商号又は名称'. 
            _:keyCorporateNameKana ic:カナ表記 ?corporateKana.
        } 
        ?key ic:住所/ic:市区町村コード <http://imi.go.jp/ns/code_id/code/jisx0402#${cityID}>.
        OPTIONAL {
          ?key ic:住所 _:keyAddress . 
            _:keyAddress ic:種別 '住所' . 
            _:keyAddress ic:表記 ?location .
        }
        ?key hj:区分 _:keyStatus. 
          _:keyStatus ic:種別 '処理区分'. 
          _:keyStatus ic:表記 ?classSType.
        OPTIONAL { ?key hj:更新日時/ic:標準型日時 ?moddate. }
        optional { ?key ic:組織種別 ?corporateType. }
        optional { ?key ic:設立日/ic:標準型日付 ?borndate. }
        filter(?classSType != "21" && ?classSType != "81" && ?classSType != "99")
      } GROUP BY ?corporateID ?corporateType ?corporateName ?corporateKana ?location ?borndate ?moddate
    `));
    /*
        OPTIONAL {
        }
      ?classSInfo
      */
  }
  async getBasicByCityID2(cityID) {
    return this.cutType(await this.sparqlItems(`
    PREFIX  hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
    PREFIX  ic: <http://imi.go.jp/ns/core/rdf#>
    PREFIX  neptune-fts: <http://aws.amazon.com/neptune/vocab/v01/services/fts#>
    
    SELECT ?corporateID ?corporateName ?prefecture ?city ?classSType (COUNT(DISTINCT(?countTarget)) AS ?count)
    { 
    { GRAPH <http://hojin-info.go.jp/graph/hojin> {
        ?s hj:法人基本情報 ?key1. 
          ?key1 ic:ID/ic:識別値 ?corporateID. 
          ?key1 ic:名称 _:corporatekeyName1. 
          _:corporatekeyName1 ic:種別 '商号又は名称'. 
          _:corporatekeyName1 ic:表記 ?corporateName. 
          ?key1 ic:住所 _:keyAddress1. 
          _:keyAddress1 ic:都道府県 ?prefecture. 
          _:keyAddress1 ic:市区町村 ?city. 
          ?key1 hj:区分 _:keyName.
          _:keyName ic:種別 '処理区分'.
          _:keyName ic:表記 ?classSType.
          ?key1 ic:住所 _:keyAddress. 
          _:keyAddress ic:市区町村コード <http://imi.go.jp/ns/code_id/code/jisx0402#${cityID}>. 
     }} 
     OPTIONAL{ VALUES ?tableName {<http://hojin-info.go.jp/graph/chotatsu> <http://hojin-info.go.jp/graph/hyosho> <http://hojin-info.go.jp/graph/todokede> <http://hojin-info.go.jp/graph/hojyokin> <http://hojin-info.go.jp/graph/tokkyo> <http://hojin-info.go.jp/graph/zaimu>} 
     GRAPH ?tableName { 
     { ?s hj:法人活動情報 ?countTarget.} 
     } 
     } 
     } GROUP BY ?corporateID ?corporateName ?prefecture ?city ?classSType
        `));
  }
  async getDetail(corporateID) {
    //const graph = "http://hojin-info.go.jp/graph/shokuba"; // 職場情報
    //const graph = "http://hojin-info.go.jp/graph/zaimu"; // 財務情報
    //const graph = "http://hojin-info.go.jp/graph/hyosho";
    //const graph = "http://hojin-info.go.jp/graph/hojyokin";
    const graph = "http://hojin-info.go.jp/graph/todokede"; // 届出認定情報
    //const graph = "http://hojin-info.go.jp/graph/tokkyo";
    //const graph = "http://hojin-info.go.jp/graph/chotatsu";
    return this.cutType(
      // ?industryCode
      await this.sparqlItem(`
        PREFIX hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
        PREFIX ic: <http://imi.go.jp/ns/core/rdf#>
        SELECT ?s ?corporateID ?corporateName ?corporateKana ?industryCode ?registtype ?registname ?tokkyocode ?tokkyoid ?location ?moddate ?systemName ?classSInfo ?classHInfo ?cityID ?borndate
        FROM <${graph}> {
          ?key ic:ID/ic:識別値 '${corporateID}'.
          OPTIONAL{?key ic:名称 _:keyCorporateName . 
            _:keyCorporateName ic:種別 '商号又は名称'. 
            _:keyCorporateName ic:表記 ?corporateName .}
          OPTIONAL{?key ic:名称 _:keyCorporateNameKana. 
            _:keyCorporateNameKana ic:種別 '商号又は名称'. 
            _:keyCorporateNameKana ic:カナ表記 ?corporateKana .}
          OPTIONAL{
            ?key ic:住所 _:keyAddress .
            _:keyAddress ic:種別 '住所'.
            _:keyAddress ic:表記 ?location.
            _:keyAddress ic:市区町村コード ?cityID.
          }
          OPTIONAL{?key hj:更新日時/ic:標準型日時 ?moddate .} 
          OPTIONAL{?key hj:システム名/ic:表記 ?systemName .} 
          OPTIONAL{
            ?key hj:区分 _:keyStatus. 
            _:keyStatus ic:種別 '処理区分'. 
            _:keyStatus ic:表記 ?classSInfo.
          }
          optional { ?key hj:業種コード ?industryCode. }
          optional { ?key hj:活動名称/ic:表記 ?registtype. }
          optional { ?key hj:対象 ?registname. }
          optional { ?key ic:設立日/ic:標準型日付 ?borndate. }
          optional { ?key hj:分類/ic:表記 ?tokkyocode. }
          optional { ?key hj:認定番号/ic:識別値 ?tokkyoid. }
        } limit 1
    `),
    // registtype 特許：発明の名称 意匠：意匠に係る物品 商標：商標
    );
//         GROUP BY ?corporateID ?corporateName ?corporateKana ?industryCode ?location ?moddate ?systemName ?classSInfo ?classHInfo ?cityID ?borndate
    
  }
  async getDetail_(corporateID) {
    const list = await this.getItem(`http://hojin-info.go.jp/data/${corporateID}`);
    console.log(list.results);
    Deno.exit(0);
    //const data = await gbiz.getItem(`http://hojin-info.go.jp/data/ext/6120001005484_2021_301_商標_202108_00922404`);
    return list;
  }
  async getDetail_bk(corporateID) {
    return this.cutType(
      // ?industryCode
      await this.sparqlItem(`
        PREFIX hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
        PREFIX ic: <http://imi.go.jp/ns/core/rdf#>
        SELECT ?s ?corporateID ?corporateName ?corporateKana ?industryCode ?location ?moddate ?systemName ?classSInfo ?classHInfo ?cityID ?borndate
        FROM <http://hojin-info.go.jp/graph/hojin> { 
          ?s hj:法人基本情報 ?key. 
          ?key ic:ID/ic:識別値 '${corporateID}'. 
          OPTIONAL{?key ic:ID/ic:識別値 ?corporateID .} 
          OPTIONAL{?key ic:名称 _:keyCorporateName . 
          _:keyCorporateName ic:種別 '商号又は名称'. 
          _:keyCorporateName ic:表記 ?corporateName .} 
          OPTIONAL{?key ic:名称 _:keyCorporateNameKana . 
          _:keyCorporateNameKana ic:種別 '商号又は名称'. 
          _:keyCorporateNameKana ic:カナ表記 ?corporateKana .} 
          OPTIONAL{
            ?key ic:住所 _:keyAddress . 
            _:keyAddress ic:種別 '住所'.
            _:keyAddress ic:表記 ?location.
            _:keyAddress ic:市区町村コード ?cityID.
          }
          OPTIONAL{?key hj:更新日時/ic:標準型日時 ?moddate .} 
          OPTIONAL{?key hj:システム名/ic:表記 ?systemName .} 
          ?key ic:組織種別 ?classHInfo.
          OPTIONAL{
            ?key hj:区分 _:keyStatus. 
            _:keyStatus ic:種別 '処理区分'. 
            _:keyStatus ic:表記 ?classSInfo.
          }
          optional { ?key hj:業種コード ?industryCode. }
          optional { ?key ic:設立日/ic:標準型日付 ?borndate. }
        }
    `),
    );
//         GROUP BY ?corporateID ?corporateName ?corporateKana ?industryCode ?location ?moddate ?systemName ?classSInfo ?classHInfo ?cityID ?borndate
    
  }
  async getBornDate(corporateID) {
    const graphs = [
      "http://hojin-info.go.jp/graph/todokede", // 届出認定情報・・・にしか設立日入っていない？
      "http://hojin-info.go.jp/graph/shokuba", // 職場情報
      "http://hojin-info.go.jp/graph/zaimu", // 財務情報
      "http://hojin-info.go.jp/graph/hyosho",
      "http://hojin-info.go.jp/graph/hojyokin",
      "http://hojin-info.go.jp/graph/tokkyo",
      "http://hojin-info.go.jp/graph/chotatsu",
    ];
    for (const graph of graphs) {
      const res = this.cutType(await this.sparqlItem(`
          PREFIX hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
          PREFIX ic: <http://imi.go.jp/ns/core/rdf#>
          SELECT ?borndate
          FROM <${graph}> {
            ?key ic:ID/ic:識別値 '${corporateID}'.
            ?key ic:設立日/ic:標準型日付 ?borndate.
          } limit 1
      `));
      if (res) {
        return res.borndate;
      }
    }
    return null;
  }
  async getHojinName(name) {
    /*
    // use Elasticsearch cpu 9.760 total
    return await this.sparqlItems(`
      PREFIX  hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
      PREFIX  ic: <http://imi.go.jp/ns/core/rdf#>
      PREFIX  neptune-fts: <http://aws.amazon.com/neptune/vocab/v01/services/fts#>
      SELECT ?corporateID ?corporateName ?prefecture ?city ?classSType (COUNT(DISTINCT(?countTarget)) AS ?count)
      { 
        { GRAPH <http://hojin-info.go.jp/graph/hojin> 
          { 
            ?s hj:法人基本情報 ?key1. 
            ?key1 ic:ID/ic:識別値 ?corporateID. 
            ?key1 ic:名称 _:corporatekeyName1. 
            _:corporatekeyName1 ic:種別 '商号又は名称'. 
            _:corporatekeyName1 ic:表記 ?corporateName. 
            ?key1 ic:住所 _:keyAddress1. 
            _:keyAddress1 ic:都道府県 ?prefecture. 
            _:keyAddress1 ic:市区町村 ?city. 
            ?key1 hj:区分 _:keyName. 
            _:keyName ic:種別 '処理区分'. 
            _:keyName ic:表記 ?classSType. 
            FILTER(contains(?corporateName, '${name}')) 
            SERVICE neptune-fts:search {
            neptune-fts:config neptune-fts:endpoint 'https://vpc-pgi-es-domain-1-gxjkidgb7s75w7nqzc7rlneig4.ap-northeast-1.es.amazonaws.com' .
              neptune-fts:config neptune-fts:queryType 'simple_query_string' .
              neptune-fts:config neptune-fts:query '${name}' .
              neptune-fts:config neptune-fts:field ic:表記 .
              neptune-fts:config neptune-fts:return ?key1 .
            }
          }
        }
        OPTIONAL { VALUES ?tableName {
          <http://hojin-info.go.jp/graph/chotatsu> <http://hojin-info.go.jp/graph/hyosho> 
          <http://hojin-info.go.jp/graph/todokede> <http://hojin-info.go.jp/graph/hojyokin> 
          <http://hojin-info.go.jp/graph/tokkyo> <http://hojin-info.go.jp/graph/zaimu>
          }
          GRAPH ?tableName { 
            { ?s hj:法人活動情報 ?countTarget.} 
          } 
        } 
      } GROUP BY ?corporateID ?corporateName ?prefecture ?city ?classSType
      ORDER BY ?corporateID  LIMIT 1000
      `);
      */
    /* // 5:00.36 total time out
    return await this.sparqlItems(`
      PREFIX  hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
      PREFIX  ic: <http://imi.go.jp/ns/core/rdf#>
      SELECT ?corporateID ?corporateName ?prefecture ?city ?classSType (COUNT(DISTINCT(?countTarget)) AS ?count)
      { 
        { GRAPH <http://hojin-info.go.jp/graph/hojin> 
          { 
            ?s hj:法人基本情報 ?key1. 
            ?key1 ic:ID/ic:識別値 ?corporateID. 
            ?key1 ic:名称 _:corporatekeyName1. 
            _:corporatekeyName1 ic:種別 '商号又は名称'. 
            _:corporatekeyName1 ic:表記 ?corporateName. 
            ?key1 ic:住所 _:keyAddress1. 
            _:keyAddress1 ic:都道府県 ?prefecture. 
            _:keyAddress1 ic:市区町村 ?city. 
            ?key1 hj:区分 _:keyName. 
            _:keyName ic:種別 '処理区分'. 
            _:keyName ic:表記 ?classSType. 
            FILTER(contains(?corporateName, '${name}'))
          }
        }
        OPTIONAL { VALUES ?tableName {
          <http://hojin-info.go.jp/graph/chotatsu> <http://hojin-info.go.jp/graph/hyosho> 
          <http://hojin-info.go.jp/graph/todokede> <http://hojin-info.go.jp/graph/hojyokin> 
          <http://hojin-info.go.jp/graph/tokkyo> <http://hojin-info.go.jp/graph/zaimu>
          }
          GRAPH ?tableName { 
            { ?s hj:法人活動情報 ?countTarget.} 
          } 
        } 
      } GROUP BY ?corporateID ?corporateName ?prefecture ?city ?classSType
      ORDER BY ?corporateID  LIMIT 1000
      `);
  */
  /*
      return await this.cutType(await this.sparqlItems(`
        PREFIX hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
        PREFIX ic: <http://imi.go.jp/ns/core/rdf#>
        SELECT ?corporateID ?corporateName {
          GRAPH <http://hojin-info.go.jp/graph/hojin> { 
            ?s hj:法人基本情報 ?key1. 
            ?key1 ic:ID/ic:識別値 ?corporateID. 
            ?key1 ic:名称 _:corporatekeyName1.
            _:corporatekeyName1 ic:種別 '商号又は名称'. 
            _:corporatekeyName1 ic:表記 ?corporateName. 
            FILTER(contains(?corporateName, '${name}'))
          }
        }
        LIMIT 100
      `));
      */
      /*
        GROUP BY ?corporateID ?corporateName
          ORDER BY ?corporateID  LIMIT 1000
      */
      
      //  cpu 5.667 total　with Elasticsearch
      
      return await this.cutType(await this.sparqlItems(`
        PREFIX hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
        PREFIX ic: <http://imi.go.jp/ns/core/rdf#>
        PREFIX neptune-fts: <http://aws.amazon.com/neptune/vocab/v01/services/fts#>
        SELECT ?corporateID ?corporateName {
          GRAPH <http://hojin-info.go.jp/graph/hojin> { 
            ?s hj:法人基本情報 ?key1. 
            ?key1 ic:ID/ic:識別値 ?corporateID. 
            ?key1 ic:名称 _:corporatekeyName1.
            _:corporatekeyName1 ic:種別 '商号又は名称'. 
            _:corporatekeyName1 ic:表記 ?corporateName. 
            FILTER(contains(?corporateName, '${name}'))

            SERVICE neptune-fts:search {
              neptune-fts:config neptune-fts:endpoint 'https://vpc-pgi-es-domain-1-gxjkidgb7s75w7nqzc7rlneig4.ap-northeast-1.es.amazonaws.com' .
              neptune-fts:config neptune-fts:queryType 'simple_query_string' .
              neptune-fts:config neptune-fts:query '${name}'.
              neptune-fts:config neptune-fts:field ic:表記.
              neptune-fts:config neptune-fts:return ?key1.
            }
          }
        }
        LIMIT 100
      `));
      // 0.288 total
     /*
         GROUP BY ?corporateID ?corporateName
          ORDER BY ?corporateID LIMIT 1000
     */
  }
  // todo sortByCorporateID
  filterByCorporateID(a, b) {
    return parseInt(a.corporateID.substring(1)) - parseInt(b.corporateID.substring(1));
  }
  filterByActive(a) { // 21 清算, 81 , 99 削除
    return a.classSType != "21" && a.classSType != "81" && a.classType != "99";
  }
  async parseCorporateID(id) {
    id = id.toString();
    if (!isValid(id)) {
      return null;
    }
    const g = globalThis;
    g.tokijo = g.tokijo || CSV.toJSON(await CSV.fetch("./tokijo.csv"));
    g.tokitype = g.tokitype || CSV.toJSON(await CSV.fetch("./tokitype.csv"));
    const tokijo = id.substring(1, 1 + 4);
    const tokitype = id.substring(1 + 4, 1 + 4 + 2);
    return {
      tokijo: g.tokijo.find(n => n.name == tokijo)?.label || tokijo,
      tokitype: g.tokitype.find(n => n.name == tokitype)?.label || tokitype,
      tokiserial: parseInt(id.substring(1 + 4 + 2))
    };
  }
}

export { GBizINFO };
