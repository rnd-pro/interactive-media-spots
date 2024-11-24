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
    // const previewRange = previewSrcArr.length;
    resultArr.length = frameRange;
    resultArr.fill(null, 0, frameRange);
    // const previewProgressStep = previewRange ? (20 / frameRange) : 0;
    // const progressStep = previewRange ? (80 / frameRange) : (100 / frameRange);
    const progressStep = 100 / frameRange;
    let progressTotal = 0;
    let loadedCount = 0;

    // previewSrcArr.forEach((preUrl, preIndex) => {
    //   let preImg = new Image();
    //   preImg.src = preUrl;
    //   this.cache.push(preImg);
    //   preImg.onload = () => {
    //     if (!resultArr[preIndex]) {
    //       resultArr.splice(preIndex, 1, preImg);
    //     }
    //     if (progressTotal < 100) {
    //       progressTotal += previewProgressStep;
    //     } else {
    //       progressTotal = 100;
    //     }
    //     if (progressHandler) {
    //       progressHandler(progressTotal);
    //     }
    //   };
    // });

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
