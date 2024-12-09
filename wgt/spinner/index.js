import Symbiote, { UID, kebabToCamel } from '@symbiotejs/symbiote';
import { ImageReader } from '../../lib/ImageReader.js';
import { FullscreenMgr } from '../../lib/FullscreenMgr.js';
import { template } from './template.js';
import { shadowCss } from './styles.js';
import { ImsSpinnerData } from './ImsSpinnerData.js';
import { getVariantFit } from '../../lib/getVariantFit.js';
import { imageToData } from '../../lib/imageToData.js';
import { ResizeController } from '../../lib/ResizeController.js';
import { loadSourceData } from '../../lib/loadSourceData.js'; 

const CURRENT_PLAY_EVENT_NAME = 'ims-current-play';

class ImsSpinner extends Symbiote {

  init$ = {
    srcDataUrl: '',
    fullscreen: false,
    progress: 0,

    onPlayPause: () => {
      this.togglePlay();
    },
    onStop: () => {
      this.#showCover();
      this.#currentFrame = this.#cfg?.startFrame || 0;
      this.#playStatusFlag = false;
      this.ref.toolbar.$.stopIconDisabled = true;
    },
    onZoomIn: () => {
      this.#zoomStepIn();
    },
    onZoomOut: () => {
      this.#zoomOut();
    },
    onFs: () => {
      this.$.fullscreen = !this.$.fullscreen;
    },
  }

  /** @type {HTMLImageElement[]} */
  #imgArray = [];
  #imageReader = new ImageReader();

  get #cfg() {
    return this.#_cfg;
  }

  /** @type {ImsSpinnerData} */
  #_cfg;

  /** @type {Partial<ImsSpinnerData>} */
  #override = {};

  /** @type {CanvasRenderingContext2D} */
  #ctx2d;

  #fillSrcVariantList() {
    if (this.#_cfg?.baseUrl && this.#_cfg?.cdnIdList?.length) {
      let variant = 'public';
      // console.log(variant);
      if (this.#_cfg.variants?.length) {
        variant = getVariantFit(this.#_cfg.variants, this).toString();
      }

      /** @type {String[]} */
      let srcList = [];
      this.#_cfg.cdnIdList.forEach((uid) => {
        srcList.push(this.#_cfg.baseUrl + uid + '/' + variant);
      });
      this.#_cfg.srcList = srcList;
    }
  }

  /**
   * 
   * @param {ImsSpinnerData} cfg 
   * @returns 
   */
  #setConfig(cfg) {
    if (!cfg) {
      return;
    }
    Object.assign(cfg, this.#override);
    this.#_cfg = new ImsSpinnerData(cfg);
    
    // console.log(this.#_cfg);

    this.#ctx2d = this.canvas.getContext('2d');

    this.currentFrame = (cfg.startFrame && cfg.startFrame - 1) || 0;
    this._directionStep = cfg.invertDirection ? -1 : 1;

    if (cfg.hideUi) {
      this.setAttribute('no-ui', '');
      this.#loadContents(cfg, true);
      this.togglePlay();
    }

    if (!cfg.showCover) {
      this.#loadContents(cfg, true);
      this.setAttribute('active', '');
    } else if (cfg.autoplay) {
      this.#loadContents(this.#cfg, true);
      this.togglePlay();
    } else {
      this.#showCover();
    }
  }

  set #loadProgress(/** @type {Number} **/ val) {
    this.$.progress = val;
  }

  /**
   * 
   * @param {ImsSpinnerData} cfg 
   * @param {Boolean} force 
   * @returns 
   */
  #loadContents(cfg, force = false) {
    if (!cfg) {
      return;
    }
    if (this._imgLoadingInitialized && !this.preview && !force) {
      return;
    }
    window.localStorage.setItem('IMS_CURRENT_PLAY', this.#localUid);
    window.dispatchEvent(new CustomEvent(CURRENT_PLAY_EVENT_NAME, {
      detail: {
        uid: this.#localUid,
      },
    }));
    this._imgLoadingInitialized = true;
    // if (cfg.showCover) {
    //   this.#drawPreviewImage();
    // }

    /**
     * 
     * @param {Number} val
     */
    let progressHandler = (val) => {
      this.#loadProgress = val;
      if (val === 100) {
        if (cfg.autoplay) {
          this.#play();
        } else {
          this.currentFrame = this.#currentFrame + 1;
        }
      }
    };
    // this.#imageReader.kill();
    this.#fillSrcVariantList();
    this.#imageReader.read(this.#imgArray, cfg.srcList, progressHandler);
    this.preview = false;
  }

  clear() {
    this.#ctx2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 
   * @param {HTMLImageElement} img 
   */
  drawFrame(img) {
    this.clear();
    this.canvas.height = img.height;
    this.canvas.width = img.width;
    this.#ctx2d.drawImage(img, 0, 0, img.width, img.height);
  }

  /** @type {Number} */
  #currentFrame;
  set currentFrame(/** @type {Number} **/ num) {
    if (num === this.#currentFrame) {
      return;
    }

    /** @type {Number} */
    this.#currentFrame = num;
    let img = this.#imgArray[ num ];
    if (img) {
      this.#ctx2d.filter = 'none';
      this.removeAttribute('loading');
      this.drawFrame(img);
      this._lastLoadedFrame = img;
    } else {
      this.setAttribute('loading', '');
      if (this._lastLoadedFrame) {
        this.#ctx2d.filter = 'blur(10px)';
        this.drawFrame(this._lastLoadedFrame);
      }
    }
  }

  get currentFrame() {
    return this.#currentFrame;
  }

  #drawPreviewImage() {
    let src = this.#cfg?.coverUrl || this.#cfg?.srcList[this.#cfg?.startFrame] || this.#cfg?.srcList[0];
    if (!src) {
      return;
    }
    let previewImage = document.createElement('img');
    previewImage.src = src;
    previewImage.onload = () => {
      this.#ctx2d.filter = 'none';
      this.drawFrame(previewImage);
    };
  }

  #showCover() {
    this.preview = true;
    this.#zoomOut();
    this.kill();
    this.$.progress = 0;
    this.removeAttribute('active');
    this.#drawPreviewImage();
    window.setTimeout(() => {
      this.#ctx2d && (this.#ctx2d.filter = 'none');
    }, 300);
  }

  /** @type {Boolean} */
  #_psFlagLoc;

  set #playStatusFlag(/** @type {Boolean} */ val) {
    if (this.#_psFlagLoc === val) {
      return;
    }

    /** @type {Boolean} */
    this.#_psFlagLoc = val;
    if (val) {
      this.ref.toolbar.$.playStateIcon = 'manual';
      this.ref.toolbar.$.stopIconDisabled = false;
      this.setAttribute('active', '');
    } else {
      this.ref.toolbar.$.playStateIcon = 'play';
    }
  }

  get #playStatusFlag() {
    return this.#_psFlagLoc;
  }

  /** @type {Number} */
  #playInterval;

  #play() {
    this.#playStatusFlag = true;
    if (this.preview) {
      this.#loadContents(this.#cfg, true);
    }
    if (this.#playInterval) {
      window.clearInterval(this.#playInterval);
    }
    this.#playInterval = window.setInterval(() => {
      if (this.currentFrame < this.#imgArray.length - 1 && this.currentFrame > 0) {
        this.currentFrame = this.currentFrame + this._directionStep;
      } else if (this.currentFrame === 0) {
        this.currentFrame = this._directionStep < 0 ? this.#imgArray.length - 1 : this.currentFrame + 1;
      } else if (this.currentFrame === this.#imgArray.length - 1) {
        this.currentFrame = this._directionStep < 0 ? this.currentFrame - 1 : 0;
      }
    }, this.#cfg.speed);
    
    ResizeController.add(this, () => {
      this.#onResize();
    });
  }

  togglePlay(e) {
    if (e) {
      e.preventDefault();
    }
    if (this.#playStatusFlag) {
      this.#pause();
    } else {
      this.#play();
    }
  }

  #pause() {
    this.#playStatusFlag = false;
    clearInterval(this.#playInterval);
  }

  #setCanvasTransforms() {
    window.requestAnimationFrame(() => {
      this.canvas.style.transform = `scale(${this._zoomLevel}) translate(${this._panX}px, ${this._panY}px)`;
    });
  }

  #zoomStepIn() {
    if (!this._zoomLevel) {
      this._zoomLevel = 1;
    }
    this._zoomLevel += 0.2;
    this._panX = 0;
    this._panY = 0;
    if (!this._rect) {
      this._rect = this.getBoundingClientRect();
    }
    this.#setCanvasTransforms();
    if (!this._zoomPanHandler) {
      this._zoomPanHandler = (e) => {
        this._panX = Math.round((this._rect.left + (this._rect.width / 2) - e.clientX) / (10 / this._zoomLevel));
        this._panY = Math.round((this._rect.top + (this._rect.height / 2) - e.clientY) / (10 / this._zoomLevel));
        this.#setCanvasTransforms();
      };
    }
    this.addEventListener('mousemove', this._zoomPanHandler);
  }

  #zoomOut() {
    this._zoomLevel = 1;
    this._panX = 0;
    this._panY = 0;
    this.canvas.style.transform = 'none';
    this.removeEventListener('mousemove', this._zoomPanHandler);
  }

  #onResize() { 
    this.#loadContents(this.#cfg, true);
  }

  initCallback() {
    let dataRef = new ImsSpinnerData();
    [...this.attributes].forEach((attr) => {
      let prop = kebabToCamel(attr.name);
      if (dataRef.hasOwnProperty(prop)) {
        try {
          this.#override[prop] = JSON.parse(this.getAttribute(attr.name));
        } catch(err) {
          console.warn('[IMS] Bad attribute value: ' + attr.name);
        }
      }
    });
  }

  #moveHandler = (e) => {
    if (e.touches) {
      e.preventDefault();
      e.movementX = e.touches[ 0 ].clientX - (this._touchStartX || e.touches[ 0 ].clientX);
      e.movementY = e.touches[ 0 ].clientY - (this._touchStartY || e.touches[ 0 ].clientY);
      this._touchStartX = e.touches[ 0 ].clientX;
      this._touchStartY = e.touches[ 0 ].clientY;
    }
    this._collectedMovement += e.movementX;
  };

  #moveEndHandler = () => {
    window.onmousemove = null;
    window.onmouseup = null;
    window.removeEventListener('touchmove', this.#moveHandler);
    window.removeEventListener('touchend', this.#moveEndHandler);
    window.removeEventListener('touchcancel', this.#moveEndHandler);
    this._moveInProgress = false;
    this._collectedMovement = (this._collectedMovement + this._lastCollectedMovement) / 2;
    this._inertiaFactor = 0.92;
  };

  #intervalInit = () => {
    this._moveInterval = setInterval(() => {
      let sizeFactor = this._componentWidth / (this._componentWidth / 500);
      let movementProportion = this._collectedMovement / sizeFactor;
      let frameShift = Math.round((this.#imgArray.length - 1) * movementProportion);
      let frame = this._directionStep > 0 ? this.currentFrame + frameShift : this.currentFrame - frameShift;
      if (frame > this.#imgArray.length - 1) {
        frame = Math.abs(frame - (this.#imgArray.length - 1));
      } if (frame < 0) {
        frame = this.#imgArray.length - 1 - Math.abs(frame);
      }
      this.currentFrame = frame > -1 && frame < this.#imgArray.length ? frame : 0;
      if (this._moveInProgress) {
        this._lastCollectedMovement = this._collectedMovement;
        this._collectedMovement = 0;
      } else {
        if (Math.abs(this._collectedMovement) < 0.6) {
          clearInterval(this._moveInterval);
        } else {
          this._collectedMovement = this._collectedMovement * this._inertiaFactor;
        }
      }
    }, this.#cfg.speed / 2);
  };

  #moveStartHandler = (e) => {
    if (this.preview) {
      return;
    }
    this.#pause();
    this._moveInProgress = true;
    if (e.touches) {
      this._touchStartX = e.touches[ 0 ].clientX;
      this._touchStartY = e.touches[ 0 ].clientY;
    }
    this._moveFrame = this.currentFrame;
    let rect = this.getBoundingClientRect();
    this._componentWidth = rect.width;
    window.onmousemove = this.#moveHandler;
    window.onmouseup = this.#moveEndHandler;

    window.addEventListener('touchmove', this.#moveHandler, { passive: false });
    window.addEventListener('touchend', this.#moveEndHandler);
    window.addEventListener('touchcancel', this.#moveEndHandler);

    this._collectedMovement = 0;

    this.#intervalInit();
  };

  #localUid = UID.generate();

  renderCallback() {

    /** @type {HTMLCanvasElement} */
    this.canvas = this.ref.canvas;

    FullscreenMgr.init();
    this.sub('fullscreen', (val) => {
      val ? FullscreenMgr.enable(this) : FullscreenMgr.disable();
    }, false);

    this.sub('srcDataUrl', async (dataUrl) => {
      if (!dataUrl) {
        return;
      }
      this.#setConfig(await loadSourceData(dataUrl));
    });

    this.ref.sensor.onmousedown = this.#moveStartHandler;
    this.ref.sensor.addEventListener('touchstart', this.#moveStartHandler);

    window.onkeyup = (e) => {
      if (e.keyCode === 32) {
        this.togglePlay(e);
        this.setAttribute('active', '');
      }
    };

    window.addEventListener('storage', (e) => {
      if (e.key === 'IMS_CURRENT_PLAY' && window.localStorage.getItem('IMS_CURRENT_PLAY') !== this.#localUid) {
        this.#showCover();
        this.#playStatusFlag = false;
      }
    });

    window.addEventListener(CURRENT_PLAY_EVENT_NAME, (e) => {
      if (this.#cfg.multiplePlay) {
        return;
      }
      if (e['detail'].uid !== this.#localUid) {
        this.#showCover();
        this.#playStatusFlag = false;
      }
    });
  }

  kill() {
    this._imgLoadingInitialized = false;
    this.#imageReader.clear();
    this.#playInterval && window.clearInterval(this.#playInterval);
  }

  destroyCallback() {
    this.kill();
    this.#imgArray = [];
    ResizeController.remove(this);
  }
}

ImsSpinner.bindAttributes({
  'src-data': 'srcDataUrl',
});

ImsSpinner.shadowStyles = shadowCss;
ImsSpinner.template = template;
ImsSpinner.reg('ims-spinner');

export { ImsSpinner, ImsSpinnerData }
export default ImsSpinner;

