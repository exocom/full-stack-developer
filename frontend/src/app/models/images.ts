export enum ImageMimeTypes {
  Gif = 'image/gif',
  Jpeg = 'image/jpeg',
  Png = 'image/png',
  Svg = 'image/svg+xml',
  Webp = 'image/webp'
}

export interface ImageUpload {
  file?: File;
  base64?: string;
}
