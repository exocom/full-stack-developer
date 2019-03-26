import {dataUrlRegExp} from '../services/contract/models/request';

export function randomString(length, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function dataUrlToBlob(dataUrl) {
  const [match, mimeType, ext, base64str] = dataUrl.match(dataUrlRegExp);
  const binary = atob(base64str);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: mimeType});
}
