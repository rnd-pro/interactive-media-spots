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

    const onError = (img) => {
      console.error(`Failed to load image: ${img.src}`);
      progressHandler?.(Math.floor(progressTotal));
    };

    imgSrcArr.forEach((url, idx) => {
      let img = resultArr[idx] || new Image();
      if (!resultArr[idx]) {
        this.#cache.push(img);
        resultArr[idx] = img;
        img.onload = () => {
          loadedCount++;
          progressTotal = Math.min(100, progressTotal + progressStep);
          progressHandler?.(Math.round(progressTotal));
        };
        img.onerror = () => onError(img);
      }
      if (img.src !== url) {
        img.src = url;
      }
    });
  }

  clear() {
    if (this.#cache.length) {
      this.#cache.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.src = '';
      });
      this.#cache = [];
    }
  }
}
