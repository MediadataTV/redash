# How to download a query result

Visit any query page and click the vertical ellipsis (`⋮`) button beneath the results pane. Then choose to download a CSV, TSV, or Excel file. This action downloads the current query result.

![](static/images/docs/md-custom/export-results-1.png)

# How to get latest results via the API

Visit any query page and click the horizontal ellipsis (`…`) above the query editor. Then choose **Show API Key**. The links in the modal that appears always point to the latest query result. You can choose between CSV and JSON formats to be returned by the API call.

:::info

It's not shown in the interface, but you can also get the Excel format by changing the file type suffix from `json`/`csv` to `xlsx`.

:::

![](static/images/docs/md-custom/export-results-2.png)
:::warning

The latest results API is not supported for queries that use parameters.

:::


