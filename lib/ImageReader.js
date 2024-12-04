// TODO: startFrame support
export class ImageReader {

  /** @type {HTMLImageElement[]} */
  #cache = [];

  /**
   *
   * @param {HTMLImageElement[]} resultArr
   * @param {String[]} imgSrcArr
   * @param {(progress: number) => void} progressHandler
   */
  read(resultArr, imgSrcArr, progressHandler) {
    const frameRange = imgSrcArr.length;
    resultArr.length = frameRange;
    // resultArr.fill(null, 0, frameRange);
    const progressStep = 100 / frameRange;
    let progressTotal = 0;
    let loadedCount = 0;

    imgSrcArr.forEach((url, idx) => {
      let img;
      if (resultArr[idx]) {
        img = resultArr[idx];
      } else {
        img = new Image();
        this.#cache.push(img);
        resultArr.splice(idx, 1, img);
        img.onload = () => {
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
      }
      // console.log(img.src);
      // console.log(url);
      if (img.src === url) {
        return;
      }
      img.src = url;
    });
  }

  clear() {
    if (this.#cache.length) {
      this.#cache.forEach((img) => {
        img.src = '';
      });
    }
  }
}
