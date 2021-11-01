# gBizINFO

- [創廃業ダッシュボード](https://code4fukui.github.io/gBizINFO/company_dashboard.html)
- [日本の法人数推移](https://code4fukui.github.io/gBizINFO/company_diff.html)
- [創業ダッシュボード](https://code4fukui.github.io/gBizINFO/company_created.html)
- [廃業ダッシュボード](https://code4fukui.github.io/gBizINFO/company_terminated.html)
- [日本の国の機関一覧](https://code4fukui.github.io/gBizINFO/jpgovs.html)
- [日本の地方公共団体一覧](https://code4fukui.github.io/gBizINFO/localgovs.html)
- [日本で登記されている外国の企業一覧](https://code4fukui.github.io/gBizINFO/foreigns.html)

## データ更新方法

基本 workflow による自動更新
```
deno run -A downloadDiffLatest.js
```

月初、失敗したら下記を一度実行
```
deno run -A downloadDiff.js
```
