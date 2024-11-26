export class ImsDiffData {
  dispatchEvents = false;
  startPosition = 50;
  /** @type {String[]} */
  variants = [];
  maxVariantName = '';
  baseUrl = '';
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