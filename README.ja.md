# gBizINFO

日本の法人情報の取得、処理、可視化を行うためのツールキットおよびデータハブです。本プロジェクトは、政府の公式情報源からデータを自動的に収集し、最新のデータセットとインタラクティブなダッシュボードを提供します。

## ライブデモ

### 全国的なトレンドと統計
- [創廃業ダッシュボード](https://code4fukui.github.io/gBizINFO/company_dashboard.html) - 日本全国の日次変化を地図上で可視化します。
- [法人数推移の履歴](https://code4fukui.github.io/gBizINFO/company_diff.html) - 時系列での法人総数の推移を追跡します。
- [都道府県別の月次統計](https://code4fukui.github.io/gBizINFO/stat.html) - 各都道府県の月ごとの創廃業データを確認できます。

### 法人・機関リスト
- [国の機関一覧](https://code4fukui.github.io/gBizINFO/jpgovs.html)
- [地方公共団体一覧](https://code4fukui.github.io/gBizINFO/localgovs.html)
- [日本に登記された外国法人一覧](https://code4fukui.github.io/gBizINFO/foreigns.html)

### 地域データサンプル（鯖江市）
- [法人リスト](https://code4fukui.github.io/gBizINFO/company_bycity_sabae.html)
- [登録商標](https://code4fukui.github.io/gBizINFO/company_trademark_sabae.html)
- [特許](https://code4fukui.github.io/gBizINFO/company_patent_sabae.html)

## 主な機能

- **自動データ更新:** GitHub Actionsのワークフローが毎日実行され、最新の法人登記の変更を取得します。
- **インタラクティブなダッシュボード:** 日本全国の創廃業データを、地図ベースのインタラクティブなダッシュボードで可視化します。
- **包括的なデータセット:** 法人情報、政府機関、特許などの、すぐに利用可能なCSVファイルを提供します。
- **JavaScript/Denoモジュール:** gBizINFOのSPARQLエンドポイントに直接クエリを実行するための再利用可能なモジュール（`GBizINFO.js`、`SPARQL.js`）が含まれています。

## データセット

生成されたすべてのデータは、[`data/`](./data/)ディレクトリにCSVファイルとして保存されています。主なデータセットは以下の通りです：

- **日次差分:** 新規設立（`_created.csv`）および閉鎖・解散（`_terminated.csv`）した法人の日次記録。
- **差分サマリー:** 都道府県別および月別の創廃業サマリー（`data/diff_summary.csv`）。
- **法人・機関リスト:** 国の機関（`jpgovs.csv`）、地方公共団体（`localgovs.csv`）、外国法人（`foreigns.csv`）の包括的なリスト。
- **市区町村レベルのデータ:** 特定の市区町村（例: 鯖江市の `data/18207/`）の詳細な法人情報、特許、商標データ。

## 仕組み

本プロジェクトでは、ウェブスクレイピングとAPI呼び出しを組み合わせてデータを収集しています：

1. **日次差分ファイル:** スケジュールされたGitHub Actionsが国税庁のウェブサイトをスクレイピングし、法人登記の変更（設立、閉鎖など）に関する日次ファイルをダウンロードします。
2. **SPARQLクエリ:** DenoスクリプトがgBizINFOのSPARQLエンドポイントにクエリを実行し、政府機関、外国法人、および基本的な法人情報に関する構造化データを取得します。
3. **データ処理:** 生データを処理し、クリーンでバージョン管理されたCSVファイルに変換します。
4. **可視化:** リポジトリ内の静的HTMLページがこれらのCSVファイルを読み込み、インタラクティブなダッシュボードやリストを生成します。

## データソース

- **[gBizINFO](https://info.gbiz.go.jp/):** 経済産業省（METI）が運営するサービス。SPARQLエンドポイント経由でアクセスしています。
- **[国税庁法人番号公表サイト](https://www.houjin-bangou.nta.go.jp/):** 法人登記に関する日次差分ファイルを提供しています。

## ライセンス

MIT License — 詳細は [LICENSE](LICENSE) を参照してください。
