## Description

The `CLUSTER BY` clause is used to first repartition the data based
on the input expressions and then sort the data within each partition. This is
semantically equivalent to performing a
[DISTRIBUTE BY](/user-guide/querying/query-syntax/data-retrieval/distribute-by) followed by a
[SORT BY](/user-guide/querying/query-syntax/data-retrieval/sort-by). This clause only ensures that the
resultant rows are sorted within each partition and does not guarantee a total order of output.

## Syntax

```sql
CLUSTER BY { expression [ , ... ] }
```

## Parameters

* **expression**

  Specifies combination of one or more values, operators and SQL functions that results in a value.

## Examples

```sql
CREATE TABLE person (name STRING, age INT);
INSERT INTO person VALUES
    ('Zen Hui', 25),
    ('Anil B', 18),
    ('Shone S', 16),
    ('Mike A', 25),
    ('John A', 18),
    ('Jack N', 16);

-- Reduce the number of shuffle partitions to 2 to illustrate the behavior of `CLUSTER BY`.
-- It's easier to see the clustering and sorting behavior with less number of partitions.
SET spark.sql.shuffle.partitions = 2;

-- Select the rows with no ordering. Please note that without any sort directive, the results
-- of the query is not deterministic. It's included here to show the difference in behavior
-- of a query when `CLUSTER BY` is not used vs when it's used. The query below produces rows
-- where age column is not sorted.
SELECT age, name FROM person;
+---+-------+
|age|   name|
+---+-------+
| 16|Shone S|
| 25|Zen Hui|
| 16| Jack N|
| 25| Mike A|
| 18| John A|
| 18| Anil B|
+---+-------+

-- Produces rows clustered by age. Persons with same age are clustered together.
-- In the query below, persons with age 18 and 25 are in first partition and the
-- persons with age 16 are in the second partition. The rows are sorted based
-- on age within each partition.
SELECT age, name FROM person CLUSTER BY age;
+---+-------+
|age|   name|
+---+-------+
| 18| John A|
| 18| Anil B|
| 25|Zen Hui|
| 25| Mike A|
| 16|Shone S|
| 16| Jack N|
+---+-------+
```
