This page gives a brief introduction and guides you on how to get started using this app.

## Where do I begin?

The starting point of every action is creating a [query](/user-guide/querying/writing-queries)

The query is the base unit of all the other functionalities that can be used.

After you create you query you can add one or more [visualization](/user-guide/visualizations/visualization-types) beyond the default one ([Table visualization](/user-guide/visualizations/table-visualizations))

Those visualization can be embedded into any [dashboard](/user-guide/dashboards/dashboard-editing) by selecting the corresponding query and then the desired visualization.

## How is the data structured?

Every table you can see in the table list, when creating a query, is a direct translation of the JSON schema that represents the entity.

![](static/images/docs/main/tables-list.png)

The table columns are the fields on the first level of the JSON schema.

In the nested field, the data is stored as a struct, that renders in the UI as a JSON and can be queried and filtered by [query functions](/user-guide/querying/query-syntax/functions) or by [visualization filters](/user-guide/visualizations/column-format-spec)

## How to query data for structs?

When you are selecting from a table that have a field that contains a struct, it is farly simple to render the data.
Depending on the type of the struct you can render the data in different ways, let's see some examples:

### Examples

```sql
select id, type, name
    from content
WHERE type = 'Movie'
LIMIT 5
```

That returns the following data:

| id                                   | type  | name                                                                                                                                                                             |
|--------------------------------------|-------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| https://mediadata.tv/program/1000033 | Movie | [<br/>&nbsp;&nbsp;{"language":"en-us","value":"A Hero"},<br/>&nbsp;&nbsp;{"language":"fr-fr","value":"Ghahreman"},<br/>&nbsp;&nbsp;{"language":"es-es","value":"Un héroe"}<br/>] |
| https://mediadata.tv/program/10001   | Movie | [<br/>&nbsp;&nbsp;{"language":"fr-fr","value":"Trois couleurs: Bleu"},<br/>&nbsp;&nbsp;{"language":"es-es","value":"Tres colores: azul"}<br/>]                                   |
| https://mediadata.tv/program/10002   | Movie | [<br/>&nbsp;&nbsp;{"language":"en-gb","value":"The Mirror Crack'd"},<br/>&nbsp;&nbsp;{"language":"es-es","value":"Espejo roto"}<br/>]                                            |
| https://mediadata.tv/program/1000225 | Movie | [<br/>&nbsp;&nbsp;{"language":"es-es","value":"Detrás de las cámaras con Jane Campion"}<br/>]                                                                                    |
| https://mediadata.tv/program/1000338 | Movie | [<br/>&nbsp;&nbsp;{"language":"en-us","value":"Fistful of Vengeance"},<br/>&nbsp;&nbsp;{"language":"es-es","value":"Venganza a golpes"}<br/>]                                    |

To get an array of the titles for the movies you can use the following query:

```sql
select id, type, name.value
    from content
WHERE type = 'Movie'
LIMIT 5
```

That returns the following data:

| id                                   | type  | name                                                                                      |
|--------------------------------------|-------|-------------------------------------------------------------------------------------------|
| https://mediadata.tv/program/1000033 | Movie | [<br/>&nbsp;&nbsp;"A Hero",<br/>&nbsp;&nbsp;"Ghahreman",<br/>&nbsp;&nbsp;"Un héroe"<br/>] |
| https://mediadata.tv/program/10001   | Movie | [<br/>&nbsp;&nbsp;"Trois couleurs: Bleu",<br/>&nbsp;&nbsp;"Tres colores: azul"<br/>]      |
| https://mediadata.tv/program/10002   | Movie | [<br/>&nbsp;&nbsp;"The Mirror Crack'd",<br/>&nbsp;&nbsp;"Espejo roto"<br/>]               |
| https://mediadata.tv/program/1000225 | Movie | [<br/>&nbsp;&nbsp;"Detrás de las cámaras con Jane Campion"<br/>]                          |
| https://mediadata.tv/program/1000338 | Movie | [<br/>&nbsp;&nbsp;"Fistful of Vengeance",<br/>&nbsp;&nbsp;"Venganza a golpes"<br/>]       |

Then if you want to select only the first ocurrence of an array:

```sql
select id, type, name[0].value
    from content
WHERE type = 'Movie'
LIMIT 5
```

That has the following result data:

| id                                   | type  | name                                   |
|--------------------------------------|-------|----------------------------------------|
| https://mediadata.tv/program/1000033 | Movie | A Hero                                 |
| https://mediadata.tv/program/10001   | Movie | Trois couleurs: Bleu                   |
| https://mediadata.tv/program/10002   | Movie | The Mirror Crack'd                     |
| https://mediadata.tv/program/1000225 | Movie | Detrás de las cámaras con Jane Campion |
| https://mediadata.tv/program/1000338 | Movie | Fistful of Vengeance                   |
