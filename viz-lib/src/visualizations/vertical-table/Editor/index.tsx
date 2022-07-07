import createTabbedEditor from "@/components/visualizations/editor/createTabbedEditor";

import ColumnsSettings from "./ColumnsSettings";
import GeneralSettings from "./GeneralSettings";

import "./editor.less";

export default createTabbedEditor([
  { key: "Columns", title: "Columns", component: ColumnsSettings },
  { key: "General", title: "General", component: GeneralSettings },
]);
