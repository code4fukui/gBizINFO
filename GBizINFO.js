import { SPARQL } from "./SPARQL.js";

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
    return await this.sparqlItems(`
      PREFIX  hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
      PREFIX  ic: <http://imi.go.jp/ns/core/rdf#>
      SELECT DISTINCT ?corporateID ?corporateName ?corporateKana ?location ?moddate ?systemName ?classSInfo 
      FROM <http://hojin-info.go.jp/graph/hojin> { 
          ?s hj:法人基本情報 ?key. 
          OPTIONAL{ ?key ic:ID/ic:識別値 ?corporateID .} 
          OPTIONAL{
            ?key ic:名称 _:keyCorporateName. 
            _:keyCorporateName ic:種別 '商号又は名称'. 
            _:keyCorporateName ic:表記 ?corporateName .
          } 
          OPTIONAL {
            ?key ic:名称 _:keyCorporateNameKana . 
            _:keyCorporateNameKana ic:種別 '商号又は名称'. 
            _:keyCorporateNameKana ic:カナ表記 ?corporateKana .
          } 
          ?key ic:住所/ic:市区町村コード <http://imi.go.jp/ns/code_id/code/jisx0402#${cityID}>.
          OPTIONAL{
            ?key ic:住所 _:keyAddress . 
            _:keyAddress ic:種別 '住所' . 
            _:keyAddress ic:表記 ?location .
          } 
          OPTIONAL{?key hj:更新日時/ic:標準型日時 ?moddate .} 
          OPTIONAL{?key hj:区分 _:keyStatus. 
                    _:keyStatus ic:種別 '処理区分'. 
                    _:keyStatus ic:表記 ?classSInfo .} 
      } GROUP BY ?corporateID ?corporateName ?corporateKana ?location ?moddate ?classSInfo 
    `);
  }
}

export { GBizINFO };
