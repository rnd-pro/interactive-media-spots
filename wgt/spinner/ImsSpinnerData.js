import { VERSION } from '../../lib/version.js';

export class ImsSpinnerData {
  // Common properties:
  imsType = 'spinner';
  version = VERSION;
  hideUi = false;
  baseUrl = '';
  /** @type {String[]} */
  variants = [];

  // Specific properties:
  autoplay = false;
  startFrame = 1;
  invertDirection = false;
  isCycled = true;
  motionBlur = false;
  coverUrl = '';
  showCover = true;
  speed = 50;
  multiplePlay = false;
  dispatchEvents = false;
  /** @type {String[]} */
  cdnIdList = [];
  /** @type {String[]} */
  srcList = [];

  /**
   * 
   * @param {Partial<ImsSpinnerData>} initObject
   */
  constructor(initObject = {}) {
    Object.assign(this, initObject);
  }
}