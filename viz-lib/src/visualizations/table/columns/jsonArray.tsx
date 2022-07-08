import _, { isString, isUndefined } from "lodash";
import React from "react";
import { markdown } from "markdown";
import { useDebouncedCallback } from "use-debounce";
import { Section, Input, ControlLabel, ContextHelp, Switch } from "@/components/visualizations/editor";
import { visualizationsSettings } from "@/visualizations/visualizationsSettings";
import { formatSimpleTemplate } from "@/lib/value-format";
import HtmlContent from "@/components/HtmlContent";

type Props = {
  column: {
    name: string;
    jsonArrayFieldPath: string;
    enableParseMarkdown: boolean;
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
              // return _.get(item, column.jsonArrayFieldPath);
              return formatSimpleTemplate(column.jsonArrayFieldPath, item);
            }
          });
        }else{
          // value = _.get(jsonValue, column.jsonArrayFieldPath);
          value = [formatSimpleTemplate(column.jsonArrayFieldPath, jsonValue)];
        }
        return { text, value: value };
      } catch (e) {
        // ignore `JSON.parse` error and return default value
      }
    }
    return { text, value: undefined };
  }

  function processText(text: string){
    if(column.enableParseMarkdown){
      return (<HtmlContent>{markdown.toHTML(text)}</HtmlContent>);
    }
    return text;
  }

  function JsonArrayColumn({ row }: any) {
    

    // eslint-disable-line react/prop-types
    const { text, value } = prepareData(row);
    if (isUndefined(value)) {
      return <div className="json-cell-invalid">{"" + text}</div>;
    }

    return (
      <div className="json-cell-valid">

        {value ? 
          (value.length>1) ?
          <ul className="array-element">
            {value.map((val:any, k:any) => (<li key={k}>{processText(val)}</li>))}
          </ul>
          :
          value.map((val:any, k:any) => (<span key={k}>{processText(val)}</span>)) 
        : text}
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
          defaultValue={column.jsonArrayFieldPath}
          onChange={(event: any) => onChangeDebounced({ jsonArrayFieldPath: event.target.value })}
        />
      </Section>

      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
        {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
        <Switch
          data-test="Table.ColumnEditor.JsonArray.ParseMarkdown"
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
          defaultChecked={column.enableParseMarkdown}
          // @ts-expect-error ts-migrate(2322) FIXME: Type '(enableConsoleLogs: any) => any' is not assi... Remove this comment to see the full error message
          onChange={(enableParseMarkdown: any) => onChangeDebounced({ enableParseMarkdown })}>
          Enable Parse markdown in rendered text
        </Switch>
      </Section>

    </React.Fragment>
  );
}

initJsonArrayColumn.friendlyName = "JSONArray";
initJsonArrayColumn.Editor = Editor;
