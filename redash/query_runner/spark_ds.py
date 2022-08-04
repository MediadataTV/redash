import logging

from pyspark.sql import SparkSession
import tempfile
import json
import sqlparse
from delta import *

from redash.models import SQLAcl, SQLAclPermission
from redash.query_runner import *
from redash.utils import json_dumps

logger = logging.getLogger(__name__)

try:
    from pyhive import hive
    from pyhive.exc import DatabaseError
    from thrift.transport import THttpClient

    enabled = True
except ImportError:
    enabled = False

COLUMN_NAME = 0
COLUMN_TYPE = 1

types_map = {
    "BIGINT_TYPE": TYPE_INTEGER,
    "TINYINT_TYPE": TYPE_INTEGER,
    "SMALLINT_TYPE": TYPE_INTEGER,
    "INT_TYPE": TYPE_INTEGER,
    "DOUBLE_TYPE": TYPE_FLOAT,
    "DECIMAL_TYPE": TYPE_FLOAT,
    "FLOAT_TYPE": TYPE_FLOAT,
    "REAL_TYPE": TYPE_FLOAT,
    "BOOLEAN_TYPE": TYPE_BOOLEAN,
    "TIMESTAMP_TYPE": TYPE_DATETIME,
    "DATE_TYPE": TYPE_DATE,
    "CHAR_TYPE": TYPE_STRING,
    "STRING_TYPE": TYPE_STRING,
    "VARCHAR_TYPE": TYPE_STRING,
}

acl_map = {
    'org.apache.spark.sql.execution.command.SetCommand':
        {'children': None, 'acl': SQLAcl.SET, 'sql_sample': 'SET'},
    'org.apache.spark.sql.catalyst.plans.logical.UseStatement':
        {'children': None, 'acl': SQLAcl.USE, 'sql_sample': 'USE'},
    'org.apache.spark.sql.catalyst.plans.logical.CreateNamespaceStatement':
        {'children': None, 'acl': SQLAcl.DDL_SCHEMAS, 'sql_sample': 'CREATE DATABASE'},
    'org.apache.spark.sql.catalyst.plans.logical.DescribeFunction':
        {'children': None, 'acl': SQLAcl.DESCRIBE, 'sql_sample': 'DESCRIBE FUNCTION'},
    'org.apache.spark.sql.catalyst.plans.logical.CreateFunctionStatement':
        {'children': None, 'acl': SQLAcl.DDL_FUNCTIONS, 'sql_sample': 'CREATE FUNCTION'},
    'org.apache.spark.sql.catalyst.plans.logical.DropFunction':
        {'children': None, 'acl': SQLAcl.DDL_FUNCTIONS, 'sql_sample': 'DROP FUNCTION'},
    'org.apache.spark.sql.catalyst.plans.logical.ShowFunctions':
        {'children': None, 'acl': SQLAcl.DESCRIBE, 'sql_sample': 'SHOW FUNCTION'},
    'org.apache.spark.sql.catalyst.plans.logical.DescribeNamespace':
        {'children': None, 'acl': SQLAcl.DESCRIBE, 'sql_sample': 'DESCRIBE DATABASE'},
    'org.apache.spark.sql.catalyst.plans.logical.SetNamespaceProperties':
        {'children': None, 'acl': SQLAcl.DDL_SCHEMAS, 'sql_sample': 'ALTER DATABASE SET DBPROPERTIES'},
    'org.apache.spark.sql.catalyst.plans.logical.SetNamespaceLocation':
        {'children': None, 'acl': SQLAcl.DDL_SCHEMAS, 'sql_sample': 'ALTER DATABASE SET LOCATION'},
    'org.apache.spark.sql.catalyst.plans.logical.ShowPartitions':
        {'children': None, 'acl': SQLAcl.DESCRIBE, 'sql_sample': 'SHOW PARTITIONS'},
    'org.apache.spark.sql.catalyst.plans.logical.RenameTable':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'ALTER TABLE RENAME TO'},
    'org.apache.spark.sql.catalyst.plans.logical.RenamePartitions':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'ALTER TABLE PARTITION RENAME TO PARTITION'},
    'org.apache.spark.sql.catalyst.plans.logical.AddColumns':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'ALTER TABLE ADD columns'},
    'org.apache.spark.sql.catalyst.plans.logical.ReplaceColumns':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'ALTER TABLE ... REPLACE COLUMNS'},
    'org.apache.spark.sql.catalyst.plans.logical.RenameColumn':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'ALTER TABLE ... RENAME COLUMN'},
    'org.apache.spark.sql.catalyst.plans.logical.AddPartitions':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'ALTER TABLE ADD IF NOT EXISTS PARTITION'},
    'org.apache.spark.sql.catalyst.plans.logical.DropPartitions':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'ALTER TABLE DROP IF EXISTS PARTITION'},
    'org.apache.spark.sql.catalyst.plans.logical.AlterColumn':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'ALTER TABLE ALTER COLUMN'},
    'org.apache.spark.sql.catalyst.plans.logical.DropColumns':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'ALTER TABLE DROP COLUMN'},
    'org.apache.spark.sql.catalyst.plans.logical.SetTableLocation':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'ALTER TABLE SET LOCATION'},
    'org.apache.spark.sql.catalyst.plans.logical.SetTableSerDeProperties':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'ALTER TABLE SET SERDE '},
    'org.apache.spark.sql.catalyst.plans.logical.SetTableProperties':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'ALTER TABLE SET TBLPROPERTIES'},
    'org.apache.spark.sql.catalyst.plans.logical.UnsetTableProperties':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'ALTER TABLE UNSET TBLPROPERTIES'},
    'org.apache.spark.sql.catalyst.plans.logical.DescribeRelation':
        {'children': None, 'acl': SQLAcl.DESCRIBE, 'sql_sample': 'DESCRIBE TABLE'},
    'org.apache.spark.sql.catalyst.plans.logical.DescribeColumn':
        {'children': None, 'acl': SQLAcl.DESCRIBE, 'sql_sample': 'DESCRIBE <tablename> <tablename>.<column>'},
    'org.apache.spark.sql.execution.command.DescribeQueryCommand':
        {'children': None, 'acl': SQLAcl.DESCRIBE, 'sql_sample': 'DESCRIBE QUERY'},
    'org.apache.spark.sql.catalyst.plans.logical.SetViewProperties':
        {'children': None, 'acl': SQLAcl.DDL_VIEWS, 'sql_sample': 'ALTER VIEW SET TBLPROPERTIES'},
    'org.apache.spark.sql.catalyst.plans.logical.UnsetViewProperties':
        {'children': None, 'acl': SQLAcl.DDL_VIEWS, 'sql_sample': 'ALTER VIEW UNSET TBLPROPERTIES'},
    'org.apache.spark.sql.catalyst.plans.logical.AlterViewAs':
        {'children': None, 'acl': SQLAcl.DDL_VIEWS, 'sql_sample': 'ALTER VIEW AS'},
    'org.apache.spark.sql.catalyst.plans.logical.Project':
        {'children': 'projectList', 'acl': SQLAcl.SELECT, 'sql_sample': 'SELECT AS FROM', },
    'org.apache.spark.sql.catalyst.plans.logical.CreateTableStatement':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'CREATE TABLE '},
    'org.apache.spark.sql.catalyst.plans.logical.CreateTableAsSelectStatement':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'CREATE TABLE AS SELECT'},
    'org.apache.spark.sql.execution.command.AddJarsCommand':
        {'children': None, 'acl': SQLAcl.DATA_ADD, 'sql_sample': 'ADD JAR'},
    'org.apache.spark.sql.execution.command.CreateTableLikeCommand':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'CREATE TABLE LIKE'},
    'org.apache.spark.sql.catalyst.plans.logical.DropTable':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'DROP TABLE'},
    'org.apache.spark.sql.catalyst.plans.logical.CreateViewStatement':
        {'children': None, 'acl': SQLAcl.DDL_VIEWS, 'sql_sample': 'CREATE VIEW'},
    'org.apache.spark.sql.catalyst.plans.logical.Filter':
        {'children': 'condition', 'acl': SQLAcl.SELECT, 'sql_sample': 'WHERE', },
    'org.apache.spark.sql.catalyst.analysis.UnresolvedNamespace':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'DESCRIBE DATABASE'},
    'org.apache.spark.sql.catalyst.analysis.UnresolvedTable':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'SHOW PARTITIONS <TBLNAME>'},
    'org.apache.spark.sql.catalyst.analysis.UnresolvedView':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'ALTER VIEW <VIEWNAME>'},
    'org.apache.spark.sql.catalyst.analysis.UnresolvedRelation':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': '<TBLNAME|FIELDNAME|FUNCNAME>'},
    'org.apache.spark.sql.catalyst.analysis.UnresolvedInlineTable':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': '<TBLNAME>'},
    'org.apache.spark.sql.catalyst.plans.logical.Join':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'JOIN'},
    'org.apache.spark.sql.catalyst.plans.logical.SubqueryAlias':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'FROM <TBLNAME> AS'},
    'org.apache.spark.sql.catalyst.plans.logical.DropView':
        {'children': None, 'acl': SQLAcl.DDL_VIEWS, 'sql_sample': 'DROP VIEW'},
    'org.apache.spark.sql.catalyst.plans.logical.RepairTable':
        {'children': None, 'acl': SQLAcl.OPTIMIZE, 'sql_sample': 'REPAIR TABLE'},
    'org.apache.spark.sql.catalyst.plans.logical.TruncatePartition':
        {'children': None, 'acl': SQLAcl.TRUNCATE, 'sql_sample': 'TRUNCATE TABLE <TBLNAME> partition'},
    'org.apache.spark.sql.catalyst.plans.logical.TruncateTable':
        {'children': None, 'acl': SQLAcl.TRUNCATE, 'sql_sample': 'TRUNCATE TABLE <TBLNAME>'},
    'org.apache.spark.sql.catalyst.plans.logical.DropNamespace':
        {'children': None, 'acl': SQLAcl.DDL_SCHEMAS, 'sql_sample': 'DROP DATABASE'},
    'org.apache.spark.sql.catalyst.plans.logical.InsertIntoStatement':
        {'children': None, 'acl': SQLAcl.DML, 'sql_sample': 'INSERT INTO'},
    'org.apache.spark.sql.catalyst.plans.logical.InsertIntoDir':
        {'children': None, 'acl': SQLAcl.DML, 'sql_sample': 'INSERT OVERWRITE DIRECTORY'},
    'org.apache.spark.sql.catalyst.plans.logical.DeleteFromTable':
        {'children': None, 'acl': SQLAcl.DML, 'sql_sample': 'DELETE FROM'},
    'org.apache.spark.sql.catalyst.plans.logical.UpdateTable':
        {'children': None, 'acl': SQLAcl.DML, 'sql_sample': 'UPDATE ... SET'},
    'org.apache.spark.sql.catalyst.plans.logical.MergeIntoTable':
        {'children': None, 'acl': SQLAcl.DML, 'sql_sample': 'MERGE INTO'},
    'org.apache.spark.sql.catalyst.plans.logical.UpdateAction':
        {'children': None, 'acl': SQLAcl.DML, 'sql_sample': 'WHEN MATCHED THEN UPDATE'},
    'org.apache.spark.sql.catalyst.plans.logical.InsertAction':
        {'children': None, 'acl': SQLAcl.DML, 'sql_sample': 'WHEN NOT MATCHED THEN INSERT ... VALUES'},
    'org.apache.spark.sql.catalyst.plans.logical.InsertStarAction':
        {'children': None, 'acl': SQLAcl.DML, 'sql_sample': 'WHEN NOT MATCHED THEN INSERT *'},
    'org.apache.spark.sql.catalyst.plans.logical.Assignment':
        {'children': None, 'acl': SQLAcl.DML, 'sql_sample': 'SET|VALUES'},
    'org.apache.spark.sql.catalyst.plans.logical.LoadData':
        {'children': None, 'acl': SQLAcl.DATA_LOAD, 'sql_sample': 'LOAD DATA'},
    'org.apache.spark.sql.catalyst.plans.logical.UnresolvedWith':
        {'children': 'cteRelations', 'acl': SQLAcl.SELECT, 'sql_sample': 'WITH', },
    'org.apache.spark.sql.catalyst.plans.logical.OneRowRelation':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'SELECT ...[without a from clause]'},
    'org.apache.spark.sql.catalyst.expressions.ScalarSubquery':
        {'children': 'plan', 'acl': SQLAcl.SELECT, 'sql_sample': '(SELECT 1)', },
    'org.apache.spark.sql.catalyst.analysis.UnresolvedAlias':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'AS <ALIASNAME>'},
    'org.apache.spark.sql.catalyst.analysis.UnresolvedStar':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'SELECT *'},
    'org.apache.spark.sql.catalyst.plans.logical.Sort':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'ORDER BY'},
    'org.apache.spark.sql.catalyst.expressions.Exists':
        {'children': 'plan', 'acl': SQLAcl.SELECT, 'sql_sample': 'EXISTS', },
    'org.apache.spark.sql.catalyst.plans.logical.Aggregate':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'GROUP BY'},
    'org.apache.spark.sql.catalyst.expressions.GroupingSets':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'GROUPING SETS'},
    'org.apache.spark.sql.catalyst.expressions.Rollup':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'WITH ROLLUP'},
    'org.apache.spark.sql.catalyst.expressions.Cube':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'WITH CUBE'},
    'org.apache.spark.sql.catalyst.expressions.aggregate.First':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'FIRST(x)'},
    'org.apache.spark.sql.catalyst.expressions.aggregate.AggregateExpression':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': ''},
    'org.apache.spark.sql.catalyst.analysis.UnresolvedFunction':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'ej SUM(x)'},
    'org.apache.spark.sql.catalyst.analysis.UnresolvedFunc':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'REFRESH FUNCTION'},
    'org.apache.spark.sql.catalyst.expressions.aggregate.Last':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'LAST(x)'},
    'org.apache.spark.sql.catalyst.plans.logical.RepartitionByExpression':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'CLUSTER BY|DISTRIBUTE BY'},
    'org.apache.spark.sql.catalyst.analysis.UnresolvedHaving':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'HAVING'},
    'org.apache.spark.sql.catalyst.plans.logical.UnresolvedHint':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': '/*+ COALESCE(3) */'},
    'org.apache.spark.sql.catalyst.expressions.Like':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'LIKE'},
    'org.apache.spark.sql.catalyst.expressions.Not':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'NOT'},
    'org.apache.spark.sql.catalyst.expressions.RLike':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'RLIKE'},
    'org.apache.spark.sql.catalyst.expressions.LikeAll':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'LIKE ALL'},
    'org.apache.spark.sql.catalyst.expressions.LikeAny':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'LIKE ANY'},
    'org.apache.spark.sql.catalyst.expressions.NotLikeAll':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'NOT LIKE ALL'},
    'org.apache.spark.sql.catalyst.expressions.NotLikeAny':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'NOT LIKE ANY'},
    'org.apache.spark.sql.catalyst.plans.logical.GlobalLimit':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'LIMIT'},
    'org.apache.spark.sql.catalyst.plans.logical.LocalLimit':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'LIMIT'},
    'org.apache.spark.sql.catalyst.plans.logical.Except':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'EXCEPT'},
    'org.apache.spark.sql.catalyst.plans.logical.Intersect':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'INTERSECT'},
    'org.apache.spark.sql.catalyst.plans.logical.Distinct':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'DISTINCT'},
    'org.apache.spark.sql.catalyst.plans.logical.Union':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'UNION'},
    'org.apache.spark.sql.catalyst.plans.logical.Sample':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'TABLESAMPLE'},
    'org.apache.spark.sql.catalyst.analysis.UnresolvedTableValuedFunction':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'range(6 + cos(3))'},
    'org.apache.spark.sql.catalyst.expressions.CreateNamedStruct':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'struct(1, "a")'},
    'org.apache.spark.sql.catalyst.plans.logical.Generate':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'LATERAL VIEW'},
    'org.apache.spark.sql.catalyst.analysis.UnresolvedGenerator':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'ej: explode(x)'},
    'org.apache.spark.sql.catalyst.expressions.WindowExpression':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'OVER'},
    'org.apache.spark.sql.catalyst.expressions.WindowSpecDefinition':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'x [OVER] x'},
    'org.apache.spark.sql.catalyst.expressions.SpecifiedWindowFrame':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'RANGE BETWEEN UNBOUNDED ...'},
    'org.apache.spark.sql.catalyst.plans.logical.WithWindowDefinition':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'WINDOW'},
    'org.apache.spark.sql.catalyst.expressions.UnresolvedWindowExpression':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': '[WINDOW] x'},
    'org.apache.spark.sql.catalyst.expressions.CaseWhen':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'CASE WHEN'},
    'org.apache.spark.sql.catalyst.plans.logical.Pivot':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'PIVOT ()'},
    'org.apache.spark.sql.catalyst.plans.logical.ScriptTransformation':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'TRANSFORM()'},
    'org.apache.spark.sql.execution.command.ExplainCommand':
        {'children': 'logicalPlan', 'acl': SQLAcl.OPTIMIZE, 'sql_sample': 'EXPLAIN', },
    'org.apache.spark.sql.execution.command.AddFilesCommand':
        {'children': None, 'acl': SQLAcl.DATA_ADD, 'sql_sample': 'ADD FILE'},
    'org.apache.spark.sql.catalyst.plans.logical.AnalyzeTable':
        {'children': None, 'acl': SQLAcl.OPTIMIZE, 'sql_sample': 'ANALYZE TABLE'},
    'org.apache.spark.sql.catalyst.analysis.UnresolvedTableOrView':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': '[TABLENAME|VIEWNAME]'},
    'org.apache.spark.sql.catalyst.plans.logical.AnalyzeColumn':
        {'children': None, 'acl': SQLAcl.OPTIMIZE, 'sql_sample': 'ANALYZE TABLE [...] FOR COLUMNS'},
    'org.apache.spark.sql.catalyst.plans.logical.AnalyzeTables':
        {'children': None, 'acl': SQLAcl.OPTIMIZE, 'sql_sample': 'ANALYZE TABLES'},
    'org.apache.spark.sql.catalyst.plans.logical.CacheTableAsSelect':
        {'children': None, 'acl': SQLAcl.CACHE, 'sql_sample': 'CACHE TABLE'},
    'org.apache.spark.sql.execution.command.ClearCacheCommand$':
        {'children': None, 'acl': SQLAcl.CACHE, 'sql_sample': 'CLEAR CACHE'},
    'org.apache.spark.sql.execution.command.ListFilesCommand':
        {'children': None, 'acl': SQLAcl.DATA_LOAD, 'sql_sample': 'LIST FILE'},
    'org.apache.spark.sql.execution.command.ListJarsCommand':
        {'children': None, 'acl': SQLAcl.DATA_LOAD, 'sql_sample': 'LIST JAR'},
    'org.apache.spark.sql.execution.datasources.RefreshResource':
        {'children': None, 'acl': SQLAcl.OPTIMIZE, 'sql_sample': 'REFRESH \"hdfs:/"'},
    'org.apache.spark.sql.catalyst.plans.logical.RefreshTable':
        {'children': None, 'acl': SQLAcl.OPTIMIZE, 'sql_sample': 'REFRESH TABLE'},
    'org.apache.spark.sql.catalyst.plans.logical.RefreshFunction':
        {'children': None, 'acl': SQLAcl.OPTIMIZE, 'sql_sample': 'REFRESH FUNCTION'},
    'org.apache.spark.sql.execution.command.ResetCommand':
        {'children': None, 'acl': SQLAcl.SET, 'sql_sample': 'RESET'},
    'org.apache.spark.sql.catalyst.plans.logical.ShowColumns':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'SHOW COLUMNS'},
    'org.apache.spark.sql.catalyst.plans.logical.ShowCreateTable':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'SHOW CREATE TABLE'},
    'org.apache.spark.sql.catalyst.plans.logical.ShowNamespaces':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'SHOW DATABASES'},
    'org.apache.spark.sql.catalyst.plans.logical.ShowTableExtended':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'SHOW TABLE EXTENDED'},
    'org.apache.spark.sql.catalyst.plans.logical.ShowTables':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'SHOW TABLES'},
    'org.apache.spark.sql.catalyst.plans.logical.ShowTableProperties':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'SHOW TBLPROPERTIES'},
    'org.apache.spark.sql.catalyst.plans.logical.ShowViews':
        {'children': None, 'acl': SQLAcl.SELECT, 'sql_sample': 'SHOW VIEWS'},
    'org.apache.spark.sql.catalyst.plans.logical.UncacheTable':
        {'children': None, 'acl': SQLAcl.CACHE, 'sql_sample': 'UNCACHE TABLE'},
    'io.delta.tables.execution.VacuumTableCommand':
        {'children': None, 'acl': SQLAcl.TRUNCATE, 'sql_sample': 'VACUUM <TABLENAME>'},
    'org.apache.spark.sql.delta.commands.DeltaGenerateCommand':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'GENERATE symlink_format_manifest FOR TABLE'},
    'org.apache.spark.sql.delta.commands.ConvertToDeltaCommand':
        {'children': None, 'acl': SQLAcl.DDL_TABLES, 'sql_sample': 'CONVERT TO DELTA'},
    'org.apache.spark.sql.delta.commands.OptimizeTableCommand':
        {'children': None, 'acl': SQLAcl.OPTIMIZE, 'sql_sample': 'OPTIMIZE <TABLENAME>'},
}


class Spark(BaseSQLQueryRunner):
    should_annotate_query = False
    noop_query = "SELECT 1"
    spark_session = None

    def __init__(self, configuration):
        super(Spark, self).__init__(configuration)
        warehouse_location = 'file:{}/spark-warehouse'.format(tempfile.gettempdir())
        # print(warehouse_location)
        builder = SparkSession.builder \
            .master("local[*]") \
            .appName("SqlTest") \
            .config("spark.sql.warehouse.dir", warehouse_location) \
            .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
            .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
        self.spark_session = configure_spark_with_delta_pip(builder.enableHiveSupport()).getOrCreate()

    @classmethod
    def configuration_schema(cls):
        return {
            "type": "object",
            "properties": {
                "host": {"type": "string"},
                "port": {"type": "number"},
                "database": {"type": "string"},
                "username": {"type": "string"},
            },
            "order": ["host", "port", "database", "username"],
            "required": ["host"],
        }

    @classmethod
    def type(cls):
        return "spark"

    @classmethod
    def enabled(cls):
        return enabled

    def _get_tables(self, schema):
        schemas_query = "show schemas"

        tables_query = "show tables in %s"

        columns_query = "DESCRIBE %s.%s"

        for schema_name in [
            a
            for a in [
                str(a["namespace"]) for a in self._run_query_internal(schemas_query)
            ]
            if len(a) > 0
        ]:
            for table_name in [
                a
                for a in [
                    str(a["tableName"])
                    for a in self._run_query_internal(tables_query % schema_name)
                ]
                if len(a) > 0
            ]:
                columns = []
                query_columns = self._run_query_internal(
                    columns_query % (schema_name, table_name)
                )

                for c in query_columns:
                    col_name = str(c['col_name'])
                    if col_name != '':
                        columns.append(col_name)
                    else:
                        break

                if schema_name != "default":
                    table_name = "{}.{}".format(schema_name, table_name)

                schema[table_name] = {"name": table_name, "columns": columns}
        return list(schema.values())

    def _get_connection(self):
        host = self.configuration["host"]

        connection = hive.connect(
            host=host,
            port=self.configuration.get("port", None),
            database=self.configuration.get("database", "default"),
            username=self.configuration.get("username", None),
        )

        return connection

    def run_query(self, query, user):
        connection = None
        try:
            connection = self._get_connection()
            cursor = connection.cursor()

            cursor.execute(query)

            column_names = []
            columns = []

            for column in cursor.description:
                column_name = column[COLUMN_NAME]
                column_names.append(column_name)

                columns.append(
                    {
                        "name": column_name,
                        "friendly_name": column_name,
                        "type": types_map.get(column[COLUMN_TYPE], None),
                    }
                )

            rows = [dict(zip(column_names, row)) for row in cursor]

            data = {"columns": columns, "rows": rows}
            json_data = json_dumps(data)
            error = None
        except (KeyboardInterrupt, JobTimeoutException):
            if connection:
                connection.cancel()
            raise
        except DatabaseError as e:
            try:
                error = e.args[0].status.errorMessage
            except AttributeError:
                error = str(e)
            json_data = None
        finally:
            if connection:
                connection.close()

        return json_data, error

    def check_query_acl(self, query_str, query_acl):
        status = True
        error = ''
        plans = []

        def parse_plan(plan_list):
            for item in plan_list:
                plans.append(item)
                map_data = acl_map.get(item['class'])
                if map_data is not None:
                    acl_type = map_data['acl'].value
                    if query_acl[acl_type] is not None:
                        if query_acl[acl_type]['acl_permission'] == SQLAclPermission.DENY.value:
                            return False, "Query type `{}` is not allowed by ACL config\n[class: {}]".format(
                                map_data['acl'].value,
                                item['class']
                            )
                        if query_acl[acl_type]['children'] is not None:
                            parse_plan(item[query_acl[acl_type]['children']])

            return True, ''

        for query in sqlparse.split(query_str):
            try:
                plan = self.spark_session._jsparkSession.sessionState().sqlParser().parsePlan(query)
                status, error = parse_plan(json.loads(plan.toJSON()))
            except Exception as e:
                pass

        return status, error


register(Spark)
