import getOptions from "./getOptions";
import Renderer from "./Renderer";
import Editor from "./Editor";

export default {
  type: "VERTICAL_TABLE",
  name: "Vertical Table",
  getOptions,
  Renderer,
  Editor,

  autoHeight: true,
  defaultRows: 14,
  defaultColumns: 3,
  minColumns: 2,
};
