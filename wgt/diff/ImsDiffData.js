import { VERSION } from '../../lib/version.js';

export class ImsDiffData {
  // Common properties:
  imsType = 'diff';
  version = VERSION;
  hideUi = false;
  urlTemplate = '';
  /** @type {String[]} */
  variants = [];

  dispatchEvents = false;
  startPosition = 50;
  maxVariantName = '';
  /** @type {String[]} */
  cdnIdList = [];
  /** @type {String[]} */
  srcList = [];
  /** @type {String[]} */
  filters = [];

  /**
   * 
   * @param {Partial<ImsDiffData>} initObject 
   */
  constructor(initObject = {}) {
    Object.assign(this, initObject);
  }
}