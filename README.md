# gBizINFO

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A toolkit and data hub for fetching, processing, and visualizing corporate information in Japan. This project automatically collects data from official government sources to provide up-to-date datasets and interactive dashboards.

## Live Demos

### National Trends & Statistics
- [Company Creation & Termination Dashboard](https://code4fukui.github.io/gBizINFO/company_dashboard.html) - Visualize daily changes on a map of Japan.
- [Historical Trend of Company Numbers](https://code4fukui.github.io/gBizINFO/company_diff.html) - Track the total number of companies over time.
- [Monthly Statistics by Prefecture](https://code4fukui.github.io/gBizINFO/stat.html) - View monthly creation and termination data for each prefecture.

### Entity Lists
- [National Government Agencies](https://code4fukui.github.io/gBizINFO/jpgovs.html)
- [Local Governments](https://code4fukui.github.io/gBizINFO/localgovs.html)
- [Foreign Companies Registered in Japan](https://code4fukui.github.io/gBizINFO/foreigns.html)

### Regional Data Samples (Sabae City)
- [Company List](https://code4fukui.github.io/gBizINFO/company_bycity_sabae.html)
- [Registered Trademarks](https://code4fukui.github.io/gBizINFO/company_trademark_sabae.html)
- [Patents](https://code4fukui.github.io/gBizINFO/company_patent_sabae.html)

## Features

- **Automated Data Updates:** A GitHub Actions workflow runs daily to fetch the latest corporate registration changes.
- **Interactive Dashboards:** Visualize company creation and termination data across Japan with interactive, map-based dashboards.
- **Comprehensive Datasets:** Provides ready-to-use CSV files for company information, government agencies, patents, and more.
- **JavaScript/Deno Modules:** Includes reusable modules (`GBizINFO.js`, `SPARQL.js`) for querying the gBizINFO SPARQL endpoint directly.

## Datasets

All generated data is available as CSV files in the [`data/`](./data/) directory. Key datasets include:

- **Daily Changes:** Daily records of new (`_created.csv`) and terminated (`_terminated.csv`) companies.
- **Change Summary:** A summary of creations and terminations by prefecture and month (`data/diff_summary.csv`).
- **Entity Lists:** Comprehensive lists of national agencies (`jpgovs.csv`), local governments (`localgovs.csv`), and foreign companies (`foreigns.csv`).
- **City-Level Data:** Detailed company information, patents, and trademarks for specific cities (e.g., `data/18207/` for Sabae City).

## How It Works

This project uses a combination of web scraping and API calls to gather data:

1.  **Daily Difference Files:** A scheduled GitHub Action scrapes the National Tax Agency's website to download daily files of corporate changes (creations, terminations, etc.).
2.  **SPARQL Queries:** Deno scripts query the gBizINFO SPARQL endpoint to retrieve structured data on government agencies, foreign companies, and basic corporate information.
3.  **Data Processing:** The raw data is processed and converted into clean, version-controlled CSV files.
4.  **Visualization:** The static HTML pages in the repository use these CSV files to generate the interactive dashboards and lists.

## Data Sources

- **[gBizINFO](https://info.gbiz.go.jp/):** A service operated by the Ministry of Economy, Trade and Industry (METI) of Japan, accessed via its SPARQL endpoint.
- **[National Tax Agency Corporate Number Publication Site](https://www.houjin-bangou.nta.go.jp/):** Provides daily difference files on corporate registrations.

## License

MIT License — see [LICENSE](LICENSE).