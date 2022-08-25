# Built-in Functions

Spark SQL has some categories of frequently-used built-in functions for aggregation, arrays/maps, date/timestamp, and JSON data. This subsection presents the usages and descriptions of these functions.

[//]: # ([[toc]])

## Aggregate functions

| Function                                                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| any(expr)                                                            | Returns true if at least one value of \`expr\` is true.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| approx\_count\_distinct(expr[, relativeSD])                          | Returns the estimated cardinality by HyperLogLog++. \`relativeSD\` defines the maximum relative standard deviation allowed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| approx\_percentile(col, percentage [, accuracy])                     | Returns the approximate \`percentile\` of the numeric column \`col\` which is the smallest value in the ordered \`col\` values (sorted from least to greatest) such that no more than \`percentage\` of \`col\` values is less than the value or equal to that value. The value of percentage must be between 0.0 and 1.0. The \`accuracy\` parameter (default: 10000) is a positive numeric literal which controls approximation accuracy at the cost of memory. Higher value of \`accuracy\` yields better accuracy, \`1.0/accuracy\` is the relative error of the approximation. When \`percentage\` is an array, each value of the percentage array must be between 0.0 and 1.0. In this case, returns the approximate percentile array of column \`col\` at the given percentage array. |
| avg(expr)                                                            | Returns the mean calculated from values of a group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| bit\_and(expr)                                                       | Returns the bitwise AND of all non-null input values, or null if none.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| bit\_or(expr)                                                        | Returns the bitwise OR of all non-null input values, or null if none.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| bit\_xor(expr)                                                       | Returns the bitwise XOR of all non-null input values, or null if none.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| bool\_and(expr)                                                      | Returns true if all values of \`expr\` are true.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| bool\_or(expr)                                                       | Returns true if at least one value of \`expr\` is true.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| collect\_list(expr)                                                  | Collects and returns a list of non-unique elements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| collect\_set(expr)                                                   | Collects and returns a set of unique elements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| corr(expr1, expr2)                                                   | Returns Pearson coefficient of correlation between a set of number pairs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| count(\*)                                                            | Returns the total number of retrieved rows, including rows containing null.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| count(expr[, expr...])                                               | Returns the number of rows for which the supplied expression(s) are all non-null.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| count(DISTINCT expr[, expr...])                                      | Returns the number of rows for which the supplied expression(s) are unique and non-null.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| count\_if(expr)                                                      | Returns the number of \`TRUE\` values for the expression.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| count\_min\_sketch(col, eps, confidence, seed)                       | Returns a count-min sketch of a column with the given esp, confidence and seed. The result is an array of bytes, which can be deserialized to a \`CountMinSketch\` before usage. Count-min sketch is a probabilistic data structure used for cardinality estimation using sub-linear space.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| covar\_pop(expr1, expr2)                                             | Returns the population covariance of a set of number pairs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| covar\_samp(expr1, expr2)                                            | Returns the sample covariance of a set of number pairs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| every(expr)                                                          | Returns true if all values of \`expr\` are true.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| first(expr[, isIgnoreNull])                                          | Returns the first value of \`expr\` for a group of rows. If \`isIgnoreNull\` is true, returns only non-null values.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| first\_value(expr[, isIgnoreNull])                                   | Returns the first value of \`expr\` for a group of rows. If \`isIgnoreNull\` is true, returns only non-null values.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| grouping(col)                                                        | indicates whether a specified column in a GROUP BY is aggregated or not, returns 1 for aggregated or 0 for not aggregated in the result set.",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| grouping\_id([col1[, col2 ..]])                                      | returns the level of grouping, equals to \`(grouping(c1) << (n-1)) + (grouping(c2) << (n-2)) + ... + grouping(cn)\`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| kurtosis(expr)                                                       | Returns the kurtosis value calculated from values of a group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| last(expr[, isIgnoreNull])                                           | Returns the last value of \`expr\` for a group of rows. If \`isIgnoreNull\` is true, returns only non-null values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| last\_value(expr[, isIgnoreNull])                                    | Returns the last value of \`expr\` for a group of rows. If \`isIgnoreNull\` is true, returns only non-null values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| max(expr)                                                            | Returns the maximum value of \`expr\`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| max\_by(x, y)                                                        | Returns the value of \`x\` associated with the maximum value of \`y\`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| mean(expr)                                                           | Returns the mean calculated from values of a group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| min(expr)                                                            | Returns the minimum value of \`expr\`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| min\_by(x, y)                                                        | Returns the value of \`x\` associated with the minimum value of \`y\`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| percentile(col, percentage [, frequency])                            | Returns the exact percentile value of numeric column \`col\` at the given percentage. The value of percentage must be between 0.0 and 1.0. The value of frequency should be positive integral                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| percentile(col, array(percentage1 [, percentage2]...) [, frequency]) | Returns the exact percentile value array of numeric column \`col\` at the given percentage(s). Each value of the percentage array must be between 0.0 and 1.0. The value of frequency should be positive integral                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| percentile\_approx(col, percentage [, accuracy])                     | Returns the approximate \`percentile\` of the numeric column \`col\` which is the smallest value in the ordered \`col\` values (sorted from least to greatest) such that no more than \`percentage\` of \`col\` values is less than the value or equal to that value. The value of percentage must be between 0.0 and 1.0. The \`accuracy\` parameter (default: 10000) is a positive numeric literal which controls approximation accuracy at the cost of memory. Higher value of \`accuracy\` yields better accuracy, \`1.0/accuracy\` is the relative error of the approximation. When \`percentage\` is an array, each value of the percentage array must be between 0.0 and 1.0. In this case, returns the approximate percentile array of column \`col\` at the given percentage array. |
| skewness(expr)                                                       | Returns the skewness value calculated from values of a group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| some(expr)                                                           | Returns true if at least one value of \`expr\` is true.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| std(expr)                                                            | Returns the sample standard deviation calculated from values of a group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| stddev(expr)                                                         | Returns the sample standard deviation calculated from values of a group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| stddev\_pop(expr)                                                    | Returns the population standard deviation calculated from values of a group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| stddev\_samp(expr)                                                   | Returns the sample standard deviation calculated from values of a group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| sum(expr)                                                            | Returns the sum calculated from values of a group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| var\_pop(expr)                                                       | Returns the population variance calculated from values of a group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| var\_samp(expr)                                                      | Returns the sample variance calculated from values of a group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| variance(expr)                                                       | Returns the sample variance calculated from values of a group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

### Examples

```sql
-- any
SELECT any(col) FROM VALUES (true), (false), (false) AS tab(col);
+--------+
|any(col)|
+--------+
|    true|
+--------+

SELECT any(col) FROM VALUES (NULL), (true), (false) AS tab(col);
+--------+
|any(col)|
+--------+
|    true|
+--------+

SELECT any(col) FROM VALUES (false), (false), (NULL) AS tab(col);
+--------+
|any(col)|
+--------+
|   false|
+--------+

-- approx_count_distinct
SELECT approx_count_distinct(col1) FROM VALUES (1), (1), (2), (2), (3) tab(col1);
+---------------------------+
|approx_count_distinct(col1)|
+---------------------------+
|                          3|
+---------------------------+

-- approx_percentile
SELECT approx_percentile(col, array(0.5, 0.4, 0.1), 100) FROM VALUES (0), (1), (2), (10) AS tab(col);
+-------------------------------------------------+
|approx_percentile(col, array(0.5, 0.4, 0.1), 100)|
+-------------------------------------------------+
|                                        [1, 1, 0]|
+-------------------------------------------------+

SELECT approx_percentile(col, 0.5, 100) FROM VALUES (0), (6), (7), (9), (10) AS tab(col);
+--------------------------------+
|approx_percentile(col, 0.5, 100)|
+--------------------------------+
|                               7|
+--------------------------------+

-- avg
SELECT avg(col) FROM VALUES (1), (2), (3) AS tab(col);
+--------+
|avg(col)|
+--------+
|     2.0|
+--------+

SELECT avg(col) FROM VALUES (1), (2), (NULL) AS tab(col);
+--------+
|avg(col)|
+--------+
|     1.5|
+--------+

-- bit_and
SELECT bit_and(col) FROM VALUES (3), (5) AS tab(col);
+------------+
|bit_and(col)|
+------------+
|           1|
+------------+

-- bit_or
SELECT bit_or(col) FROM VALUES (3), (5) AS tab(col);
+-----------+
|bit_or(col)|
+-----------+
|          7|
+-----------+

-- bit_xor
SELECT bit_xor(col) FROM VALUES (3), (5) AS tab(col);
+------------+
|bit_xor(col)|
+------------+
|           6|
+------------+

-- bool_and
SELECT bool_and(col) FROM VALUES (true), (true), (true) AS tab(col);
+-------------+
|bool_and(col)|
+-------------+
|         true|
+-------------+

SELECT bool_and(col) FROM VALUES (NULL), (true), (true) AS tab(col);
+-------------+
|bool_and(col)|
+-------------+
|         true|
+-------------+

SELECT bool_and(col) FROM VALUES (true), (false), (true) AS tab(col);
+-------------+
|bool_and(col)|
+-------------+
|        false|
+-------------+

-- bool_or
SELECT bool_or(col) FROM VALUES (true), (false), (false) AS tab(col);
+------------+
|bool_or(col)|
+------------+
|        true|
+------------+

SELECT bool_or(col) FROM VALUES (NULL), (true), (false) AS tab(col);
+------------+
|bool_or(col)|
+------------+
|        true|
+------------+

SELECT bool_or(col) FROM VALUES (false), (false), (NULL) AS tab(col);
+------------+
|bool_or(col)|
+------------+
|       false|
+------------+

-- collect_list
SELECT collect_list(col) FROM VALUES (1), (2), (1) AS tab(col);
+-----------------+
|collect_list(col)|
+-----------------+
|        [1, 2, 1]|
+-----------------+

-- collect_set
SELECT collect_set(col) FROM VALUES (1), (2), (1) AS tab(col);
+----------------+
|collect_set(col)|
+----------------+
|          [1, 2]|
+----------------+

-- corr
SELECT corr(c1, c2) FROM VALUES (3, 2), (3, 3), (6, 4) as tab(c1, c2);
+------------------+
|      corr(c1, c2)|
+------------------+
|0.8660254037844387|
+------------------+

-- count
SELECT count(*) FROM VALUES (NULL), (5), (5), (20) AS tab(col);
+--------+
|count(1)|
+--------+
|       4|
+--------+

SELECT count(col) FROM VALUES (NULL), (5), (5), (20) AS tab(col);
+----------+
|count(col)|
+----------+
|         3|
+----------+

SELECT count(DISTINCT col) FROM VALUES (NULL), (5), (5), (10) AS tab(col);
+-------------------+
|count(DISTINCT col)|
+-------------------+
|                  2|
+-------------------+

-- count_if
SELECT count_if(col % 2 = 0) FROM VALUES (NULL), (0), (1), (2), (3) AS tab(col);
+-------------------------+
|count_if(((col % 2) = 0))|
+-------------------------+
|                        2|
+-------------------------+

SELECT count_if(col IS NULL) FROM VALUES (NULL), (0), (1), (2), (3) AS tab(col);
+-----------------------+
|count_if((col IS NULL))|
+-----------------------+
|                      1|
+-----------------------+

-- count_min_sketch
SELECT hex(count_min_sketch(col, 0.5d, 0.5d, 1)) FROM VALUES (1), (2), (1) AS tab(col);
+---------------------------------------+
|hex(count_min_sketch(col, 0.5, 0.5, 1))|
+---------------------------------------+
|                   00000001000000000...|
+---------------------------------------+

-- covar_pop
SELECT covar_pop(c1, c2) FROM VALUES (1,1), (2,2), (3,3) AS tab(c1, c2);
+------------------+
| covar_pop(c1, c2)|
+------------------+
|0.6666666666666666|
+------------------+

-- covar_samp
SELECT covar_samp(c1, c2) FROM VALUES (1,1), (2,2), (3,3) AS tab(c1, c2);
+------------------+
|covar_samp(c1, c2)|
+------------------+
|               1.0|
+------------------+

-- every
SELECT every(col) FROM VALUES (true), (true), (true) AS tab(col);
+----------+
|every(col)|
+----------+
|      true|
+----------+

SELECT every(col) FROM VALUES (NULL), (true), (true) AS tab(col);
+----------+
|every(col)|
+----------+
|      true|
+----------+

SELECT every(col) FROM VALUES (true), (false), (true) AS tab(col);
+----------+
|every(col)|
+----------+
|     false|
+----------+

-- first
SELECT first(col) FROM VALUES (10), (5), (20) AS tab(col);
+----------+
|first(col)|
+----------+
|        10|
+----------+

SELECT first(col) FROM VALUES (NULL), (5), (20) AS tab(col);
+----------+
|first(col)|
+----------+
|      null|
+----------+

SELECT first(col, true) FROM VALUES (NULL), (5), (20) AS tab(col);
+----------+
|first(col)|
+----------+
|         5|
+----------+

-- first_value
SELECT first_value(col) FROM VALUES (10), (5), (20) AS tab(col);
+----------------+
|first_value(col)|
+----------------+
|              10|
+----------------+

SELECT first_value(col) FROM VALUES (NULL), (5), (20) AS tab(col);
+----------------+
|first_value(col)|
+----------------+
|            null|
+----------------+

SELECT first_value(col, true) FROM VALUES (NULL), (5), (20) AS tab(col);
+----------------+
|first_value(col)|
+----------------+
|               5|
+----------------+

-- grouping
SELECT name, grouping(name), sum(age) FROM VALUES (2, 'Alice'), (5, 'Bob') people(age, name) GROUP BY cube(name);
+-----+--------------+--------+
| name|grouping(name)|sum(age)|
+-----+--------------+--------+
| null|             1|       7|
|Alice|             0|       2|
|  Bob|             0|       5|
+-----+--------------+--------+

-- grouping_id
SELECT name, grouping_id(), sum(age), avg(height) FROM VALUES (2, 'Alice', 165), (5, 'Bob', 180) people(age, name, height) GROUP BY cube(name, height);
+-----+-------------+--------+-----------+
| name|grouping_id()|sum(age)|avg(height)|
+-----+-------------+--------+-----------+
| null|            2|       2|      165.0|
|Alice|            0|       2|      165.0|
|Alice|            1|       2|      165.0|
| null|            3|       7|      172.5|
|  Bob|            1|       5|      180.0|
|  Bob|            0|       5|      180.0|
| null|            2|       5|      180.0|
+-----+-------------+--------+-----------+

-- kurtosis
SELECT kurtosis(col) FROM VALUES (-10), (-20), (100), (1000) AS tab(col);
+-------------------+
|      kurtosis(col)|
+-------------------+
|-0.7014368047529618|
+-------------------+

SELECT kurtosis(col) FROM VALUES (1), (10), (100), (10), (1) as tab(col);
+-------------------+
|      kurtosis(col)|
+-------------------+
|0.19432323191698986|
+-------------------+

-- last
SELECT last(col) FROM VALUES (10), (5), (20) AS tab(col);
+---------+
|last(col)|
+---------+
|       20|
+---------+

SELECT last(col) FROM VALUES (10), (5), (NULL) AS tab(col);
+---------+
|last(col)|
+---------+
|     null|
+---------+

SELECT last(col, true) FROM VALUES (10), (5), (NULL) AS tab(col);
+---------+
|last(col)|
+---------+
|        5|
+---------+

-- last_value
SELECT last_value(col) FROM VALUES (10), (5), (20) AS tab(col);
+---------------+
|last_value(col)|
+---------------+
|             20|
+---------------+

SELECT last_value(col) FROM VALUES (10), (5), (NULL) AS tab(col);
+---------------+
|last_value(col)|
+---------------+
|           null|
+---------------+

SELECT last_value(col, true) FROM VALUES (10), (5), (NULL) AS tab(col);
+---------------+
|last_value(col)|
+---------------+
|              5|
+---------------+

-- max
SELECT max(col) FROM VALUES (10), (50), (20) AS tab(col);
+--------+
|max(col)|
+--------+
|      50|
+--------+

-- max_by
SELECT max_by(x, y) FROM VALUES (('a', 10)), (('b', 50)), (('c', 20)) AS tab(x, y);
+------------+
|max_by(x, y)|
+------------+
|           b|
+------------+

-- mean
SELECT mean(col) FROM VALUES (1), (2), (3) AS tab(col);
+---------+
|mean(col)|
+---------+
|      2.0|
+---------+

SELECT mean(col) FROM VALUES (1), (2), (NULL) AS tab(col);
+---------+
|mean(col)|
+---------+
|      1.5|
+---------+

-- min
SELECT min(col) FROM VALUES (10), (-1), (20) AS tab(col);
+--------+
|min(col)|
+--------+
|      -1|
+--------+

-- min_by
SELECT min_by(x, y) FROM VALUES (('a', 10)), (('b', 50)), (('c', 20)) AS tab(x, y);
+------------+
|min_by(x, y)|
+------------+
|           a|
+------------+

-- percentile
SELECT percentile(col, 0.3) FROM VALUES (0), (10) AS tab(col);
+-----------------------+
|percentile(col, 0.3, 1)|
+-----------------------+
|                    3.0|
+-----------------------+

SELECT percentile(col, array(0.25, 0.75)) FROM VALUES (0), (10) AS tab(col);
+-------------------------------------+
|percentile(col, array(0.25, 0.75), 1)|
+-------------------------------------+
|                           [2.5, 7.5]|
+-------------------------------------+

-- percentile_approx
SELECT percentile_approx(col, array(0.5, 0.4, 0.1), 100) FROM VALUES (0), (1), (2), (10) AS tab(col);
+-------------------------------------------------+
|percentile_approx(col, array(0.5, 0.4, 0.1), 100)|
+-------------------------------------------------+
|                                        [1, 1, 0]|
+-------------------------------------------------+

SELECT percentile_approx(col, 0.5, 100) FROM VALUES (0), (6), (7), (9), (10) AS tab(col);
+--------------------------------+
|percentile_approx(col, 0.5, 100)|
+--------------------------------+
|                               7|
+--------------------------------+

-- skewness
SELECT skewness(col) FROM VALUES (-10), (-20), (100), (1000) AS tab(col);
+------------------+
|     skewness(col)|
+------------------+
|1.1135657469022013|
+------------------+

SELECT skewness(col) FROM VALUES (-1000), (-100), (10), (20) AS tab(col);
+-------------------+
|      skewness(col)|
+-------------------+
|-1.1135657469022011|
+-------------------+

-- some
SELECT some(col) FROM VALUES (true), (false), (false) AS tab(col);
+---------+
|some(col)|
+---------+
|     true|
+---------+

SELECT some(col) FROM VALUES (NULL), (true), (false) AS tab(col);
+---------+
|some(col)|
+---------+
|     true|
+---------+

SELECT some(col) FROM VALUES (false), (false), (NULL) AS tab(col);
+---------+
|some(col)|
+---------+
|    false|
+---------+

-- std
SELECT std(col) FROM VALUES (1), (2), (3) AS tab(col);
+--------+
|std(col)|
+--------+
|     1.0|
+--------+

-- stddev
SELECT stddev(col) FROM VALUES (1), (2), (3) AS tab(col);
+-----------+
|stddev(col)|
+-----------+
|        1.0|
+-----------+

-- stddev_pop
SELECT stddev_pop(col) FROM VALUES (1), (2), (3) AS tab(col);
+-----------------+
|  stddev_pop(col)|
+-----------------+
|0.816496580927726|
+-----------------+

-- stddev_samp
SELECT stddev_samp(col) FROM VALUES (1), (2), (3) AS tab(col);
+----------------+
|stddev_samp(col)|
+----------------+
|             1.0|
+----------------+

-- sum
SELECT sum(col) FROM VALUES (5), (10), (15) AS tab(col);
+--------+
|sum(col)|
+--------+
|      30|
+--------+

SELECT sum(col) FROM VALUES (NULL), (10), (15) AS tab(col);
+--------+
|sum(col)|
+--------+
|      25|
+--------+

SELECT sum(col) FROM VALUES (NULL), (NULL) AS tab(col);
+--------+
|sum(col)|
+--------+
|    null|
+--------+

-- var_pop
SELECT var_pop(col) FROM VALUES (1), (2), (3) AS tab(col);
+------------------+
|      var_pop(col)|
+------------------+
|0.6666666666666666|
+------------------+

-- var_samp
SELECT var_samp(col) FROM VALUES (1), (2), (3) AS tab(col);
+-------------+
|var_samp(col)|
+-------------+
|          1.0|
+-------------+

-- variance
SELECT variance(col) FROM VALUES (1), (2), (3) AS tab(col);
+-------------+
|variance(col)|
+-------------+
|          1.0|
+-------------+
```

## Window Functions

| Function                         | Description                                                                                                                                                                                                                                                                                                                                                                                                       |
|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| cume\_dist()                     | Computes the position of a value relative to all values in the partition.                                                                                                                                                                                                                                                                                                                                         |
| dense\_rank()                    | Computes the rank of a value in a group of values. The result is one plus the previously assigned rank value. Unlike the function rank, dense\_rank will not produce gaps in the ranking sequence.                                                                                                                                                                                                                |
| lag(input[, offset[, default]])  | Returns the value of \`input\` at the \`offset\`th row before the current row in the window. The default value of \`offset\` is 1 and the default value of \`default\` is null. If the value of \`input\` at the \`offset\`th row is null, null is returned. If there is no such offset row (e.g., when the offset is 1, the first row of the window does not have any previous row), \`default\` is returned.    |
| lead(input[, offset[, default]]) | Returns the value of \`input\` at the \`offset\`th row after the current row in the window. The default value of \`offset\` is 1 and the default value of \`default\` is null. If the value of \`input\` at the \`offset\`th row is null, null is returned. If there is no such an offset row (e.g., when the offset is 1, the last row of the window does not have any subsequent row), \`default\` is returned. |
| nth\_value(input[, offset])      | Returns the value of \`input\` at the row that is the \`offset\`th row from beginning of the window frame. Offset starts at 1. If ignoreNulls=true, we will skip nulls when finding the \`offset\`th row. Otherwise, every row counts for the \`offset\`. If there is no such an \`offset\`th row (e.g., when the offset is 10, size of the window frame is less than 10), null is returned.                      |
| ntile(n)                         | Divides the rows for each window partition into \`n\` buckets ranging from 1 to at most \`n\`.                                                                                                                                                                                                                                                                                                                    |
| percent\_rank()                  | Computes the percentage ranking of a value in a group of values.                                                                                                                                                                                                                                                                                                                                                  |
| rank()                           | Computes the rank of a value in a group of values. The result is one plus the number of rows preceding or equal to the current row in the ordering of the partition. The values will produce gaps in the sequence.                                                                                                                                                                                                |
| row\_number()                    | Assigns a unique, sequential number to each row, starting with one, according to the ordering of rows within the window partition.                                                                                                                                                                                                                                                                                |

## Array Functions

| Function                                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| array(expr, ...)                                 | Returns an array with the given elements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| array\_contains(array, value)                    | Returns true if the array contains the value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| array\_distinct(array)                           | Removes duplicate values from the array.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| array\_except(array1, array2)                    | Returns an array of the elements in array1 but not in array2, without duplicates.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| array\_intersect(array1, array2)                 | Returns an array of the elements in the intersection of array1 and array2, without duplicates.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| array\_join(array, delimiter[, nullReplacement]) | Concatenates the elements of the given array using the delimiter and an optional string to replace nulls. If no value is set for nullReplacement, any null value is filtered.                                                                                                                                                                                                                                                                                                                                                                               |
| array\_max(array)                                | Returns the maximum value in the array. NaN is greater than any non-NaN elements for double/float type. NULL elements are skipped.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| array\_min(array)                                | Returns the minimum value in the array. NaN is greater than any non-NaN elements for double/float type. NULL elements are skipped.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| array\_position(array, element)                  | Returns the (1-based) index of the first element of the array as long.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| array\_remove(array, element)                    | Remove all elements that equal to element from array.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| array\_repeat(element, count)                    | Returns the array containing element count times.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| array\_union(array1, array2)                     | Returns an array of the elements in the union of array1 and array2, without duplicates.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| arrays\_overlap(a1, a2)                          | Returns true if a1 contains at least a non-null element present also in a2. If the arrays have no common element and they are both non-empty and either of them contains a null element null is returned, false otherwise.                                                                                                                                                                                                                                                                                                                                  |
| arrays\_zip(a1, a2, ...)                         | Returns a merged array of structs in which the N-th struct contains all N-th values of input arrays.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| flatten(arrayOfArrays)                           | Transforms an array of arrays into a single array.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| sequence(start, stop, step)                      | Generates an array of elements from start to stop (inclusive), incrementing by step. The type of the returned elements is the same as the type of argument expressions. Supported types are: byte, short, integer, long, date, timestamp. The start and stop expressions must resolve to the same type. If start and stop expressions resolve to the 'date' or 'timestamp' type then the step expression must resolve to the 'interval' or 'year-month interval' or 'day-time interval' type, otherwise to the same type as the start and stop expressions. |
| shuffle(array)                                   | Returns a random permutation of the given array.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| slice(x, start, length)                          | Subsets array x starting from index start (array indices start at 1, or starting from the end if start is negative) with the specified length.                                                                                                                                                                                                                                                                                                                                                                                                              |
| sort\_array(array[, ascendingOrder])             | Sorts the input array in ascending or descending order according to the natural ordering of the array elements. NaN is greater than any non-NaN elements for double/float type. Null elements will be placed at the beginning of the returned array in ascending order or at the end of the returned array in descending order.                                                                                                                                                                                                                             |

### Examples

```sql
-- array
SELECT array(1, 2, 3);
+--------------+
|array(1, 2, 3)|
+--------------+
|     [1, 2, 3]|
+--------------+

-- array_contains
SELECT array_contains(array(1, 2, 3), 2);
+---------------------------------+
|array_contains(array(1, 2, 3), 2)|
+---------------------------------+
|                             true|
+---------------------------------+

-- array_distinct
SELECT array_distinct(array(1, 2, 3, null, 3));
+---------------------------------------+
|array_distinct(array(1, 2, 3, NULL, 3))|
+---------------------------------------+
|                        [1, 2, 3, null]|
+---------------------------------------+

-- array_except
SELECT array_except(array(1, 2, 3), array(1, 3, 5));
+--------------------------------------------+
|array_except(array(1, 2, 3), array(1, 3, 5))|
+--------------------------------------------+
|                                         [2]|
+--------------------------------------------+

-- array_intersect
SELECT array_intersect(array(1, 2, 3), array(1, 3, 5));
+-----------------------------------------------+
|array_intersect(array(1, 2, 3), array(1, 3, 5))|
+-----------------------------------------------+
|                                         [1, 3]|
+-----------------------------------------------+

-- array_join
SELECT array_join(array('hello', 'world'), ' ');
+----------------------------------+
|array_join(array(hello, world),  )|
+----------------------------------+
|                       hello world|
+----------------------------------+

SELECT array_join(array('hello', null ,'world'), ' ');
+----------------------------------------+
|array_join(array(hello, NULL, world),  )|
+----------------------------------------+
|                             hello world|
+----------------------------------------+

SELECT array_join(array('hello', null ,'world'), ' ', ',');
+-------------------------------------------+
|array_join(array(hello, NULL, world),  , ,)|
+-------------------------------------------+
|                              hello , world|
+-------------------------------------------+

-- array_max
SELECT array_max(array(1, 20, null, 3));
+--------------------------------+
|array_max(array(1, 20, NULL, 3))|
+--------------------------------+
|                              20|
+--------------------------------+

-- array_min
SELECT array_min(array(1, 20, null, 3));
+--------------------------------+
|array_min(array(1, 20, NULL, 3))|
+--------------------------------+
|                               1|
+--------------------------------+

-- array_position
SELECT array_position(array(3, 2, 1), 1);
+---------------------------------+
|array_position(array(3, 2, 1), 1)|
+---------------------------------+
|                                3|
+---------------------------------+

-- array_remove
SELECT array_remove(array(1, 2, 3, null, 3), 3);
+----------------------------------------+
|array_remove(array(1, 2, 3, NULL, 3), 3)|
+----------------------------------------+
|                            [1, 2, null]|
+----------------------------------------+

-- array_repeat
SELECT array_repeat('123', 2);
+--------------------+
|array_repeat(123, 2)|
+--------------------+
|          [123, 123]|
+--------------------+

-- array_union
SELECT array_union(array(1, 2, 3), array(1, 3, 5));
+-------------------------------------------+
|array_union(array(1, 2, 3), array(1, 3, 5))|
+-------------------------------------------+
|                               [1, 2, 3, 5]|
+-------------------------------------------+

-- arrays_overlap
SELECT arrays_overlap(array(1, 2, 3), array(3, 4, 5));
+----------------------------------------------+
|arrays_overlap(array(1, 2, 3), array(3, 4, 5))|
+----------------------------------------------+
|                                          true|
+----------------------------------------------+

-- arrays_zip
SELECT arrays_zip(array(1, 2, 3), array(2, 3, 4));
+------------------------------------------+
|arrays_zip(array(1, 2, 3), array(2, 3, 4))|
+------------------------------------------+
|                      [{1, 2}, {2, 3}, ...|
+------------------------------------------+

SELECT arrays_zip(array(1, 2), array(2, 3), array(3, 4));
+-------------------------------------------------+
|arrays_zip(array(1, 2), array(2, 3), array(3, 4))|
+-------------------------------------------------+
|                             [{1, 2, 3}, {2, 3...|
+-------------------------------------------------+

-- flatten
SELECT flatten(array(array(1, 2), array(3, 4)));
+----------------------------------------+
|flatten(array(array(1, 2), array(3, 4)))|
+----------------------------------------+
|                            [1, 2, 3, 4]|
+----------------------------------------+

-- sequence
SELECT sequence(1, 5);
+---------------+
| sequence(1, 5)|
+---------------+
|[1, 2, 3, 4, 5]|
+---------------+

SELECT sequence(5, 1);
+---------------+
| sequence(5, 1)|
+---------------+
|[5, 4, 3, 2, 1]|
+---------------+

SELECT sequence(to_date('2018-01-01'), to_date('2018-03-01'), interval 1 month);
+----------------------------------------------------------------------+
|sequence(to_date(2018-01-01), to_date(2018-03-01), INTERVAL '1' MONTH)|
+----------------------------------------------------------------------+
|                                                  [2018-01-01, 2018...|
+----------------------------------------------------------------------+

SELECT sequence(to_date('2018-01-01'), to_date('2018-03-01'), interval '0-1' year to month);
+--------------------------------------------------------------------------------+
|sequence(to_date(2018-01-01), to_date(2018-03-01), INTERVAL '0-1' YEAR TO MONTH)|
+--------------------------------------------------------------------------------+
|                                                            [2018-01-01, 2018...|
+--------------------------------------------------------------------------------+

-- shuffle
SELECT shuffle(array(1, 20, 3, 5));
+---------------------------+
|shuffle(array(1, 20, 3, 5))|
+---------------------------+
|              [5, 1, 3, 20]|
+---------------------------+

SELECT shuffle(array(1, 20, null, 3));
+------------------------------+
|shuffle(array(1, 20, NULL, 3))|
+------------------------------+
|              [1, 20, 3, null]|
+------------------------------+

-- slice
SELECT slice(array(1, 2, 3, 4), 2, 2);
+------------------------------+
|slice(array(1, 2, 3, 4), 2, 2)|
+------------------------------+
|                        [2, 3]|
+------------------------------+

SELECT slice(array(1, 2, 3, 4), -2, 2);
+-------------------------------+
|slice(array(1, 2, 3, 4), -2, 2)|
+-------------------------------+
|                         [3, 4]|
+-------------------------------+

-- sort_array
SELECT sort_array(array('b', 'd', null, 'c', 'a'), true);
+-----------------------------------------+
|sort_array(array(b, d, NULL, c, a), true)|
+-----------------------------------------+
|                       [null, a, b, c, d]|
+-----------------------------------------+
```

## Map Functions

| Function                                         | Description                                                                                                                                                                                                                                                                                                                                       |
|--------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| element\_at(array, index)                        | Returns element of array at given (1-based) index. If index < 0, accesses elements from the last to the first. The function returns NULL if the index exceeds the length of the array and \`spark.sql.ansi.enabled\` is set to false. If \`spark.sql.ansi.enabled\` is set to true, it throws ArrayIndexOutOfBoundsException for invalid indices. |
| element\_at(map, key)                            | Returns value for given key. The function returns NULL if the key is not contained in the map and \`spark.sql.ansi.enabled\` is set to false. If \`spark.sql.ansi.enabled\` is set to true, it throws NoSuchElementException instead.                                                                                                             |
| map(key0, value0, key1, value1, ...)             | Creates a map with the given key/value pairs.                                                                                                                                                                                                                                                                                                     |
| map\_concat(map, ...)                            | Returns the union of all the given maps                                                                                                                                                                                                                                                                                                           |
| map\_entries(map)                                | Returns an unordered array of all entries in the given map.                                                                                                                                                                                                                                                                                       |
| map\_from\_arrays(keys, values)                  | Creates a map with a pair of the given key/value arrays. All elements in keys should not be null                                                                                                                                                                                                                                                  |
| map\_from\_entries(arrayOfEntries)               | Returns a map created from the given array of entries.                                                                                                                                                                                                                                                                                            |
| map\_keys(map)                                   | Returns an unordered array containing the keys of the map.                                                                                                                                                                                                                                                                                        |
| map\_values(map)                                 | Returns an unordered array containing the values of the map.                                                                                                                                                                                                                                                                                      |
| str\_to\_map(text[, pairDelim[, keyValueDelim]]) | Creates a map after splitting the text into key/value pairs using delimiters. Default delimiters are ',' for \`pairDelim\` and ':' for \`keyValueDelim\`. Both \`pairDelim\` and \`keyValueDelim\` are treated as regular expressions.                                                                                                            |

### Examples

```sql
-- element_at
SELECT element_at(array(1, 2, 3), 2);
+-----------------------------+
|element_at(array(1, 2, 3), 2)|
+-----------------------------+
|                            2|
+-----------------------------+

SELECT element_at(map(1, 'a', 2, 'b'), 2);
+------------------------------+
|element_at(map(1, a, 2, b), 2)|
+------------------------------+
|                             b|
+------------------------------+

-- map
SELECT map(1.0, '2', 3.0, '4');
+--------------------+
| map(1.0, 2, 3.0, 4)|
+--------------------+
|{1.0 -> 2, 3.0 -> 4}|
+--------------------+

-- map_concat
SELECT map_concat(map(1, 'a', 2, 'b'), map(3, 'c'));
+--------------------------------------+
|map_concat(map(1, a, 2, b), map(3, c))|
+--------------------------------------+
|                  {1 -> a, 2 -> b, ...|
+--------------------------------------+

-- map_entries
SELECT map_entries(map(1, 'a', 2, 'b'));
+----------------------------+
|map_entries(map(1, a, 2, b))|
+----------------------------+
|            [{1, a}, {2, b}]|
+----------------------------+

-- map_from_arrays
SELECT map_from_arrays(array(1.0, 3.0), array('2', '4'));
+---------------------------------------------+
|map_from_arrays(array(1.0, 3.0), array(2, 4))|
+---------------------------------------------+
|                         {1.0 -> 2, 3.0 -> 4}|
+---------------------------------------------+

-- map_from_entries
SELECT map_from_entries(array(struct(1, 'a'), struct(2, 'b')));
+---------------------------------------------------+
|map_from_entries(array(struct(1, a), struct(2, b)))|
+---------------------------------------------------+
|                                   {1 -> a, 2 -> b}|
+---------------------------------------------------+

-- map_keys
SELECT map_keys(map(1, 'a', 2, 'b'));
+-------------------------+
|map_keys(map(1, a, 2, b))|
+-------------------------+
|                   [1, 2]|
+-------------------------+

-- map_values
SELECT map_values(map(1, 'a', 2, 'b'));
+---------------------------+
|map_values(map(1, a, 2, b))|
+---------------------------+
|                     [a, b]|
+---------------------------+

-- str_to_map
SELECT str_to_map('a:1,b:2,c:3', ',', ':');
+-----------------------------+
|str_to_map(a:1,b:2,c:3, ,, :)|
+-----------------------------+
|         {a -> 1, b -> 2, ...|
+-----------------------------+

SELECT str_to_map('a');
+-------------------+
|str_to_map(a, ,, :)|
+-------------------+
|        {a -> null}|
+-------------------+
```

## Date and Timestamp Functions

| Function                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| add\_months(start\_date, num\_months)                                       | Returns the date that is \`num\_months\` after \`start\_date\`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| current\_date()                                                             | Returns the current date at the start of query evaluation. All calls of current\_date within the same query return the same value.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| current\_date                                                               | Returns the current date at the start of query evaluation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| current\_timestamp()                                                        | Returns the current timestamp at the start of query evaluation. All calls of current\_timestamp within the same query return the same value.                                                                                                                                                                                                                                                                                                                                                                                                                |
| current\_timestamp                                                          | Returns the current timestamp at the start of query evaluation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| current\_timezone()                                                         | Returns the current session local timezone.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| date\_add(start\_date, num\_days)                                           | Returns the date that is \`num\_days\` after \`start\_date\`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| date\_format(timestamp, fmt)                                                | Converts \`timestamp\` to a value of string in the format specified by the date format \`fmt\`.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| date\_from\_unix\_date(days)                                                | Create date from the number of days since 1970-01-01.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| date\_part(field, source)                                                   | Extracts a part of the date/timestamp or interval source.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| date\_sub(start\_date, num\_days)                                           | Returns the date that is \`num\_days\` before \`start\_date\`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| date\_trunc(fmt, ts)                                                        | Returns timestamp \`ts\` truncated to the unit specified by the format model \`fmt\`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| datediff(endDate, startDate)                                                | Returns the number of days from \`startDate\` to \`endDate\`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| day(date)                                                                   | Returns the day of month of the date/timestamp.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| dayofmonth(date)                                                            | Returns the day of month of the date/timestamp.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| dayofweek(date)                                                             | Returns the day of the week for date/timestamp (1 = Sunday, 2 = Monday, ..., 7 = Saturday).                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| dayofyear(date)                                                             | Returns the day of year of the date/timestamp.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| extract(field FROM source)                                                  | Extracts a part of the date/timestamp or interval source.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| from\_unixtime(unix\_time[, fmt])                                           | Returns \`unix\_time\` in the specified \`fmt\`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| from\_utc\_timestamp(timestamp, timezone)                                   | Given a timestamp like '2017-07-14 02:40:00.0', interprets it as a time in UTC, and renders that time as a timestamp in the given time zone. For example, 'GMT+1' would yield '2017-07-14 03:40:00.0'.                                                                                                                                                                                                                                                                                                                                                      |
| hour(timestamp)                                                             | Returns the hour component of the string/timestamp.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| last\_day(date)                                                             | Returns the last day of the month which the date belongs to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| make\_date(year, month, day)                                                | Create date from year, month and day fields.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| make\_dt\_interval([days[, hours[, mins[, secs]]]])                         | Make DayTimeIntervalType duration from days, hours, mins and secs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| make\_interval([years[, months[, weeks[, days[, hours[, mins[, secs]]]]]]]) | Make interval from years, months, weeks, days, hours, mins and secs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| make\_timestamp(year, month, day, hour, min, sec[, timezone])               | Create timestamp from year, month, day, hour, min, sec and timezone fields. The result data type is consistent with the value of configuration \`spark.sql.timestampType\`                                                                                                                                                                                                                                                                                                                                                                                  |
| make\_ym\_interval([years[, months]])                                       | Make year-month interval from years, months.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| minute(timestamp)                                                           | Returns the minute component of the string/timestamp.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| month(date)                                                                 | Returns the month component of the date/timestamp.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| months\_between(timestamp1, timestamp2[, roundOff])                         | If \`timestamp1\` is later than \`timestamp2\`, then the result is positive. If \`timestamp1\` and \`timestamp2\` are on the same day of month, or both are the last day of month, time of day will be ignored. Otherwise, the difference is calculated based on 31 days per month, and rounded to 8 digits unless roundOff=false.                                                                                                                                                                                                                          |
| next\_day(start\_date, day\_of\_week)                                       | Returns the first date which is later than \`start\_date\` and named as indicated. The function returns NULL if at least one of the input parameters is NULL. When both of the input parameters are not NULL and day\_of\_week is an invalid input, the function throws IllegalArgumentException if \`spark.sql.ansi.enabled\` is set to true, otherwise NULL.                                                                                                                                                                                              |
| now()                                                                       | Returns the current timestamp at the start of query evaluation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| quarter(date)                                                               | Returns the quarter of the year for date, in the range 1 to 4.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| second(timestamp)                                                           | Returns the second component of the string/timestamp.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| timestamp\_micros(microseconds)                                             | Creates timestamp from the number of microseconds since UTC epoch.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| timestamp\_millis(milliseconds)                                             | Creates timestamp from the number of milliseconds since UTC epoch.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| timestamp\_seconds(seconds)                                                 | Creates timestamp from the number of seconds (can be fractional) since UTC epoch.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| to\_date(date\_str[, fmt])                                                  | Parses the \`date\_str\` expression with the \`fmt\` expression to a date. Returns null with invalid input. By default, it follows casting rules to a date if the \`fmt\` is omitted.                                                                                                                                                                                                                                                                                                                                                                       |
| to\_timestamp(timestamp\_str[, fmt])                                        | Parses the \`timestamp\_str\` expression with the \`fmt\` expression to a timestamp. Returns null with invalid input. By default, it follows casting rules to a timestamp if the \`fmt\` is omitted. The result data type is consistent with the value of configuration \`spark.sql.timestampType\`.                                                                                                                                                                                                                                                        |
| to\_unix\_timestamp(timeExp[, fmt])                                         | Returns the UNIX timestamp of the given time.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| to\_utc\_timestamp(timestamp, timezone)                                     | Given a timestamp like '2017-07-14 02:40:00.0', interprets it as a time in the given time zone, and renders that time as a timestamp in UTC. For example, 'GMT+1' would yield '2017-07-14 01:40:00.0'.                                                                                                                                                                                                                                                                                                                                                      |
| trunc(date, fmt)                                                            | Returns \`date\` with the time portion of the day truncated to the unit specified by the format model \`fmt\`.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| unix\_date(date)                                                            | Returns the number of days since 1970-01-01.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| unix\_micros(timestamp)                                                     | Returns the number of microseconds since 1970-01-01 00:00:00 UTC.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| unix\_millis(timestamp)                                                     | Returns the number of milliseconds since 1970-01-01 00:00:00 UTC. Truncates higher levels of precision.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| unix\_seconds(timestamp)                                                    | Returns the number of seconds since 1970-01-01 00:00:00 UTC. Truncates higher levels of precision.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| unix\_timestamp([timeExp[, fmt]])                                           | Returns the UNIX timestamp of current or specified time.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| weekday(date)                                                               | Returns the day of the week for date/timestamp (0 = Monday, 1 = Tuesday, ..., 6 = Sunday).                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| weekofyear(date)                                                            | Returns the week of the year of the given date. A week is considered to start on a Monday and week 1 is the first week with >3 days.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| year(date)                                                                  | Returns the year component of the date/timestamp.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

### Examples

 ```sql
 -- add_months
SELECT add_months('2016-08-31', 1);
+-------------------------+
|add_months(2016-08-31, 1)|
+-------------------------+
|               2016-09-30|
+-------------------------+

-- current_date
SELECT current_date();
+--------------+
|current_date()|
+--------------+
|    2022-01-20|
+--------------+

SELECT current_date;
+--------------+
|current_date()|
+--------------+
|    2022-01-20|
+--------------+

-- current_timestamp
SELECT current_timestamp();
+--------------------+
| current_timestamp()|
+--------------------+
|2022-01-20 22:24:...|
+--------------------+

SELECT current_timestamp;
+--------------------+
| current_timestamp()|
+--------------------+
|2022-01-20 22:24:...|
+--------------------+

-- current_timezone
SELECT current_timezone();
+------------------+
|current_timezone()|
+------------------+
|           Etc/UTC|
+------------------+

-- date_add
SELECT date_add('2016-07-30', 1);
+-----------------------+
|date_add(2016-07-30, 1)|
+-----------------------+
|             2016-07-31|
+-----------------------+

-- date_format
SELECT date_format('2016-04-08', 'y');
+--------------------------+
|date_format(2016-04-08, y)|
+--------------------------+
|                      2016|
+--------------------------+

-- date_from_unix_date
SELECT date_from_unix_date(1);
+----------------------+
|date_from_unix_date(1)|
+----------------------+
|            1970-01-02|
+----------------------+

-- date_part
SELECT date_part('YEAR', TIMESTAMP '2019-08-12 01:00:00.123456');
+-------------------------------------------------------+
|date_part(YEAR, TIMESTAMP '2019-08-12 01:00:00.123456')|
+-------------------------------------------------------+
|                                                   2019|
+-------------------------------------------------------+

SELECT date_part('week', timestamp'2019-08-12 01:00:00.123456');
+-------------------------------------------------------+
|date_part(week, TIMESTAMP '2019-08-12 01:00:00.123456')|
+-------------------------------------------------------+
|                                                     33|
+-------------------------------------------------------+

SELECT date_part('doy', DATE'2019-08-12');
+---------------------------------+
|date_part(doy, DATE '2019-08-12')|
+---------------------------------+
|                              224|
+---------------------------------+

SELECT date_part('SECONDS', timestamp'2019-10-01 00:00:01.000001');
+----------------------------------------------------------+
|date_part(SECONDS, TIMESTAMP '2019-10-01 00:00:01.000001')|
+----------------------------------------------------------+
|                                                  1.000001|
+----------------------------------------------------------+

SELECT date_part('days', interval 5 days 3 hours 7 minutes);
+-------------------------------------------------+
|date_part(days, INTERVAL '5 03:07' DAY TO MINUTE)|
+-------------------------------------------------+
|                                                5|
+-------------------------------------------------+

SELECT date_part('seconds', interval 5 hours 30 seconds 1 milliseconds 1 microseconds);
+-------------------------------------------------------------+
|date_part(seconds, INTERVAL '05:00:30.001001' HOUR TO SECOND)|
+-------------------------------------------------------------+
|                                                    30.001001|
+-------------------------------------------------------------+

SELECT date_part('MONTH', INTERVAL '2021-11' YEAR TO MONTH);
+--------------------------------------------------+
|date_part(MONTH, INTERVAL '2021-11' YEAR TO MONTH)|
+--------------------------------------------------+
|                                                11|
+--------------------------------------------------+

SELECT date_part('MINUTE', INTERVAL '123 23:55:59.002001' DAY TO SECOND);
+---------------------------------------------------------------+
|date_part(MINUTE, INTERVAL '123 23:55:59.002001' DAY TO SECOND)|
+---------------------------------------------------------------+
|                                                             55|
+---------------------------------------------------------------+

-- date_sub
SELECT date_sub('2016-07-30', 1);
+-----------------------+
|date_sub(2016-07-30, 1)|
+-----------------------+
|             2016-07-29|
+-----------------------+

-- date_trunc
SELECT date_trunc('YEAR', '2015-03-05T09:32:05.359');
+-----------------------------------------+
|date_trunc(YEAR, 2015-03-05T09:32:05.359)|
+-----------------------------------------+
|                      2015-01-01 00:00:00|
+-----------------------------------------+

SELECT date_trunc('MM', '2015-03-05T09:32:05.359');
+---------------------------------------+
|date_trunc(MM, 2015-03-05T09:32:05.359)|
+---------------------------------------+
|                    2015-03-01 00:00:00|
+---------------------------------------+

SELECT date_trunc('DD', '2015-03-05T09:32:05.359');
+---------------------------------------+
|date_trunc(DD, 2015-03-05T09:32:05.359)|
+---------------------------------------+
|                    2015-03-05 00:00:00|
+---------------------------------------+

SELECT date_trunc('HOUR', '2015-03-05T09:32:05.359');
+-----------------------------------------+
|date_trunc(HOUR, 2015-03-05T09:32:05.359)|
+-----------------------------------------+
|                      2015-03-05 09:00:00|
+-----------------------------------------+

SELECT date_trunc('MILLISECOND', '2015-03-05T09:32:05.123456');
+---------------------------------------------------+
|date_trunc(MILLISECOND, 2015-03-05T09:32:05.123456)|
+---------------------------------------------------+
|                               2015-03-05 09:32:...|
+---------------------------------------------------+

-- datediff
SELECT datediff('2009-07-31', '2009-07-30');
+--------------------------------+
|datediff(2009-07-31, 2009-07-30)|
+--------------------------------+
|                               1|
+--------------------------------+

SELECT datediff('2009-07-30', '2009-07-31');
+--------------------------------+
|datediff(2009-07-30, 2009-07-31)|
+--------------------------------+
|                              -1|
+--------------------------------+

-- day
SELECT day('2009-07-30');
+---------------+
|day(2009-07-30)|
+---------------+
|             30|
+---------------+

-- dayofmonth
SELECT dayofmonth('2009-07-30');
+----------------------+
|dayofmonth(2009-07-30)|
+----------------------+
|                    30|
+----------------------+

-- dayofweek
SELECT dayofweek('2009-07-30');
+---------------------+
|dayofweek(2009-07-30)|
+---------------------+
|                    5|
+---------------------+

-- dayofyear
SELECT dayofyear('2016-04-09');
+---------------------+
|dayofyear(2016-04-09)|
+---------------------+
|                  100|
+---------------------+

-- extract
SELECT extract(YEAR FROM TIMESTAMP '2019-08-12 01:00:00.123456');
+---------------------------------------------------------+
|extract(YEAR FROM TIMESTAMP '2019-08-12 01:00:00.123456')|
+---------------------------------------------------------+
|                                                     2019|
+---------------------------------------------------------+

SELECT extract(week FROM timestamp'2019-08-12 01:00:00.123456');
+---------------------------------------------------------+
|extract(week FROM TIMESTAMP '2019-08-12 01:00:00.123456')|
+---------------------------------------------------------+
|                                                       33|
+---------------------------------------------------------+

SELECT extract(doy FROM DATE'2019-08-12');
+-----------------------------------+
|extract(doy FROM DATE '2019-08-12')|
+-----------------------------------+
|                                224|
+-----------------------------------+

SELECT extract(SECONDS FROM timestamp'2019-10-01 00:00:01.000001');
+------------------------------------------------------------+
|extract(SECONDS FROM TIMESTAMP '2019-10-01 00:00:01.000001')|
+------------------------------------------------------------+
|                                                    1.000001|
+------------------------------------------------------------+

SELECT extract(days FROM interval 5 days 3 hours 7 minutes);
+---------------------------------------------------+
|extract(days FROM INTERVAL '5 03:07' DAY TO MINUTE)|
+---------------------------------------------------+
|                                                  5|
+---------------------------------------------------+

SELECT extract(seconds FROM interval 5 hours 30 seconds 1 milliseconds 1 microseconds);
+---------------------------------------------------------------+
|extract(seconds FROM INTERVAL '05:00:30.001001' HOUR TO SECOND)|
+---------------------------------------------------------------+
|                                                      30.001001|
+---------------------------------------------------------------+

SELECT extract(MONTH FROM INTERVAL '2021-11' YEAR TO MONTH);
+----------------------------------------------------+
|extract(MONTH FROM INTERVAL '2021-11' YEAR TO MONTH)|
+----------------------------------------------------+
|                                                  11|
+----------------------------------------------------+

SELECT extract(MINUTE FROM INTERVAL '123 23:55:59.002001' DAY TO SECOND);
+-----------------------------------------------------------------+
|extract(MINUTE FROM INTERVAL '123 23:55:59.002001' DAY TO SECOND)|
+-----------------------------------------------------------------+
|                                                               55|
+-----------------------------------------------------------------+

-- from_unixtime
SELECT from_unixtime(0, 'yyyy-MM-dd HH:mm:ss');
+-------------------------------------+
|from_unixtime(0, yyyy-MM-dd HH:mm:ss)|
+-------------------------------------+
|                  1970-01-01 00:00:00|
+-------------------------------------+

SELECT from_unixtime(0);
+-------------------------------------+
|from_unixtime(0, yyyy-MM-dd HH:mm:ss)|
+-------------------------------------+
|                  1970-01-01 00:00:00|
+-------------------------------------+

-- from_utc_timestamp
SELECT from_utc_timestamp('2016-08-31', 'Asia/Seoul');
+------------------------------------------+
|from_utc_timestamp(2016-08-31, Asia/Seoul)|
+------------------------------------------+
|                       2016-08-31 09:00:00|
+------------------------------------------+

-- hour
SELECT hour('2009-07-30 12:58:59');
+-------------------------+
|hour(2009-07-30 12:58:59)|
+-------------------------+
|                       12|
+-------------------------+

-- last_day
SELECT last_day('2009-01-12');
+--------------------+
|last_day(2009-01-12)|
+--------------------+
|          2009-01-31|
+--------------------+

-- make_date
SELECT make_date(2013, 7, 15);
+----------------------+
|make_date(2013, 7, 15)|
+----------------------+
|            2013-07-15|
+----------------------+

SELECT make_date(2019, 13, 1);
+----------------------+
|make_date(2019, 13, 1)|
+----------------------+
|                  null|
+----------------------+

SELECT make_date(2019, 7, NULL);
+------------------------+
|make_date(2019, 7, NULL)|
+------------------------+
|                    null|
+------------------------+

SELECT make_date(2019, 2, 30);
+----------------------+
|make_date(2019, 2, 30)|
+----------------------+
|                  null|
+----------------------+

-- make_dt_interval
SELECT make_dt_interval(1, 12, 30, 01.001001);
+-------------------------------------+
|make_dt_interval(1, 12, 30, 1.001001)|
+-------------------------------------+
|                 INTERVAL '1 12:30...|
+-------------------------------------+

SELECT make_dt_interval(2);
+-----------------------------------+
|make_dt_interval(2, 0, 0, 0.000000)|
+-----------------------------------+
|               INTERVAL '2 00:00...|
+-----------------------------------+

SELECT make_dt_interval(100, null, 3);
+----------------------------------------+
|make_dt_interval(100, NULL, 3, 0.000000)|
+----------------------------------------+
|                                    null|
+----------------------------------------+

-- make_interval
SELECT make_interval(100, 11, 1, 1, 12, 30, 01.001001);
+----------------------------------------------+
|make_interval(100, 11, 1, 1, 12, 30, 1.001001)|
+----------------------------------------------+
|                          100 years 11 mont...|
+----------------------------------------------+

SELECT make_interval(100, null, 3);
+----------------------------------------------+
|make_interval(100, NULL, 3, 0, 0, 0, 0.000000)|
+----------------------------------------------+
|                                          null|
+----------------------------------------------+

SELECT make_interval(0, 1, 0, 1, 0, 0, 100.000001);
+-------------------------------------------+
|make_interval(0, 1, 0, 1, 0, 0, 100.000001)|
+-------------------------------------------+
|                       1 months 1 days 1...|
+-------------------------------------------+

-- make_timestamp
SELECT make_timestamp(2014, 12, 28, 6, 30, 45.887);
+-------------------------------------------+
|make_timestamp(2014, 12, 28, 6, 30, 45.887)|
+-------------------------------------------+
|                       2014-12-28 06:30:...|
+-------------------------------------------+

SELECT make_timestamp(2014, 12, 28, 6, 30, 45.887, 'CET');
+------------------------------------------------+
|make_timestamp(2014, 12, 28, 6, 30, 45.887, CET)|
+------------------------------------------------+
|                            2014-12-28 05:30:...|
+------------------------------------------------+

SELECT make_timestamp(2019, 6, 30, 23, 59, 60);
+---------------------------------------+
|make_timestamp(2019, 6, 30, 23, 59, 60)|
+---------------------------------------+
|                    2019-07-01 00:00:00|
+---------------------------------------+

SELECT make_timestamp(2019, 6, 30, 23, 59, 1);
+--------------------------------------+
|make_timestamp(2019, 6, 30, 23, 59, 1)|
+--------------------------------------+
|                   2019-06-30 23:59:01|
+--------------------------------------+

SELECT make_timestamp(2019, 13, 1, 10, 11, 12, 'PST');
+--------------------------------------------+
|make_timestamp(2019, 13, 1, 10, 11, 12, PST)|
+--------------------------------------------+
|                                        null|
+--------------------------------------------+

SELECT make_timestamp(null, 7, 22, 15, 30, 0);
+--------------------------------------+
|make_timestamp(NULL, 7, 22, 15, 30, 0)|
+--------------------------------------+
|                                  null|
+--------------------------------------+

-- make_ym_interval
SELECT make_ym_interval(1, 2);
+----------------------+
|make_ym_interval(1, 2)|
+----------------------+
|  INTERVAL '1-2' YE...|
+----------------------+

SELECT make_ym_interval(1, 0);
+----------------------+
|make_ym_interval(1, 0)|
+----------------------+
|  INTERVAL '1-0' YE...|
+----------------------+

SELECT make_ym_interval(-1, 1);
+-----------------------+
|make_ym_interval(-1, 1)|
+-----------------------+
|   INTERVAL '-0-11' ...|
+-----------------------+

SELECT make_ym_interval(2);
+----------------------+
|make_ym_interval(2, 0)|
+----------------------+
|  INTERVAL '2-0' YE...|
+----------------------+

-- minute
SELECT minute('2009-07-30 12:58:59');
+---------------------------+
|minute(2009-07-30 12:58:59)|
+---------------------------+
|                         58|
+---------------------------+

-- month
SELECT month('2016-07-30');
+-----------------+
|month(2016-07-30)|
+-----------------+
|                7|
+-----------------+

-- months_between
SELECT months_between('1997-02-28 10:30:00', '1996-10-30');
+-----------------------------------------------------+
|months_between(1997-02-28 10:30:00, 1996-10-30, true)|
+-----------------------------------------------------+
|                                           3.94959677|
+-----------------------------------------------------+

SELECT months_between('1997-02-28 10:30:00', '1996-10-30', false);
+------------------------------------------------------+
|months_between(1997-02-28 10:30:00, 1996-10-30, false)|
+------------------------------------------------------+
|                                    3.9495967741935485|
+------------------------------------------------------+

-- next_day
SELECT next_day('2015-01-14', 'TU');
+------------------------+
|next_day(2015-01-14, TU)|
+------------------------+
|              2015-01-20|
+------------------------+

-- now
SELECT now();
+--------------------+
|               now()|
+--------------------+
|2022-01-20 22:25:...|
+--------------------+

-- quarter
SELECT quarter('2016-08-31');
+-------------------+
|quarter(2016-08-31)|
+-------------------+
|                  3|
+-------------------+

-- second
SELECT second('2009-07-30 12:58:59');
+---------------------------+
|second(2009-07-30 12:58:59)|
+---------------------------+
|                         59|
+---------------------------+

-- session_window
SELECT a, session_window.start, session_window.end, count(*) as cnt FROM VALUES ('A1', '2021-01-01 00:00:00'), ('A1', '2021-01-01 00:04:30'), ('A1', '2021-01-01 00:10:00'), ('A2', '2021-01-01 00:01:00') AS tab(a, b) GROUP by a, session_window(b, '5 minutes') ORDER BY a, start;
+---+-------------------+-------------------+---+
|  a|              start|                end|cnt|
+---+-------------------+-------------------+---+
| A1|2021-01-01 00:00:00|2021-01-01 00:09:30|  2|
| A1|2021-01-01 00:10:00|2021-01-01 00:15:00|  1|
| A2|2021-01-01 00:01:00|2021-01-01 00:06:00|  1|
+---+-------------------+-------------------+---+

SELECT a, session_window.start, session_window.end, count(*) as cnt FROM VALUES ('A1', '2021-01-01 00:00:00'), ('A1', '2021-01-01 00:04:30'), ('A1', '2021-01-01 00:10:00'), ('A2', '2021-01-01 00:01:00'), ('A2', '2021-01-01 00:04:30') AS tab(a, b) GROUP by a, session_window(b, CASE WHEN a = 'A1' THEN '5 minutes' WHEN a = 'A2' THEN '1 minute' ELSE '10 minutes' END) ORDER BY a, start;
+---+-------------------+-------------------+---+
|  a|              start|                end|cnt|
+---+-------------------+-------------------+---+
| A1|2021-01-01 00:00:00|2021-01-01 00:09:30|  2|
| A1|2021-01-01 00:10:00|2021-01-01 00:15:00|  1|
| A2|2021-01-01 00:01:00|2021-01-01 00:02:00|  1|
| A2|2021-01-01 00:04:30|2021-01-01 00:05:30|  1|
+---+-------------------+-------------------+---+

-- timestamp_micros
SELECT timestamp_micros(1230219000123123);
+----------------------------------+
|timestamp_micros(1230219000123123)|
+----------------------------------+
|              2008-12-25 15:30:...|
+----------------------------------+

-- timestamp_millis
SELECT timestamp_millis(1230219000123);
+-------------------------------+
|timestamp_millis(1230219000123)|
+-------------------------------+
|           2008-12-25 15:30:...|
+-------------------------------+

-- timestamp_seconds
SELECT timestamp_seconds(1230219000);
+-----------------------------+
|timestamp_seconds(1230219000)|
+-----------------------------+
|          2008-12-25 15:30:00|
+-----------------------------+

SELECT timestamp_seconds(1230219000.123);
+---------------------------------+
|timestamp_seconds(1230219000.123)|
+---------------------------------+
|             2008-12-25 15:30:...|
+---------------------------------+

-- to_date
SELECT to_date('2009-07-30 04:17:52');
+----------------------------+
|to_date(2009-07-30 04:17:52)|
+----------------------------+
|                  2009-07-30|
+----------------------------+

SELECT to_date('2016-12-31', 'yyyy-MM-dd');
+-------------------------------+
|to_date(2016-12-31, yyyy-MM-dd)|
+-------------------------------+
|                     2016-12-31|
+-------------------------------+

-- to_timestamp
SELECT to_timestamp('2016-12-31 00:12:00');
+---------------------------------+
|to_timestamp(2016-12-31 00:12:00)|
+---------------------------------+
|              2016-12-31 00:12:00|
+---------------------------------+

SELECT to_timestamp('2016-12-31', 'yyyy-MM-dd');
+------------------------------------+
|to_timestamp(2016-12-31, yyyy-MM-dd)|
+------------------------------------+
|                 2016-12-31 00:00:00|
+------------------------------------+

-- to_unix_timestamp
SELECT to_unix_timestamp('2016-04-08', 'yyyy-MM-dd');
+-----------------------------------------+
|to_unix_timestamp(2016-04-08, yyyy-MM-dd)|
+-----------------------------------------+
|                               1460073600|
+-----------------------------------------+

-- to_utc_timestamp
SELECT to_utc_timestamp('2016-08-31', 'Asia/Seoul');
+----------------------------------------+
|to_utc_timestamp(2016-08-31, Asia/Seoul)|
+----------------------------------------+
|                     2016-08-30 15:00:00|
+----------------------------------------+

-- trunc
SELECT trunc('2019-08-04', 'week');
+-----------------------+
|trunc(2019-08-04, week)|
+-----------------------+
|             2019-07-29|
+-----------------------+

SELECT trunc('2019-08-04', 'quarter');
+--------------------------+
|trunc(2019-08-04, quarter)|
+--------------------------+
|                2019-07-01|
+--------------------------+

SELECT trunc('2009-02-12', 'MM');
+---------------------+
|trunc(2009-02-12, MM)|
+---------------------+
|           2009-02-01|
+---------------------+

SELECT trunc('2015-10-27', 'YEAR');
+-----------------------+
|trunc(2015-10-27, YEAR)|
+-----------------------+
|             2015-01-01|
+-----------------------+

-- unix_date
SELECT unix_date(DATE("1970-01-02"));
+---------------------+
|unix_date(1970-01-02)|
+---------------------+
|                    1|
+---------------------+

-- unix_micros
SELECT unix_micros(TIMESTAMP('1970-01-01 00:00:01Z'));
+---------------------------------+
|unix_micros(1970-01-01 00:00:01Z)|
+---------------------------------+
|                          1000000|
+---------------------------------+

-- unix_millis
SELECT unix_millis(TIMESTAMP('1970-01-01 00:00:01Z'));
+---------------------------------+
|unix_millis(1970-01-01 00:00:01Z)|
+---------------------------------+
|                             1000|
+---------------------------------+

-- unix_seconds
SELECT unix_seconds(TIMESTAMP('1970-01-01 00:00:01Z'));
+----------------------------------+
|unix_seconds(1970-01-01 00:00:01Z)|
+----------------------------------+
|                                 1|
+----------------------------------+

-- unix_timestamp
SELECT unix_timestamp();
+--------------------------------------------------------+
|unix_timestamp(current_timestamp(), yyyy-MM-dd HH:mm:ss)|
+--------------------------------------------------------+
|                                              1642717503|
+--------------------------------------------------------+

SELECT unix_timestamp('2016-04-08', 'yyyy-MM-dd');
+--------------------------------------+
|unix_timestamp(2016-04-08, yyyy-MM-dd)|
+--------------------------------------+
|                            1460073600|
+--------------------------------------+

-- weekday
SELECT weekday('2009-07-30');
+-------------------+
|weekday(2009-07-30)|
+-------------------+
|                  3|
+-------------------+

-- weekofyear
SELECT weekofyear('2008-02-20');
+----------------------+
|weekofyear(2008-02-20)|
+----------------------+
|                     8|
+----------------------+

-- window
SELECT a, window.start, window.end, count(*) as cnt FROM VALUES ('A1', '2021-01-01 00:00:00'), ('A1', '2021-01-01 00:04:30'), ('A1', '2021-01-01 00:06:00'), ('A2', '2021-01-01 00:01:00') AS tab(a, b) GROUP by a, window(b, '5 minutes') ORDER BY a, start;
+---+-------------------+-------------------+---+
|  a|              start|                end|cnt|
+---+-------------------+-------------------+---+
| A1|2021-01-01 00:00:00|2021-01-01 00:05:00|  2|
| A1|2021-01-01 00:05:00|2021-01-01 00:10:00|  1|
| A2|2021-01-01 00:00:00|2021-01-01 00:05:00|  1|
+---+-------------------+-------------------+---+

SELECT a, window.start, window.end, count(*) as cnt FROM VALUES ('A1', '2021-01-01 00:00:00'), ('A1', '2021-01-01 00:04:30'), ('A1', '2021-01-01 00:06:00'), ('A2', '2021-01-01 00:01:00') AS tab(a, b) GROUP by a, window(b, '10 minutes', '5 minutes') ORDER BY a, start;
+---+-------------------+-------------------+---+
|  a|              start|                end|cnt|
+---+-------------------+-------------------+---+
| A1|2020-12-31 23:55:00|2021-01-01 00:05:00|  2|
| A1|2021-01-01 00:00:00|2021-01-01 00:10:00|  3|
| A1|2021-01-01 00:05:00|2021-01-01 00:15:00|  1|
| A2|2020-12-31 23:55:00|2021-01-01 00:05:00|  1|
| A2|2021-01-01 00:00:00|2021-01-01 00:10:00|  1|
+---+-------------------+-------------------+---+

-- year
SELECT year('2016-07-30');
+----------------+
|year(2016-07-30)|
+----------------+
|            2016|
+----------------+
 ```

## JSON Functions

| Function                               | Description                                                                                                                                    |
|----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| from\_json(jsonStr, schema[, options]) | Returns a struct value with the given \`jsonStr\` and \`schema\`.                                                                              |
| get\_json\_object(json\_txt, path)     | Extracts a json object from \`path\`.                                                                                                          |
| json\_array\_length(jsonArray)         | Returns the number of elements in the outermost JSON array.                                                                                    |
| json\_object\_keys(json\_object)       | Returns all the keys of the outermost JSON object as an array.                                                                                 |
| json\_tuple(jsonStr, p1, p2, ..., pn)  | Returns a tuple like the function get\_json\_object, but it takes multiple names. All the input parameters and output column types are string. |
| schema\_of\_json(json[, options])      | Returns schema in the DDL format of JSON string.                                                                                               |
| to\_json(expr[, options])              | Returns a JSON string with a given struct value                                                                                                |

### Examples

```sql
-- from_json
SELECT from_json('{"a":1, "b":0.8}', 'a INT, b DOUBLE');
+---------------------------+
|from_json({"a":1, "b":0.8})|
+---------------------------+
|                   {1, 0.8}|
+---------------------------+

SELECT from_json('{"time":"26/08/2015"}', 'time Timestamp', map('timestampFormat', 'dd/MM/yyyy'));
+--------------------------------+
|from_json({"time":"26/08/2015"})|
+--------------------------------+
|            {2015-08-26 00:00...|
+--------------------------------+

-- get_json_object
SELECT get_json_object('{"a":"b"}', '$.a');
+-------------------------------+
|get_json_object({"a":"b"}, $.a)|
+-------------------------------+
|                              b|
+-------------------------------+

-- json_array_length
SELECT json_array_length('[1,2,3,4]');
+----------------------------+
|json_array_length([1,2,3,4])|
+----------------------------+
|                           4|
+----------------------------+

SELECT json_array_length('[1,2,3,{"f1":1,"f2":[5,6]},4]');
+------------------------------------------------+
|json_array_length([1,2,3,{"f1":1,"f2":[5,6]},4])|
+------------------------------------------------+
|                                               5|
+------------------------------------------------+

SELECT json_array_length('[1,2');
+-----------------------+
|json_array_length([1,2)|
+-----------------------+
|                   null|
+-----------------------+

-- json_object_keys
SELECT json_object_keys('{}');
+--------------------+
|json_object_keys({})|
+--------------------+
|                  []|
+--------------------+

SELECT json_object_keys('{"key": "value"}');
+----------------------------------+
|json_object_keys({"key": "value"})|
+----------------------------------+
|                             [key]|
+----------------------------------+

SELECT json_object_keys('{"f1":"abc","f2":{"f3":"a", "f4":"b"}}');
+--------------------------------------------------------+
|json_object_keys({"f1":"abc","f2":{"f3":"a", "f4":"b"}})|
+--------------------------------------------------------+
|                                                [f1, f2]|
+--------------------------------------------------------+

-- json_tuple
SELECT json_tuple('{"a":1, "b":2}', 'a', 'b');
+---+---+
| c0| c1|
+---+---+
|  1|  2|
+---+---+

-- schema_of_json
SELECT schema_of_json('[{"col":0}]');
+---------------------------+
|schema_of_json([{"col":0}])|
+---------------------------+
|       ARRAY<STRUCT<`col...|
+---------------------------+

SELECT schema_of_json('[{"col":01}]', map('allowNumericLeadingZeros', 'true'));
+----------------------------+
|schema_of_json([{"col":01}])|
+----------------------------+
|        ARRAY<STRUCT<`col...|
+----------------------------+

-- to_json
SELECT to_json(named_struct('a', 1, 'b', 2));
+---------------------------------+
|to_json(named_struct(a, 1, b, 2))|
+---------------------------------+
|                    {"a":1,"b":2}|
+---------------------------------+

SELECT to_json(named_struct('time', to_timestamp('2015-08-26', 'yyyy-MM-dd')), map('timestampFormat', 'dd/MM/yyyy'));
+-----------------------------------------------------------------+
|to_json(named_struct(time, to_timestamp(2015-08-26, yyyy-MM-dd)))|
+-----------------------------------------------------------------+
|                                             {"time":"26/08/20...|
+-----------------------------------------------------------------+

SELECT to_json(array(named_struct('a', 1, 'b', 2)));
+----------------------------------------+
|to_json(array(named_struct(a, 1, b, 2)))|
+----------------------------------------+
|                         [{"a":1,"b":2}]|
+----------------------------------------+

SELECT to_json(map('a', named_struct('b', 1)));
+-----------------------------------+
|to_json(map(a, named_struct(b, 1)))|
+-----------------------------------+
|                      {"a":{"b":1}}|
+-----------------------------------+

SELECT to_json(map(named_struct('a', 1),named_struct('b', 2)));
+----------------------------------------------------+
|to_json(map(named_struct(a, 1), named_struct(b, 2)))|
+----------------------------------------------------+
|                                     {"[1]":{"b":2}}|
+----------------------------------------------------+

SELECT to_json(map('a', 1));
+------------------+
|to_json(map(a, 1))|
+------------------+
|           {"a":1}|
+------------------+

SELECT to_json(array((map('a', 1))));
+-------------------------+
|to_json(array(map(a, 1)))|
+-------------------------+
|                [{"a":1}]|
+-------------------------+
```

