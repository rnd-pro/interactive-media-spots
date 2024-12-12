import { VERSION } from '../../lib/version.js';

export class ImsPanoData {
  // Common properties:
  imsType = 'pano';
  version = VERSION;
  hideUi = false;
  baseUrl = '';
  /** @type {String[]} */
  variants = [];
  autoplay = false;
  dispatchEvents = false;
  startPosition = 50;
  maxVariantName = '';
  /** @type {String[]} */
  cdnIdList = [];
  /** @type {String[]} */
  srcList = [];

  /**
   * 
   * @param {Partial<ImsPanoData>} initObject 
   */
  constructor(initObject = {}) {
    Object.assign(this, initObject);
  }
}