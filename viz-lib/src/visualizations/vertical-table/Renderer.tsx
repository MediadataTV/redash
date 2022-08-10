import { filter, map, get, initial, last, reduce } from "lodash";
import React, { useMemo, useState, useEffect } from "react";
import Table from "antd/lib/table";
import Input from "antd/lib/input";
import InfoCircleFilledIcon from "@ant-design/icons/InfoCircleFilled";
import Popover from "antd/lib/popover";
import { RendererPropTypes } from "@/visualizations/prop-types";

import { prepareColumns, initRows } from "./utils";

import "../table/renderer.less";
import Descriptions from "antd/lib/descriptions";
import Pagination from "antd/lib/pagination";

function joinColumns(array: any, separator = ", ") {
  return reduce(
    array,
    (result, item, index) => {
      // @ts-expect-error ts-migrate(2365) FIXME: Operator '>' cannot be applied to types 'string' a... Remove this comment to see the full error message
      if (index > 0) {
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        result.push(separator);
      }
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
      result.push(item);
      return result;
    },
    []
  );
}

function getSearchColumns(columns: any, { limit = Infinity, renderColumn = (col: any) => col.title } = {}) {
  const firstColumns = map(columns.slice(0, limit), col => renderColumn(col));
  const restColumns = map(columns.slice(limit), col => col.title);
  if (restColumns.length > 0) {
    return [...joinColumns(firstColumns), ` and ${restColumns.length} others`];
  }
  if (firstColumns.length > 1) {
    return [...joinColumns(initial(firstColumns)), ` and `, last(firstColumns)];
  }
  return firstColumns;
}

function SearchInputInfoIcon({ searchColumns }: any) {
  return (
    <Popover
      arrowPointAtCenter
      placement="topRight"
      content={
        <div className="table-visualization-search-info-content">
          Search {getSearchColumns(searchColumns, { renderColumn: col => <code key={col.name}>{col.title}</code> })}
        </div>
      }>
      <InfoCircleFilledIcon className="table-visualization-search-info-icon" />
    </Popover>
  );
}

type OwnSearchInputProps = {
  onChange?: (...args: any[]) => any;
};

type SearchInputProps = OwnSearchInputProps & typeof SearchInput.defaultProps;

// @ts-expect-error ts-migrate(2339) FIXME: Property 'searchColumns' does not exist on type 'S... Remove this comment to see the full error message
function SearchInput({ searchColumns, ...props }: SearchInputProps) {
  if (searchColumns.length <= 0) {
    return null;
  }

  const searchColumnsLimit = 3;
  return (
    <Input.Search
      {...props}
      placeholder={`Search ${getSearchColumns(searchColumns, { limit: searchColumnsLimit }).join("")}...`}
      suffix={searchColumns.length > searchColumnsLimit ? <SearchInputInfoIcon searchColumns={searchColumns} /> : null}
    />
  );
}

SearchInput.defaultProps = {
  onChange: () => {},
};

export default function Renderer({ options, data }: any) {
  const [page, setPage] = useState(0);

  const tableColumns = useMemo(() => {
    return prepareColumns(options.columns);
  }, [options.columns]);

  // let preparedRow = initRows([data.rows[0]]);
  const preparedRow = data.rows[page];
  return (
    <div className="details-viz">
      <Descriptions size="small" column={options.columnsNumber} bordered>
        {map(tableColumns, column => {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'render' does not exist on type '{ key: a... Remove this comment to see the full error message
          let value = column.render(preparedRow);
          return (
            <Descriptions.Item key={column.key} label={column.title}>
              {value({row: preparedRow})}
            </Descriptions.Item>
          );
          }
        )}
      </Descriptions>
      {data.rows.length > 1 && (
        <div className="paginator-container">
          <Pagination
            showSizeChanger={false}
            current={page + 1}
            defaultPageSize={1}
            total={data.rows.length}
            onChange={p => setPage(p - 1)}
          />
        </div>
      )}
    </div>
  );
}

Renderer.propTypes = RendererPropTypes;
