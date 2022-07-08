import initTextColumn from "./text";
import initNumberColumn from "./number";
import initDateTimeColumn from "./datetime";
import initBooleanColumn from "./boolean";
import initLinkColumn from "./link";
import {initImageArrayColumn, initImageColumn} from "./image";
import initJsonColumn from "./json";
import initJsonArrayColumn from "./jsonArray";

// this map should contain all possible values for `column.displayAs` property
export default {
  string: initTextColumn,
  number: initNumberColumn,
  datetime: initDateTimeColumn,
  boolean: initBooleanColumn,
  link: initLinkColumn,
  image: initImageColumn,
  imageArray: initImageArrayColumn,
  json: initJsonColumn,
  jsonArray: initJsonArrayColumn,
};
