export const imageFileNameRegExp = /^[-\w^&'@{}[\],$=!#().%+~].*?\.(gif|jpg|jpeg|tiff|png)$/i;

export const dataUrlRegExp = /^data:(.*?\/(.*?));base64,(.*$)/;

export enum ImageMimeTypes {
  Gif = 'image/gif',
  Jpeg = 'image/jpeg',
  Png = 'image/png',
  Svg = 'image/svg+xml',
  Webp = 'image/webp'
}
