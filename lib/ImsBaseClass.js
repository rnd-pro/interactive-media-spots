import Symbiote, { kebabToCamel, UID } from '@symbiotejs/symbiote';
import { ResizeController } from './ResizeController.js';
import { FullscreenMgr } from './FullscreenMgr.js';
import { loadSourceData } from './loadSourceData.js';
import { getVariantFit } from './getVariantFit.js';

export class ImsBaseClass extends Symbiote {

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

  get srcData() {
    return this.#srcData;
  }

  onResize() {
    this.fillSrcVariantList();
    this.rect = this.getBoundingClientRect();
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
    if (this.srcData?.baseUrl && this.srcData?.cdnIdList?.length) {
      let variant = this.srcData.maxVariantName || 'public';
      if (this.srcData.imsType !== 'pano' && this.srcData.variants?.length) {
        variant = getVariantFit(this.srcData.variants, this).toString();
      }

      /** @type {String[]} */
      let srcList = [];
      this.srcData.cdnIdList.forEach((uid) => {
        srcList.push(this.srcData.baseUrl + uid + '/' + variant);
      });
      this.srcData.srcList = srcList;
    }
  }

  initCallback() {
    /** @type {HTMLCanvasElement} */
    this.canvas = this.ref.canvas;
    this.rect = this.getBoundingClientRect();
    let dataRef = new this.dataClass();
    [...this.attributes].forEach((attr) => {
      let prop = kebabToCamel(attr.name);
      if (dataRef.hasOwnProperty(prop)) {
        try {
          this.override[prop] = JSON.parse(this.getAttribute(attr.name));
        } catch(err) {
          console.warn('[IMS] Bad attribute value: ' + attr.name);
        }
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
      val ? FullscreenMgr.enable(this) : FullscreenMgr.disable();
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