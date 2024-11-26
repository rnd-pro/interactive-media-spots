import Symbiote, { html, css } from '@symbiotejs/symbiote';
import { DIFF_STYLES } from './styles.js';
import { DIFF_TPL } from './template.js';
import { ImsDiffData } from './ImsDiffData.js';
import {getVariantFit} from '../../lib/getVariantFit.js';

class ImsDiff extends Symbiote {

  /** @type {CanvasRenderingContext2D} */
  #ctx2d;

  /** @type {HTMLImageElement[]} */
  #images = [];

  /** @type {HTMLCanvasElement} */
  #canvas;

  renderCallback() {
    this.#canvas = this.ref.canvas;
    this.#ctx2d = this.#canvas.getContext('2d');
    this.#rect = this.#canvas.getBoundingClientRect();
    this.sub('srcDataUrl', async (url) => {
      try {
        /** @type {ImsDiffData} */
        let cfg = await (await window.fetch(url)).json();
        this.config = cfg;
      } catch(e) {
        console.error(e);
      }
    });
  }

  /** @type {Number} */
  #imgWidth;

  /**
   *
   * @param {ImsDiffData} srcData
   */
  #loadImages(srcData) {
    let variantFit = getVariantFit(srcData.variants, this);
    let srcArr = srcData.cdnIdList.map((uid) => {
      return srcData.baseUrl + uid + '/' + variantFit;
    });
    srcArr.forEach((imgUrl) => {
      let img = new Image();
      img.src = imgUrl;
      this.#images.push(img);
      img.onload = () => {
        if (srcArr.length === this.#images.length) {
          window.setTimeout(() => {
            this.#start();
          });
          this.#imgWidth = this.#images[0].width;
        }
      };
    });
  }

  /**
   * @param {ImsDiffData} cfg
   */
  set config(cfg) {
    this.#loadImages(cfg);
  }

  #mMoveHandler(e) {
    let imgLeft = this.#rect.left + (this.#rect.width - this.#imgWidth) / 2;
    let mLeft = e.clientX - imgLeft;
    let k = 1 - mLeft / this.#imgWidth;
    this.#draw(0, k);
  }

  #mUpHandler(e) {
    this.removeEventListener('mousemove', this.#mMoveHandler);
  }

  #mDownHandler(e) {
    this.addEventListener('mousemove', this.#mMoveHandler);
    this.addEventListener('mouseup', this.#mUpHandler);
  }


  /** @type {DOMRect} */
  #rect;

  #start() {
    this.#draw(0, 0);
    this.addEventListener('mousedown', this.#mDownHandler);
  }

  #draw(idx, lk) {
    let img1 = this.#images[idx];
    let img2 = this.#images[idx + 1];
    let w = img1.width;
    let h = img1.height;
    this.#canvas.width = w;
    this.#canvas.height = h;
    this.#ctx2d.drawImage(img1, 0, 0, w, h);

    let gap = w * lk;

    let sx = w - gap;
    let sy = 0;
    let sWidth = img2.width - sx;
    let sHeight = h;
    let dx = sx;
    let dy = 0;
    let dWidth = img2.width - sx;
    let dHeight = h;

    this.#ctx2d.drawImage(img2, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    // this.style.backgroundImage = `url(${this['canvas-el'].toDataURL()})`;
  }

}

ImsDiff.bindAttributes({
  'src-data': 'srcDataUrl',
});

ImsDiff.shadowStyles = DIFF_STYLES;
ImsDiff.template = DIFF_TPL;

ImsDiff.reg('ims-diff');

export default ImsDiff;
export { ImsDiff, ImsDiffData }

