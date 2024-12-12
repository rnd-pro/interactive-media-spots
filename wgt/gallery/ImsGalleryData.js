import { VERSION } from '../../lib/version.js';

export class ImsGalleryData {
  // Common properties:
  imsType = 'gallery';
  version = VERSION;
  hideUi = false;
  baseUrl = '';
  /** @type {String[]} */
  variants = [];
  maxVariantName = '';
  dispatchEvents = false;
  /** @type {String[]} */
  cdnIdList = [];
  /** @type {String[]} */
  srcList = [];

  /**
   * 
   * @param {Partial<ImsGalleryData>} initObject
   */
  constructor(initObject = {}) {
    Object.assign(this, initObject);
  }
}