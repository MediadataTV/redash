import createTabbedEditor from "@/components/visualizations/editor/createTabbedEditor";

import GeneralSettings from "./GeneralSettings";

export default createTabbedEditor([
  { key: "General", title: "General", component: GeneralSettings },
]);
