import { ImsBaseClass } from '../../lib/ImsBaseClass.js';
import { DIFF_STYLES } from './styles.js';
import { DIFF_TPL } from './template.js';
import { ImsDiffData } from './ImsDiffData.js';
import { getVariantFit } from '../../lib/getVariantFit.js';

class ImsDiff extends ImsBaseClass {

  dataClass = ImsDiffData;

  /** @type {HTMLImageElement[]} */
  #images = [];

  init$ = {
    noFilters: true,
    useFilter: true,
    onFilter: () => {
      this.$.useFilter = !this.$.useFilter;
      this.#draw(0, 0.5);
      this.ref.slider.style.left = '50%';
    },
  }

  onResize() {
    super.onResize();
    this.#loadImages();
    this.#draw(0, 0.5);
    this.ref.slider.style.left = '50%';
  }

  #loadImages() {
    this.srcData.srcList.forEach((imgUrl, idx) => {
      let img = this.#images[idx] || new Image();
      if (!this.#images[idx]) {
        img.onload = () => {
          if (this.srcData.srcList.length === this.#images.length) {
            window.setTimeout(() => {
              this.#start();
            });
          }
        };
        this.#images.push(img);
      }
      img.src = imgUrl;
    });
  }

  init() {
    this.$.noFilters = !this.srcData.filters.length;
    this.#loadImages();
  }

  #mMoveHandler(e) {
    let left = e.clientX - this.rect.left;
    this.ref.slider.style.left = `${left}px`;
    let k = left / this.rect.width;
    // console.log(k);
    this.#draw(0, k);
  }

  #mUpHandler() {
    this.removeEventListener('mousemove', this.#mMoveHandler);
  }

  #mDownHandler() {
    this.addEventListener('mousemove', this.#mMoveHandler);
    this.addEventListener('mouseup', this.#mUpHandler);
  }

  #mOutHandler() {
    this.removeEventListener('mousemove', this.#mMoveHandler);
  }

  #start() {
    this.#draw(0, 0.5);
    this.addEventListener('mousedown', this.#mDownHandler);
    this.addEventListener('mouseout', this.#mOutHandler);
  }

  /**
   * @param {Number} idx
   * @param {Number} lk
   */
  #draw(idx, lk) {
    let img1 = this.#images[idx];
    let img2 = this.#images[idx + 1];
    let w = img1.width;
    let h = img1.height;
    this.canvas.width = w;
    this.canvas.height = h;
    let filter1 = this.srcData.filters?.[idx];
    let filter2 = this.srcData.filters?.[idx + 1];
    if (this.$.useFilter && filter1) {
      this.ctx2d.filter = filter1;
    }
    this.ctx2d.drawImage(img1, 0, 0, w, h);

    w = img2.width;
    h = img2.height;
 
    let imgAspect = w / h;
    let containerAspect = this.rect.width / this.rect.height;
    let containVertical = imgAspect < containerAspect;
    if (containVertical) {
      w = w * containerAspect / imgAspect;
    }
    let gap = w * (1 - lk);

    // Calculate the actual dimensions of the contained image
    let renderedWidth, renderedHeight;
    if (containVertical) {
      renderedHeight = this.rect.height;
      renderedWidth = renderedHeight * imgAspect;
    } else {
      renderedWidth = this.rect.width;
      renderedHeight = renderedWidth / imgAspect;
    }

    // Calculate the offset from the container edge
    let leftOffsetVal = containVertical ? (this.rect.width - renderedWidth) / 2 : 0;
    let leftOffset = containVertical ? leftOffsetVal : 0;
    
    let sx = w - gap - leftOffset;
    let sy = 0;
    let sWidth = img2.width - sx;
    let sHeight = h;
    let dx = sx;
    let dy = 0;
    let dWidth = img2.width - sx;
    let dHeight = h;

    this.ctx2d.clearRect(sx, sy, sWidth, sHeight);
    if (this.$.useFilter && filter2) {
      this.ctx2d.filter = filter2;
    }
    this.ctx2d.drawImage(img2, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }

}

ImsDiff.shadowStyles = DIFF_STYLES;
ImsDiff.template = DIFF_TPL;

ImsDiff.reg('ims-diff');

export default ImsDiff;
export { ImsDiff, ImsDiffData }

