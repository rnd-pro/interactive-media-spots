/**
 * This widget is used to show the difference between two images.
 */

import Symbiote from '@symbiotejs/symbiote';
import { DIFF_STYLES } from './styles.js';
import { DIFF_TPL } from './template.js';
import { ImsDiffData } from './ImsDiffData.js';
import { getVariantFit } from '../../lib/getVariantFit.js';
import { loadSourceData } from '../../lib/loadSourceData.js';
import { FullscreenMgr } from '../../lib/FullscreenMgr.js';
import { ResizeController } from '../../lib/ResizeController.js';

class ImsDiff extends Symbiote {

  /** @type {CanvasRenderingContext2D} */
  #ctx2d;

  /** @type {HTMLImageElement[]} */
  #images = [];

  /** @type {HTMLCanvasElement} */
  #canvas;

  init$ = {
    fullscreen: false,
    useFilter: true,
    onFilter: () => {
      this.$.useFilter = !this.$.useFilter;
      this.#draw(0, 0.5);
      this.ref.slider.style.left = '50%';
    },
    onFs: () => {
      this.$.fullscreen = !this.$.fullscreen;
    },
  }

  renderCallback() {
    this.#canvas = this.ref.canvas;
    this.#ctx2d = this.#canvas.getContext('2d');
    this.#rect = this.#canvas.getBoundingClientRect();

    this.sub('srcDataUrl', async (url) => {
      if (!url) {
        return;
      }
      this.srcData = await loadSourceData(url);
    });

    this.sub('fullscreen', (val) => {
      if (val) {
        FullscreenMgr.enable(this);
      } else {
        FullscreenMgr.disable();
      }
      this.#loadImages(this.srcData);
    });

    FullscreenMgr.init();

    ResizeController.add(this, () => {
      this.#rect = this.#canvas.getBoundingClientRect();
      this.#loadImages(this.srcData);
    });
  }

  /**
   *
   * @param {ImsDiffData} srcData
   */
  #loadImages(srcData) {
    if (!srcData) {
      return;
    }
    let variantFit = getVariantFit(srcData.variants, this);
    let srcArr = srcData.cdnIdList.map((uid) => {
      return srcData.baseUrl + uid + '/' + variantFit;
    });
    srcArr.forEach((imgUrl) => {
      let img = new Image();
      img.onload = () => {
        if (srcArr.length === this.#images.length) {
          window.setTimeout(() => {
            this.#start();
          });
        }
      };
      img.src = imgUrl;
      this.#images.push(img);
    });
  }

  /** @type {ImsDiffData} */
  #srcData;

  /**
   * @param {ImsDiffData} srcData
   */
  set srcData(srcData) {
    this.#srcData = srcData;
    this.#loadImages(srcData);
  }

  get srcData() {
    return this.#srcData;
  }

  #mMoveHandler(e) {
    let left = e.clientX - this.#rect.left;
    this.ref.slider.style.left = `${left}px`;
    let k = left / this.#rect.width;
    console.log(k);
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


  /** @type {DOMRect} */
  #rect;

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
    this.#canvas.width = w;
    this.#canvas.height = h;
    let filter1 = this.#srcData.filters?.[idx];
    let filter2 = this.#srcData.filters?.[idx + 1];
    if (this.$.useFilter && filter1) {
      this.#ctx2d.filter = filter1;
    }
    this.#ctx2d.drawImage(img1, 0, 0, w, h);

    let gap = w * (1- lk);

    let sx = w - gap;
    let sy = 0;
    let sWidth = img2.width - sx;
    let sHeight = h;
    let dx = sx;
    let dy = 0;
    let dWidth = img2.width - sx;
    let dHeight = h;

    this.#ctx2d.clearRect(sx, sy, sWidth, sHeight);
    if (this.$.useFilter && filter2) {
      this.#ctx2d.filter = filter2;
    }
    this.#ctx2d.drawImage(img2, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
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

