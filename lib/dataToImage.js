/**
 * 
 * @param {*} data 
 * @param {String} [coverUrl] 
 * @returns 
 */
export async function dataToImage(data, coverUrl) {
  let dataString = JSON.stringify(data);
  let binary = new TextEncoder().encode(dataString);
  let size = Math.ceil(Math.sqrt(binary.length));
  let canvas = new OffscreenCanvas(size, size);
  let ctx = canvas.getContext('2d');
  let imageData;
  if (coverUrl) {
    let img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = coverUrl;
    await img.decode();
    ctx.drawImage(img, 0, 0, size, size);
    imageData = ctx.getImageData(0, 0, size, size);
  } else {
    imageData = ctx.createImageData(size, size);
  }
  for (let i = 0; i < binary.length; i++) {
    imageData.data[i * 4 + 3] = binary[i]; // Alpha channel contains data
  }
  ctx.putImageData(imageData, 0, 0);
  let blob = await canvas.convertToBlob();
  let reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(null);
    };
    reader.readAsDataURL(blob);
  });
}

export default dataToImage;