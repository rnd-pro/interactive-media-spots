import Symbiote, { kebabToCamel, UID } from '@symbiotejs/symbiote';
import { ResizeController } from './ResizeController.js';
import { FullscreenMgr } from './FullscreenMgr.js';
import { loadSourceData } from './loadSourceData.js';
import { getVariantFit } from './getVariantFit.js';

/**
 * @typedef {Partial<import('../wgt/diff/ImsDiffData.js').ImsDiffData 
 * & import('../wgt/gallery/ImsGalleryData.js').ImsGalleryData 
 * & import('../wgt/pano/ImsPanoData.js').ImsPanoData 
 * & import('../wgt/spinner/ImsSpinnerData.js').ImsSpinnerData
 * & import('../wgt/video/ImsVideoData.js').ImsVideoData>} ImsData
 */

export class ImsBaseClass extends Symbiote {

  /**
   * 
   * @param {String} uid 
   * @param {String | Number} variant 
   * @returns 
   */
  #makeUrl(uid, variant) {
    return this.srcData.urlTemplate.replaceAll('{UID}', uid)
    .replaceAll('{VARIANT}', variant.toString());
  }

  constructor() {
    super();
    this.add$({
      progress: 0,
      fullscreen: false,
      onFs: () => {
        this.$.fullscreen = !this.$.fullscreen;
      },
    });
  }

  override = {};

  /** @type {Object} */
  #srcData = {};
  set srcData(srcData) {
    this.#srcData = srcData;  
  }

  /** @type {ImsData} */
  get srcData() {
    return this.#srcData;
  }

  onResize() {
    this.rect = this.canvas?.getBoundingClientRect() || this.getBoundingClientRect();
    this.fillSrcVariantList();
  }

  dataClass = null;

  init() {}

  /** @type {CanvasRenderingContext2D} */
  #ctx2d;
  get ctx2d() {
    this.#ctx2d = this.#ctx2d || this.canvas.getContext('2d');
    return this.#ctx2d;
  }

  fillSrcVariantList() {
    if (this.srcData?.urlTemplate && this.srcData?.cdnIdList?.length) {
      if (!this.srcData.srcList) {
        this.srcData.srcList = [];
      }
      let variant = this.srcData.maxVariantName || 'max';
      if (this.srcData.imsType !== 'pano' && this.srcData.variants?.length) {
        variant = getVariantFit(this.srcData.variants, this).toString();
      }
      this.srcData.cdnIdList.forEach((uid, idx) => {
        if (!this.srcData.srcList[idx]) {
          this.srcData.srcList[idx] = this.#makeUrl(uid, variant);
        }
      });
    }
  }

  initCallback() {
    /** @type {HTMLCanvasElement} */
    this.canvas = this.ref.canvas || null;
    this.rect = (this.canvas || this).getBoundingClientRect();
    let dataRef = new this.dataClass();
    [...this.attributes].forEach((attr) => {
      let prop = kebabToCamel(attr.name);
      if (dataRef.hasOwnProperty(prop)) {
        let propVal;
        let attrVal = this.getAttribute(attr.name);
        try {
          propVal = JSON.parse(attrVal);
        } catch(err) {
          propVal = attrVal;
        }
        this.override[prop] = propVal;
      }
    });

    this.sub('srcDataUrl', async (dataUrl) => {
      if (!dataUrl) {
        return;
      }
      let srcData = await loadSourceData(dataUrl);
      Object.assign(srcData, this.override);
      this.srcData = srcData;
      this.fillSrcVariantList();
      this.init();
    });

    
    FullscreenMgr.init();
    this.sub('fullscreen', (val) => {
      if (val) {
        FullscreenMgr.enable(this);
        this.setAttribute('fullscreen', '');
      } else {
        FullscreenMgr.disable();
        this.removeAttribute('fullscreen');
      }
    }, false);

    ResizeController.add(this, () => {
      this.onResize();
    });
  }

  destroyCallback() {
    ResizeController.remove(this);
  }

}

ImsBaseClass.bindAttributes({
  'src-data': 'srcDataUrl',
});

export { UID }
export default ImsBaseClass;