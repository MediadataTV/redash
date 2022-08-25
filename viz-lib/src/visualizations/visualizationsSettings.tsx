import React from "react";
import { extend } from "lodash";
import Tooltip from "antd/lib/tooltip";
import { Section, ContextHelp } from "@/components/visualizations/editor";

type HelpTriggerProps = {
  title?: React.ReactNode;
  href: string;
  className?: string;
  children?: React.ReactNode;
};

function HelpTrigger({ title, href, className, children }: HelpTriggerProps) {
  return (
    <Tooltip
      title={
        <React.Fragment>
          {title}
          <i className="fa fa-external-link" style={{ marginLeft: 5 }} />
        </React.Fragment>
      }>
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Tooltip>
  );
}

HelpTrigger.defaultValues = {
  title: null,
  className: null,
  children: null,
};

function Link(props: any) {
  return <a {...props} />;
}

function FaIcon(icon: string){
  return <i className={'fa ' + icon}></i>
}

function Proxy(url: string){
  const u = new URL(url);
  return u?.protocol === 'http:' ? `/proxy?url=${url}` : url;
}

function FormatSpecComponent(){
    return (
    <>
     {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
        {/* @ts-expect-error ts-migrate(2746) FIXME: This JSX tag's 'children' prop expects a single ch... Remove this comment to see the full error message */}
        <ContextHelp
          placement="topLeft"
          arrowPointAtCenter
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'Element' is not assignable to type 'null | u... Remove this comment to see the full error message
          icon={<span style={{ cursor: "default" }}>Format specs {ContextHelp.defaultIcon}</span>}>
          <div>
            All columns can be referenced using <code>{"{{ column_name }}"}</code> syntax.
          </div>
          <div>
            Use <code>{"{{ @ }}"}</code> to reference current (this) column.
          </div>
          <div>This syntax is applicable to fields marked with {FaIcon('fa-asterisk')}</div>
          <div>See <a href="/user-guide/visualizations/column-format-spec" target="_blank">user doc</a> for more info on format spec modifiers</div>
        </ContextHelp>
      </Section>
      </>
    );
}

export const visualizationsSettings = {
  HelpTriggerComponent: HelpTrigger,
  LinkComponent: Link,
  FaIconComponent: FaIcon,
  FormatSpecComponent: FormatSpecComponent,
  ProxyFilter: Proxy,
  dateFormat: "DD/MM/YYYY",
  dateTimeFormat: "DD/MM/YYYY HH:mm",
  integerFormat: "0,0",
  floatFormat: "0,0.00",
  booleanValues: ["false", "true"],
  tableCellMaxJSONSize: 50000,
  allowCustomJSVisualizations: false,
  hidePlotlyModeBar: false,
  choroplethAvailableMaps: {},
};

export function updateVisualizationsSettings(options: any) {
  extend(visualizationsSettings, options);
}
