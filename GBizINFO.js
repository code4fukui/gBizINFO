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
        <http://imi.go.jp/ns/core/rdf#市区町村コード>/<http://imi.go.jp/ns/core/rdf#識別値> ?o
      } limit 1`))?.o.value;
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
        OPTIONAL { ?key hj:更新日時/ic:標準型日時 ?moddate. }
        ?key ic:組織種別 ?corporateType.
        optional { ?key ic:設立日/ic:標準型日付 ?borndate. }
      } GROUP BY ?corporateID ?corporateType ?corporateName ?corporateKana ?location ?borndate ?moddate
    `));
    /*
        OPTIONAL { ?key hj:区分 _:keyStatus. 
          _:keyStatus ic:種別 '処理区分'. 
          _:keyStatus ic:表記 ?classSInfo.
        }
      ?classSInfo
      */
  }
  async getDetail(corporateID) {
    return this.cutType(
      await this.sparqlItem(`
        PREFIX  hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
        PREFIX  ic: <http://imi.go.jp/ns/core/rdf#>
        SELECT DISTINCT ?corporateID ?corporateName ?corporateKana ?location ?moddate ?systemName ?classSInfo ?classHInfo ?cityID ?borndate
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
          optional { ?key ic:設立日/ic:標準型日付 ?borndate. }
        } GROUP BY ?corporateID ?corporateName ?corporateKana ?location ?moddate ?systemName ?classSInfo ?classHInfo ?cityID ?borndate
    `),
    );
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
  filterByCorporateID(a, b) {
    return parseInt(a.corporateID.substring(1)) - parseInt(b.corporateID.substring(1));
  }
  async getInfoByCorporateID(id) {
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
