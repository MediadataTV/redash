import { map } from "lodash";
import React from "react";
import { Section, Select } from "@/components/visualizations/editor";
import { EditorPropTypes } from "@/visualizations/prop-types";
import { useDebouncedCallback } from "use-debounce";

const ALLOWED_COLUMNS_NUMBER = [1, 2, 3, 4];

export default function GridSettings({ options, onOptionsChange }: any) {

  return (
    // @ts-expect-error ts-migrate(2745) FIXME: This JSX tag's 'children' prop expects type 'never... Remove this comment to see the full error message
    <Section>
      <Select
        label="Number of columns"
        defaultValue={options.columnsNumber}
        onChange={(columnsNumber: any) => onOptionsChange({ columnsNumber })}>
        {map(ALLOWED_COLUMNS_NUMBER, value => (
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'Option' does not exist on type '({ class... Remove this comment to see the full error message
          <Select.Option key={`ipp${value}`} value={value} data-test={`Table.ItemsPerPage.${value}`}>
            {value}
            {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'Option' does not exist on type '({ class... Remove this comment to see the full error message */}
          </Select.Option>
        ))}
      </Select>
    </Section>
  );
}

GridSettings.propTypes = EditorPropTypes;
