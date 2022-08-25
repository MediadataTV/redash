import { extend, trim } from "lodash";
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Section, Input, Checkbox, ContextHelp } from "@/components/visualizations/editor";
import { formatSimpleTemplate } from "@/lib/value-format";
import { visualizationsSettings } from "@/visualizations/visualizationsSettings";

type Props = {
  column: {
    name: string;
    linkMandatoryParams?: string;
    linkUrlTemplate?: string;
    linkTextTemplate?: string;
    linkTitleTemplate?: string;
    linkOpenInNewTab?: boolean;
  };
  onChange: (...args: any[]) => any;
};

function Editor({ column, onChange }: Props) {
  const [onChangeDebounced] = useDebouncedCallback(onChange, 200);

  return (
    <React.Fragment>
      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
        <Input
          label="Only render link when all params are provided"
          defaultValue={column.linkMandatoryParams}
          onChange={(event: any) => onChangeDebounced({ linkMandatoryParams: event.target.value })}
          suffix={visualizationsSettings.FaIconComponent('fa-asterisk')}
        />
      </Section>
      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
        <Input
          label="URL template"
          data-test="Table.ColumnEditor.Link.UrlTemplate"
          defaultValue={column.linkUrlTemplate}
          onChange={(event: any) => onChangeDebounced({ linkUrlTemplate: event.target.value })}
          suffix={visualizationsSettings.FaIconComponent('fa-asterisk')}
        />
      </Section>

      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
        <Input
          label="Text template"
          data-test="Table.ColumnEditor.Link.TextTemplate"
          defaultValue={column.linkTextTemplate}
          onChange={(event: any) => onChangeDebounced({ linkTextTemplate: event.target.value })}
          suffix={visualizationsSettings.FaIconComponent('fa-asterisk')}
        />
      </Section>

      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
        <Input
          label='Title template'
          data-test="Table.ColumnEditor.Link.TitleTemplate"
          defaultValue={column.linkTitleTemplate}
          onChange={(event: any) => onChangeDebounced({ linkTitleTemplate: event.target.value })}
          suffix={visualizationsSettings.FaIconComponent('fa-asterisk')}
        />
      </Section>

      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
        <Checkbox
          data-test="Table.ColumnEditor.Link.OpenInNewTab"
          checked={column.linkOpenInNewTab}
          onChange={event => onChange({ linkOpenInNewTab: event.target.checked })}>
          Open in new tab
        </Checkbox>
      </Section>

      {visualizationsSettings.FormatSpecComponent()}
    </React.Fragment>
  );
}

export default function initLinkColumn(column: any) {
  function prepareData(row: any) {
    row = extend({ "@": row[column.name] }, row);

    let skipLink:boolean = false;

    if(column.linkMandatoryParams){
      let mandatoryParams = column.linkMandatoryParams.split(',');
      mandatoryParams = mandatoryParams.filter((item: string) => {
        let res = (/{{.*}}/g).exec(item);
        if (res && res.length>0) {
          return true;
        } else {
          return null;
        }
      });

      mandatoryParams.forEach( (item: string) => {
        let paramValue = formatSimpleTemplate(item.trim(), row);
        if(!paramValue || paramValue.trim().length<=0 || paramValue.trim()==='null'){
          skipLink = true;
        }
      });
    }



    const href = trim(formatSimpleTemplate(column.linkUrlTemplate, row));
    if (href === "") {
      return {};
    }

    const title = trim(formatSimpleTemplate(column.linkTitleTemplate, row));
    const text = trim(formatSimpleTemplate(column.linkTextTemplate, row));

    const result = {
      href,
      skipLink,
      text: text !== "" ? text : href,
    };

    if (title !== "") {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'title' does not exist on type '{ href: s... Remove this comment to see the full error message
      result.title = title;
    }
    if (column.linkOpenInNewTab) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'target' does not exist on type '{ href: ... Remove this comment to see the full error message
      result.target = "_blank";
    }

    return result;
  }

  function LinkColumn({ row }: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'text' does not exist on type '{}'.
    // eslint-disable-line react/prop-types
    const { text,skipLink, ...props } = prepareData(row);
    if(skipLink){
      return text;
    }
    return <a {...props}>{text}</a>;
  }

  LinkColumn.prepareData = prepareData;

  return LinkColumn;
}

initLinkColumn.friendlyName = "Link";
initLinkColumn.Editor = Editor;
