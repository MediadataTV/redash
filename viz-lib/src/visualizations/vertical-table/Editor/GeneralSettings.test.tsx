import React from "react";
import enzyme from "enzyme";

import getOptions from "../getOptions";
import GeneralSettings from "./GeneralSettings";

function findByTestID(wrapper: any, testId: any) {
  return wrapper.find(`[data-test="${testId}"]`);
}

function mount(options: any, done: any) {
  const data = { columns: [], rows: [] };
  options = getOptions(options, data);
  return enzyme.mount(
    <GeneralSettings
      visualizationName="Test"
      data={data}
      options={options}
      onOptionsChange={changedOptions => {
        expect(changedOptions).toMatchSnapshot();
        done();
      }}
    />
  );
}

describe("Visualizations -> Table -> Editor -> General Settings", () => {
  test("Changes items per page", done => {
    const el = mount(
      {
        itemsPerPage: 25,
      },
      done
    );

    findByTestID(el, "Table.ItemsPerPage")
      .last()
      .simulate("mouseDown");
    findByTestID(el, "Table.ItemsPerPage.100")
      .last()
      .simulate("click");
  });
});
