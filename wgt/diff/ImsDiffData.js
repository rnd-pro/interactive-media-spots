import { VERSION } from '../../lib/version.js';

export class ImsDiffData {
  // Common properties:
  imsType = 'diff';
  version = VERSION;
  hideUi = false;
  baseUrl = '';
  /** @type {String[]} */
  variants = [];

  dispatchEvents = false;
  startPosition = 50;
  maxVariantName = '';
  /** @type {String[]} */
  cdnIdList = [];

  /**
   * 
   * @param {Partial<ImsDiffData>} initObject 
   */
  constructor(initObject = {}) {
    Object.assign(this, initObject);
  }
}