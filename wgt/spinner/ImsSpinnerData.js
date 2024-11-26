export class ImsSpinnerData {
  autoplay = false;
  invertDirection = false;
  isCycled = true;
  motionBlur = false;
  placeholderUrl = '';
  showPlaceholder = true;
  speed = 50;
  dispatchEvents = false;
  baseUrl = '';
  /** @type {String[]} */
  variants = [];
  /** @type {String[]} */
  cdnIdList = [];
  /** @type {String[]} */
  srcList = [];
  startFrame = 1;

  /**
   * 
   * @param {Partial<ImsSpinnerData>} initObject
   */
  constructor(initObject = {}) {
    Object.assign(this, initObject);
  }
}