import { imageToData } from './imageToData.js';

export function loadSourceData(srcDataUrl) {
  return new Promise(async (resolve, reject) => {
    try {
      let resp = await window.fetch(srcDataUrl);
      if (resp.headers.get('Content-Type').toLowerCase().includes('image')) {
        let blob = await resp.blob();
        let url = URL.createObjectURL(blob);
        resolve(await imageToData(url));
      } else {
        resolve(await resp.json());
      }
    } catch(e) {
      reject(e);
    }
  });
}