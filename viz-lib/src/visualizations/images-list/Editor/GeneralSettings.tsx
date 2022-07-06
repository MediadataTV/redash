import { map } from "lodash";
import React from "react";
import { Section, Select, Input } from "@/components/visualizations/editor";
import { EditorPropTypes } from "@/visualizations/prop-types";

export default function GeneralSettings({ options, data, visualizationName, onOptionsChange }: any) {
  return (
    <React.Fragment>
      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
        <Select
          layout="horizontal"
          label="Image Column Name"
          data-test="ImagesList.General.ValueColumn"
          defaultValue={options.imageColumn}
          onChange={(imageColumn: any) => onOptionsChange({ imageColumn })}>
            {map(data.columns, (col:any) => (
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'Option' does not exist on type '({ class... Remove this comment to see the full error message
            <Select.Option key={col.name} data-test={"ImagesList.General.ValueColumn." + col.name}>
              {col.name}
              {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'Option' does not exist on type '({ class... Remove this comment to see the full error message */}
            </Select.Option>
          ))}
        </Select>
      </Section>

      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
        <Input
          layout="horizontal"
          label="Images Src Field"
          data-test="ImagesList.General.Src"
          defaultValue={options.imageSrc}
          onChange={(e: any) => onOptionsChange({ imageSrc: e.target.value })}
        />
      </Section>

      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
        <Input
          layout="horizontal"
          label="Images Label Field"
          data-test="ImagesList.General.Label"
          defaultValue={options.imageLabel}
          onChange={(e: any) => onOptionsChange({ imageLabel: e.target.value })}
        />
      </Section>

      {/* @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message */}
      <Section>
        <Input
          layout="horizontal"
          label="Images Thumbnail Width"
          data-test="ImagesList.General.Width"
          defaultValue={options.imageThumbnailWidth}
          placeholder={visualizationName}
          onChange={(e: any) => onOptionsChange({ imageThumbnailWidth: e.target.value })}
        />
      </Section>

    </React.Fragment>
  );
}

GeneralSettings.propTypes = EditorPropTypes;
