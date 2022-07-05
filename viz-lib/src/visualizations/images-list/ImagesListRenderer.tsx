import React from "react";
import { isString, isUndefined, isObject } from "lodash";
import { RendererPropTypes } from "@/visualizations/prop-types";
import { visualizationsSettings } from "@/visualizations/visualizationsSettings";
import { Image } from "antd/lib";
import { formatSimpleTemplate } from "@/lib/value-format";
import "./images-list.less";

function getImages(data: any, options: any) {
  
  if (isString(data) && data.length <= visualizationsSettings.tableCellMaxJSONSize) {
    try {
      let jsonValue = JSON.parse(data);
      if(isUndefined(jsonValue)){
        return undefined;
      }

      let value=undefined;
      if(Array.isArray(jsonValue)){
        value = jsonValue.map( item => {
          if(!isObject(item)){
            return item;
          }else{
            return { 
              src: formatSimpleTemplate(options.imageSrc, item),
              alt: formatSimpleTemplate(options.imageLabel, item),
              width: options.imageThumbnailWidth,
            };
          }
        });
      }else{
        value = [
          { 
            src: formatSimpleTemplate(options.imageSrc, jsonValue),
            alt: formatSimpleTemplate(options.imageLabel, jsonValue),
            width: options.imageThumbnailWidth,
          }
        ];
      }
      return value;
    } catch (e) {
      // ignore `JSON.parse` error and return default value
    }
  }
  // If we reach this point, render all data
  return undefined;
}

export default function ImagesListRenderer({ row, options }: any) {

  const data = formatSimpleTemplate(options.imageColumn, row);
  const images = getImages(data,  options)
  return (
    <div className="images-list-viz">
      {images ?
        <Image.PreviewGroup>
          { images.map((entry:any, k:any) => (
            <Image width={entry.width} src={entry.src} alt={entry.alt} />
            ))}
        </Image.PreviewGroup>      
        : 
        data
      }
    </div>
  );
}

ImagesListRenderer.propTypes = RendererPropTypes;
