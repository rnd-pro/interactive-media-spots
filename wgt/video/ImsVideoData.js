import { VERSION } from '../../lib/version.js';

export class ImsVideoData {
  // Common properties:
  imsType = 'video';
  version = VERSION;
  hideUi = false;
  autoplay = false;

  hlsSrc = '';
  sources = [];
  tracks = [];
  coverUrl = '';
  showCover = false;
  dispatchEvents = false;
  /**
   * 
   * @param {Partial<ImsVideoData>} initObject 
   */
  constructor(initObject = {}) {
    Object.assign(this, initObject);
  }
}