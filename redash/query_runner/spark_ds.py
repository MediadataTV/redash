import logging

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


class Spark(BaseSQLQueryRunner):
    should_annotate_query = False
    noop_query = "SELECT 1"

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


register(Spark)
