## Description

Some visualizations allow to reference any field of the result query and to process it with some simple filters.

The following hint can be found in visualizations and fields that permit a column format

![](/static/images/docs/gitbook/visualization_examples/column-format-hint.png)

## How to use

In order to reference the whole field the following string can be used

`{{ @ }}`

To reference any specific field coming from query result the syntax is

`{{ <field_name> }}`

## Filters

The fields that admit a custom format can also use filter in order to select and/or clear results

### Syntax

* **Without parameters**:

  `{{ <field_name>|<simple_filter> }}`

* **Parametrized**:

  `{{ <field_name>|<parametrized_filter>:<param1>:<param2> }}`

:::info
Filter can be also chained as follows:

`{{ <field_name>|<filter>:<param1>:<param2>|<simple_filter> }}`
:::

### List of filter

#### camelCase

**Syntax**

`{{ <field>|camelCase }}`

**Effect**

Transforms the filtered string to camel case

#### snakeCase

**Syntax**

`{{ <field>|snakeCase }}`

**Effect**
Transforms the filteres string to snake case

#### jsonSelect

**Syntax**

`{{ <field>|jsonSelect:<path> }}`

**Parameters**

This filter has a mandatory path string parameter.

**Effect**

Select data from json object/array according to path parameter

#### jsonFind

**Syntax**

`{{ <field>|jsonFind:<path>:<match_value> }}`

**Parameters**

This filter has two mandatory parameters,

* a path string to get value
* a match value to test against field path value and filter data

**Effect**

Select data from json object/array according to path parameter then filters
matching it against second parameter

## Examples

Given the following result table:

```
+--------------------------------------------------------+----------------+
|                                                trailer |          movie |
+--------------------------------------------------------+----------------+
| [                                                      |                |
|   {                                                    |                |
|     "description": "Trailer 1",                        |                |
|     "url": "https://www.youtube.com/watch?v=XXX-xxxxx" |                |
|   },                                                   |                |
|   {                                                    | Demolition Man |
|     "description": "Trailer 2",                        |                |
|     "url": "https://www.youtube.com/watch?v=YYY-yyyyy" |                |
|   },                                                   |                |
| ]                                                      |                |
+--------------------------------------------------------+----------------+
```

And assuming we are defining a visualization for the field `trailer` as a `Link` type:

![](/static/images/docs/gitbook/visualization_examples/format-spec-link.png)

It is possible to reference any of the fields with the following syntax

* `{{@}}`
  Will print the whole trailer field (JSON) result as:
  ```json
  [
    {
      "description": "Trailer 1",
      "url": "https://www.youtube.com/watch?v=XXX-xxxxx"
    },
    {
      "description": "Trailer 2",
      "url": "https://www.youtube.com/watch?v=YYY-yyyyy"
    }
  ]
  ```
* `{{ @ | jsonSelect:0.url}}`

  Will select the first element of the json array and print the `url` key
  ```
  https://www.youtube.com/watch?v=XXX-xxxxx
  ```

* `{{ @ | jsonSelect:0.description}}`

  Will select the first element of the json array and print the `descritpion` key
  ```
  Trailer 1
  ```

* `{{ @ | jsonFind:0.description:'Trailer 2'}}`

  Will filter the json matching all `descritpion` key values against matching string `Trailer 2`

* `{{ movie }}`

  Will print the movie result field `Demolition Man` even if we are defining results for another field (Cross field reference)
