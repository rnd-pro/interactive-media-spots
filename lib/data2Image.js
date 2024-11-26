export function data2Image(data) {
  let dataString = JSON.stringify(data);
  let binary = new TextEncoder().encode(dataString);

  let canvas = document.createElement('canvas');
  let size = Math.ceil(Math.sqrt(binary.length)); // Assume RGBA
  canvas.width = canvas.height = size;
  let ctx = canvas.getContext('2d');

  let imageData = ctx.createImageData(size, size);
  for (let i = 0; i < binary.length; i++) {
      imageData.data[i * 4] = binary[i];  // R channel
      imageData.data[i * 4 + 3] = 255;   // Alpha channel (fully opaque)
  }
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
}

export default data2Image;