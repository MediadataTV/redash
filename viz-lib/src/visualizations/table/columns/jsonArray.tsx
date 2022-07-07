import _, { isString, isUndefined } from "lodash";
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Section, Input, ControlLabel, ContextHelp } from "@/components/visualizations/editor";
import { visualizationsSettings } from "@/visualizations/visualizationsSettings";
import { formatSimpleTemplate } from "@/lib/value-format";

type Props = {
  column: {
    name: string;
    JsonArrayFieldPath: string;
  };
  onChange: (...args: any[]) => any;
};

export default function initJsonArrayColumn(column: any) {
  function prepareData(row: any) {
    const text = row[column.name];
    if (isString(text) && text.length <= visualizationsSettings.tableCellMaxJSONSize) {
      try {
        let jsonValue = JSON.parse(text);
        if(isUndefined(jsonValue)){
          return { text, value: undefined };
        }
        var value=null;
        if(Array.isArray(jsonValue)){
          value = jsonValue.map( item => {
            if(!_.isObject(item)){
              return item;
            }else{
              // return _.get(item, column.JsonArrayFieldPath);
              return formatSimpleTemplate(column.JsonArrayFieldPath, item);
            }
          } );
        }else{
          // value = _.get(jsonValue, column.JsonArrayFieldPath);
          value = [formatSimpleTemplate(column.JsonArrayFieldPath, jsonValue)];
        }
        return { text, value: value };
      } catch (e) {
        // ignore `JSON.parse` error and return default value
      }
    }
    return { text, value: undefined };
  }

  function JsonArrayColumn({ row }: any) {
    // eslint-disable-line react/prop-types
    const { text, value } = prepareData(row);
    if (isUndefined(value)) {
      return <div className="json-cell-invalid">{"" + text}</div>;
    }

    return (
      <div className="json-cell-valid">
        <ul className="array-element">
        {value ? value.map((val:any, k:any) => (
                    <li key={k}>
                        {val}
                    </li>
                )) : text}
        </ul>
      </div>
    );
  }

  JsonArrayColumn.prepareData = prepareData;

  return JsonArrayColumn;
}

function Editor({ column, onChange }: Props) {
  const [onChangeDebounced] = useDebouncedCallback(onChange, 200);

  return (
    <React.Fragment>
      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
      <Input
          label="Field path"
          data-test="Table.ColumnEditor.JsonArray.FieldPath"
          defaultValue={column.JsonArrayFieldPath}
          onChange={(event: any) => onChangeDebounced({ JsonArrayFieldPath: event.target.value })}
        />
      </Section>
    </React.Fragment>
  );
}

initJsonArrayColumn.friendlyName = "JSONArray";
initJsonArrayColumn.Editor = Editor;
