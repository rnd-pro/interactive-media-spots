export class ImsDiffData {
  // Common properties:
  imsType = 'spinner';
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