export class ImsSpinnerData {
  // Common properties:
  imsType = 'spinner';
  hideUi = false;
  baseUrl = '';
  /** @type {String[]} */
  variants = [];

  // Specific properties:
  autoplay = false;
  invertDirection = false;
  isCycled = true;
  motionBlur = false;
  coverUrl = '';
  showCover = true;
  speed = 50;
  dispatchEvents = false;
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