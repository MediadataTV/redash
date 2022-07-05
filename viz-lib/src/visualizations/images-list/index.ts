import ImagesListRenderer from "./ImagesListRenderer";
import Editor from "./Editor";

const DEFAULT_OPTIONS = {
  imageColumn: "",
  imageLabel: "",
  imageSrc: "",
  imageThumbnailWidth: 200,
};

export default {
  type: "IMAGESLIST",
  name: "Images List",
  getOptions: (options: any) => ({
    ...DEFAULT_OPTIONS,
    ...options,
  }),
  Renderer: ImagesListRenderer,
  Editor,
  defaultColumns: 3,
  minColumns: 2,
};
