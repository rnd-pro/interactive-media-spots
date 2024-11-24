// TODO: startFrame support
export class ImageReader {

  constructor() {
    this.cache = [];
  }

  /**
   *
   * @param {Array} resultArr
   * @param {String[]} imgSrcArr
   * @param {(progress: number) => void} progressHandler
   */
  read(resultArr, imgSrcArr, progressHandler) {
    const frameRange = imgSrcArr.length;
    resultArr.length = frameRange;
    resultArr.fill(null, 0, frameRange);
    const progressStep = 100 / frameRange;
    let progressTotal = 0;
    let loadedCount = 0;

    imgSrcArr.forEach((url, idx) => {
      let newImg = new Image();
      newImg.src = url;
      this.cache.push(newImg);
      newImg.onload = () => {
        resultArr.splice(idx, 1, newImg);
        loadedCount++;
        if (progressTotal < 100) {
          progressTotal += progressStep;
        }
        if (loadedCount === frameRange) {
          progressTotal = 100;
        }
        if (progressHandler) {
          progressHandler(Math.floor(progressTotal));
        }
      };
    });
  }

  kill() {
    if (this.cache.length) {
      this.cache.forEach((img) => {
        img.src = '';
        img = null;
      });
    }
    this.cache = [];
  }
}
