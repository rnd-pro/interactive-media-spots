export class FullscreenMgr {

  static _getSupported(names) {
    return names.find((name) => {
      return !!document[name] || !!document.createElement('div')[name];
    });
  }

  static get _fsRequestName() {
    let names = [
      'requestFullscreen',
      'webkitRequestFullscreen',
      'mozRequestFullScreen',
      'msRequestFullscreen',
    ];
    return this._getSupported(names);
  }

  static get _fsExitName() {
    let names = [
      'exitFullscreen',
      'webkitExitFullscreen',
      'msExitFullscreen',
      'mozCancelFullScreen',
    ];
    return this._getSupported(names);
  }

  static enable(el) {
    el[this._fsRequestName]();
  }

  static disable() {
    document[this._fsExitName]();
  }

  static get current() {
    return document[this._fsIsName];
  }

  static init() {
    if (this._initialized) {
      return;
    }

    if (this._fsRequestName.includes('webkit')) {
      this._fsCallbackName = 'onwebkitfullscreenchange';
      this._fsIsName = 'webkitIsFullScreen';
    } else if (this._fsRequestName.includes('moz')) {
      this._fsCallbackName = 'onmozfullscreenchange';
      this._fsIsName = 'mozFullScreen';
    } else if (this._fsRequestName.includes('ms')) {
      this._fsCallbackName = 'MSFullscreenChange';
      this._fsIsName = 'webkitIsFullScreen';
    } else {
      this._fsCallbackName = 'onfullscreenchange';
      this._fsIsName = 'fullscreen';
    }
    this._initialized = true;
  }

}
