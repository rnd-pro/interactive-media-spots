
/**
 * 
 * @param {String} url 
 * @returns 
 */
export async function dataFromImage(url) {
  let img = new Image();
  img.src = url;
  await img.decode();

  let canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  let imageData = ctx.getImageData(0, 0, img.width, img.height);
  let binary = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    binary.push(imageData.data[i]); // Read R channel
  }

  let jsonString = new TextDecoder().decode(new Uint8Array(binary));
  let result = undefined;
  try {
    result = JSON.parse(jsonString);
  } catch (e) {
    console.error(e);
  }
  return result;
}

export default dataFromImage;