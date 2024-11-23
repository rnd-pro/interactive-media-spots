// TODO: startFrame support
export class ImageReader {

  constructor() {
    this.cach = [];
  }

  /**
   *
   * @param {Array} resultArr
   * @param {Array} imgSrcArr
   * @param {Array} previewSrcArr
   * @param {Function} progressHandler
   */
  read(resultArr, imgSrcArr, previewSrcArr = [], progressHandler) {
    const frameRange = imgSrcArr.length;
    const previewRange = previewSrcArr.length;
    resultArr.length = frameRange;
    resultArr.fill(null, 0, frameRange);
    const previewProgressStep = previewRange ? (20 / frameRange) : 0;
    const progressStep = previewRange ? (80 / frameRange) : (100 / frameRange);
    let progressTotal = 0;
    let loadedCount = 0;

    previewSrcArr.forEach((preUrl, preIndex) => {
      let preImg = new Image();
      preImg.src = preUrl;
      this.cach.push(preImg);
      preImg.onload = () => {
        if (!resultArr[preIndex]) {
          resultArr.splice(preIndex, 1, preImg);
        }
        if (progressTotal < 100) {
          progressTotal += previewProgressStep;
        } else {
          progressTotal = 100;
        }
        if (progressHandler) {
          progressHandler(progressTotal);
        }
      };
    });

    imgSrcArr.forEach((url, idx) => {
      let newImg = new Image();
      newImg.src = url;
      this.cach.push(newImg);
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
    if (this.cach.length) {
      this.cach.forEach((img) => {
        img.src = '';
        img = null;
      });
    }
    this.cach = [];
  }
}
