import React from "react";
import ReactDOMServer from "react-dom/server";
import moment from "moment/moment";
import numeral from "numeral";
import * as lodash from "lodash";
import { visualizationsSettings } from "@/visualizations/visualizationsSettings";

numeral.options.scalePercentBy100 = false;

// eslint-disable-next-line
const urlPattern = /(^|[\s\n]|<br\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;

const hasOwnProperty = Object.prototype.hasOwnProperty;

export function createTextFormatter(highlightLinks: any) {
  if (highlightLinks) {
    return (value: any) => {
      if (lodash.isString(value)) {
        const Link = visualizationsSettings.LinkComponent;
        value = value.replace(urlPattern, (unused, prefix, href) => {
          const link = ReactDOMServer.renderToStaticMarkup(
            <Link href={href} target="_blank" rel="noopener noreferrer">
              {href}
            </Link>
          );
          return prefix + link;
        });
      }
      return lodash.toString(value);
    };
  }
  return (value: any) => lodash.toString(value);
}

function toMoment(value: any) {
  if (moment.isMoment(value)) {
    return value;
  }
  if (isFinite(value)) {
    return moment(value);
  }
  // same as default `moment(value)`, but avoid fallback to `new Date()`
  return moment(lodash.toString(value), [moment.ISO_8601, moment.RFC_2822]);
}

export function createDateTimeFormatter(format: any) {
  if (lodash.isString(format) && format !== "") {
    return (value: any) => {
      const wrapped = toMoment(value);
      return wrapped.isValid() ? wrapped.format(format) : lodash.toString(value);
    };
  }
  return (value: any) => lodash.toString(value);
}

export function createBooleanFormatter(values: any) {
  if (lodash.isArray(values)) {
    if (values.length >= 2) {
      // Both `true` and `false` specified
      return (value: any) => {
        if (lodash.isNil(value)) {
          return "";
        }
        return "" + values[value ? 1 : 0];
      };
    } else if (values.length === 1) {
      // Only `true`
      return (value: any) => (value ? values[0] : "");
    }
  }
  return (value: any) => {
    if (lodash.isNil(value)) {
      return "";
    }
    return value ? "true" : "false";
  };
}

export function createNumberFormatter(format: any) {
  if (lodash.isString(format) && format !== "") {
    const n = numeral(0); // cache `numeral` instance
    return (value: any) => (value === null || value === "" ? "" : n.set(value).format(format));
  }
  return (value: any) => lodash.toString(value);
}

export function parseToJson(json: any){
  if(lodash.isString(json)){
    return JSON.parse(json);
  }
  return json;
}

function jsonFind(json: any, jsonPath: string, jsonMatchValue: any){
  try {
    let jsonValue = parseToJson(json);
    if(lodash.isUndefined(jsonValue)){
      return json;
    }
    return lodash.find(jsonValue, lodash.matchesProperty(jsonPath, jsonMatchValue));
  } catch (e) {
    // ignore `JSON.parse` error and return default value
  }
  return json;
}

function jsonSelect(json: any, jsonPath: string, selectFromArray: string = "false"){

  try {
    let jsonValue = parseToJson(json);
    if(lodash.isUndefined(jsonValue)){
      return json;
    }
    let output;
    if(selectFromArray==="true" && lodash.isArray(jsonValue)){
      output = jsonValue.map(item => lodash.get(item, jsonPath));
    }
    else{
      output = lodash.get(jsonValue, jsonPath);
    }
    return output;
  } catch (e) {
    // ignore `JSON.parse` error and return default value
  }
  return json;
}

function arrayJoin(data: any, joinString: string = ' '){
    return lodash.join(data, joinString)
}

const customFilters: { [K: string]: Function } = {
  camelCase: lodash.camelCase,
  snakeCase: lodash.snakeCase,
  arrayJoin,
  jsonSelect,
  jsonFind,
};

export function formatSimpleTemplate(str: any, data: any) {
  if (!lodash.isString(str)) {
    return "";
  }

  // return str.replace(/{{\s*([^\s]+?)\s*}}/g, (match, props) => {
  let out = str.replace(/{{\s*(@|\w+)((?:\s*\|\s*[\w\:\[\]\.]+\s*)*\s*)\s*}}/g, (match, prop, propFilters) => {
    let filters: Array<string> = [];
    if(propFilters){
      filters = propFilters.split('|').map( (item :string) => item.trim()).filter( (item :string) => item!=='');
    }
    if (hasOwnProperty.call(data, prop) && !lodash.isUndefined(data[prop])) {
      let outData: any = data[prop];
      for(let filterName of filters){
        let filterParts = filterName.split(':').map( (item :string) => item.trim()).filter( (item :string) => item!=='');
        let params = [outData];
        let filterCall = customFilters[filterParts[0]];
        if(filterParts.length>1){
          params = params.concat(filterParts.slice(1));
        }
        lodash.isFunction(filterCall) && (outData = filterCall.apply(undefined, params));
      }
      return outData;
    }
    return match;
  });
  return out;
}
