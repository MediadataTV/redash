import { isNil, map, get, filter, each, some, findIndex, toString } from "lodash";
import React from "react";
import cx from "classnames";
import Tooltip from "antd/lib/tooltip";
import ColumnTypes from "../table//columns";

export function prepareColumns(columns: any) {
  columns = filter(columns, "visible");

  let tableColumns = map(columns, column => {

    const result = {
      key: column.name,
      dataIndex: `record[${JSON.stringify(column.name)}]`,
      align: column.alignContent,
      title: column.title,
    };

    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const initColumn = ColumnTypes[column.displayAs];
    const Component = initColumn(column);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'old_render' does not exist on type '{ key: a... Remove this comment to see the full error message
    result.old_render = (unused: any, row: any) => ({
      children: <Component row={row.record} />,
      props: { className: `display-as-${column.displayAs}` },
    });;

    //{ColumnTypes[column.displayAs](column).prepareData(row)}
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'render' does not exist on type '{ key: a... Remove this comment to see the full error message
    result.render = (row: any) => ( ColumnTypes[column.displayAs](column) )

    return result;
  });

  return tableColumns;
}

export function initRows(rows: any) {
  return map(rows, (record, index) => ({ key: `record${index}`, record }));
}
