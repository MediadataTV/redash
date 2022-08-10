The **Query Results Data Source** (QRDS) lets you run queries against results from your other Data Sources. Use it to join data from multiple databases or perform post-processing. Redash uses an in-memory SQLite database to make this possible. As a result, queries against large result sets may fail if Redash runs out of memory.
:::warning
The QRDS doesn't work with results from queries that use [parameters](/user-guide/querying/query-parameters). If you try it you'll see `Error running query: Failed loading results from query id xxxx`. Remove the parameters from `query_xxxx` to fix the error.
:::

### Setup
You can enable **Query Results** under the `Data Source` tab of the settings menu. Setup is easy: just provide a name for the source.

![](static/images/docs/gitbook/query-results-setup.png =600x)

This is the name that will appear in the source dropdown on the left of the query editor. The data source is called **Query Results** in the below screenshot.

![](static/images/docs/gitbook/query-results-example.png =800x)

:::info
Most organizations only require **one** Query Results data source.
:::

### Querying
The QRDS accepts [SQLite query syntax](https://sqlite.org/lang.html):

```
SELECT
	a.name,
	b.count
FROM query_123 AS a
JOIN query_456 AS b
  		ON a.id = b.id
```

Your other queries are like "tables" to the QRDS. Each one is aliased as ``query_`` followed by its `query_id` which you can see in the URL bar of your browser from the query editor. For example, a query at `/queries/49588` has the alias `query_49588`.

:::warning
The query alias like `query_49588` _must_ appear on the same line as its associated `FROM` or `JOIN` keyword.
:::

### Cached Query Results
When you query the **Query Results Data Source**, Redash executes the underlying queries first. This guarantees recent results in case you [schedule a QRDS query](/user-guide/querying/scheduling-a-query). You can speed up QRDS queries by using `cached_query_` for your query aliases instead of `query_`. This tells Redash to use the cached results from the most recent execution of a given query. This improves performance by using older data. You can mix both syntaxes in the same query too:

```
SELECT
	a.name,
	b.count
FROM cached_query_123 AS a
JOIN query_456 AS b
  		ON a.id = b.id
```
