export class FullscreenMgr {

  static #initialized = false;
  /** @type {String} */
  static #fsIsName;
  /** @type {String} */
  static #_fsRequestName;
  /** @type {String} */
  static #_fsExitName
  /** @type {String} */
  static #fsCallbackName;

  /**
   * 
   * @param {String[]} names 
   * @returns 
   */
  static #getSupported(names) {
    let el = document.createElement('div');
    return names.find((name) => {
      return !!document[name] || !!el[name];
    });
  }

  static get #fsRequestName() {
    let names = [
      'requestFullscreen',
      'webkitRequestFullscreen',
      'mozRequestFullScreen',
      'msRequestFullscreen',
    ];
    if (!this.#_fsRequestName) {
      this.#_fsRequestName = this.#getSupported(names);
    }
    return this.#_fsRequestName;
  }

  static get #fsExitName() {
    let names = [
      'exitFullscreen',
      'webkitExitFullscreen',
      'msExitFullscreen',
      'mozCancelFullScreen',
    ];
    if (!this.#_fsExitName) {
      this.#_fsExitName = this.#getSupported(names);
    }
    return this.#_fsExitName;
  }

  static supported() {
    return !!this.#fsRequestName;
    // return false;
  }

  static #popEl;
  static #parentEl;
  static #current;
  static enable(el) {
    el[this.#fsRequestName]?.();
    if (!this.supported()) {
      this.#current = el;
      this.#parentEl = el.parentNode;
      this.#popEl = document.createElement('div');
      this.#popEl.style.position = 'fixed';
      this.#popEl.style.top = '0';
      this.#popEl.style.left = '0';
      this.#popEl.style.right = '0';
      this.#popEl.style.bottom = '0';
      this.#popEl.style.zIndex = '1000000';
      this.#popEl.appendChild(el);
      document.body.appendChild(this.#popEl);
    }
  }

  static disable() {
    let current = this.current || this.#current;
    if (current) {
      document[this.#fsExitName]?.();
      if (this.#popEl && this.#parentEl) {
        this.#parentEl.appendChild(current);
        this.#popEl = null;
        this.#parentEl = null;
        this.#current = null;
      }
    }
  }

  static get current() {
    return document[this.#fsIsName];
  }

  static init() {
    if (!this.supported()) {
      console.warn('Fullscreen API is not supported in your browser.'); // iOs on iPhone
      return;
    } else if (this.#initialized) {
      return;
    }

    if (this.#fsRequestName.startsWith('webkit')) {
      this.#fsCallbackName = 'onwebkitfullscreenchange';
      this.#fsIsName = 'webkitIsFullScreen';
    } else if (this.#fsRequestName.startsWith('moz')) {
      this.#fsCallbackName = 'onmozfullscreenchange';
      this.#fsIsName = 'mozFullScreen';
    } else if (this.#fsRequestName.startsWith('ms')) {
      this.#fsCallbackName = 'MSFullscreenChange';
      this.#fsIsName = 'webkitIsFullScreen';
    } else {
      this.#fsCallbackName = 'onfullscreenchange';
      this.#fsIsName = 'fullscreen';
    }
    this.#initialized = true;
  }

}
