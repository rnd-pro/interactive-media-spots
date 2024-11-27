
/**
 * 
 * @param {String} url 
 * @returns 
 */
export async function imageToData(url) {
  let response = await fetch(url);
  let blob = await response.blob();
  let imageBitmap = await createImageBitmap(blob);
  let offscreenCanvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  let ctx = offscreenCanvas.getContext('2d');
  ctx.drawImage(imageBitmap, 0, 0);
  let imageData = ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height);
  let dataArray = imageData.data;
  let binary = new Uint8Array(dataArray.length);
  for (let i = 0; i < dataArray.length; i++) {
    binary[i] = dataArray[i * 4 + 3]; // Read from R channel
  }

  let jsonString = new TextDecoder()
    .decode(binary)
    .replaceAll('�', '')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // This removes ASCII control characters and other non-printable Unicode characters.

  let result = null;
  try {
    result = JSON.parse(jsonString);
  } catch(e) {
    console.error(e);
  }
  return result;
}

export default imageToData;