import ImsBaseClass from '../../lib/ImsBaseClass.js';
import { template } from './template.js';
import { styles } from './styles.js';
import { ImsVideoData } from './ImsVideoData.js';
import 'https://cdn.jsdelivr.net/npm/hls.js@1';

/** @enum {String} */
const ICO_MAP = {
  PLAY: 'play',
  PAUSE: 'pause',
  VOL_ON: 'unmute',
  VOL_OFF: 'mute',
  CAP_ON: 'captions',
  CAP_OFF: 'captions-off',
};

export class ImsVideo extends ImsBaseClass {

  dataClass = ImsVideoData;

  togglePlay() {
    if (this.#video.paused || this.#video.ended) {
      this.#video.play();
    } else {
      this.#video.pause();
    }
  }

  toggleCaptions() {
    if (this.$.capIcon === ICO_MAP.CAP_OFF) {
      this.$.capIcon = ICO_MAP.CAP_ON;
      this.#video.textTracks[0].mode = 'showing';
      window.localStorage.setItem(ImsVideo.is + ':captions', '1');
    } else {
      this.$.capIcon = ICO_MAP.CAP_OFF;
      this.#video.textTracks[0].mode = 'hidden';
      window.localStorage.removeItem(ImsVideo.is + ':captions');
    }
  }

  toggleSound() {
    if (this.$.volIcon === ICO_MAP.VOL_ON) {
      this.$.volIcon = ICO_MAP.VOL_OFF;
      this.$.volumeDisabled = true;
      this.#video.muted = true;
    } else {
      this.$.volIcon = ICO_MAP.VOL_ON;
      this.$.volumeDisabled = false;
      this.#video.muted = false;
    }
  }

  setVolume(val) {
    window.localStorage.setItem(ImsVideo.is + ':volume', val);
    let volume = val ? val / 100 : 0;
    this.#video.volume = volume;
  }

  init$ = {
    src: '',
    ppIcon: ICO_MAP.PLAY,
    volIcon: ICO_MAP.VOL_ON,
    capIcon: ICO_MAP.CAP_OFF,
    totalTime: '00:00',
    currentTime: '00:00',
    progressCssWidth: '0',
    hasSubtitles: false,
    volumeDisabled: false,
    volumeValue: 0,
    onPP: () => {
      this.togglePlay();
    },
    onCap: () => {
      this.toggleCaptions();
    },
    onMute: () => {
      this.toggleSound();
    },
    onVolChange: (e) => {
      // TODO: cast range.value instead of range.$.value
      let val = parseFloat(e.currentTarget.$.value);
      this.setVolume(val);
    },
    progressClicked: (e) => {
      this.#video.currentTime = this.#video.duration * (e.offsetX / this.rect.width);
    },
  };

  /**
   * @param {Object<string, any>} desc
   */
  #desc2attrs(desc) {
    let attrs = [];
    for (let attr in desc) {
      let val = attr === 'src' ? desc[attr] : desc[attr];
      attrs.push(`${attr}="${val}"`);
    }
    return attrs.join(' ');
  }

  /**
   * @param {Number} seconds
   */
  #timeFmt(seconds) {
    // TODO: add hours
    let date = new Date(Math.round(seconds) * 1000);
    return [date.getMinutes(), date.getSeconds()]
      .map((n) => {
        return n < 10 ? '0' + n : n;
      })
      .join(':');
  }

  #initTracks() {
    [...this.#video.textTracks].forEach((track) => {
      track.mode = 'hidden';
    });
    if (window.localStorage.getItem(ImsVideo.is + ':captions')) {
      this.toggleCaptions();
    }
  }

  #castAttributes() {
    let toCast = ['autoplay', 'loop', 'muted'];
    [...this.attributes].forEach((attr) => {
      if (toCast.includes(attr.name)) {
        this.#video.setAttribute(attr.name, attr.value);
      }
    });
  }

  init() {
    if (this.srcData.coverUrl) {
      this.#video.poster = this.srcData.coverUrl;
    }
    if (this.srcData.hlsSrc) {
      // @ts-ignore
      let hls = new Hls();
      hls.loadSource(this.srcData.hlsSrc);
      hls.attachMedia(this.#video);
    } else {
      let html = '';
      this.srcData.sources.forEach((srcDesc) => {
        html += /*html*/ `<source ${this.#desc2attrs(srcDesc)}>`;
      });
      this.#video.innerHTML += html;
      this.#initTracks();
    }
    if (!this.srcData.hideUi) {
      this.setAttribute('controls', '');
    }
  }

  /**
   * @returns {HTMLVideoElement}
   */
  get #video() {
    return this.ref.video;
  }

  initCallback() {
    super.initCallback();

    this.#castAttributes();

    this.#video.addEventListener('play', () => {
      this.$.ppIcon = ICO_MAP.PAUSE;
      this.setAttribute('playback', '');
    });

    this.#video.addEventListener('pause', () => {
      this.$.ppIcon = ICO_MAP.PLAY;
      this.removeAttribute('playback');
    });

    this.#video.addEventListener('loadedmetadata', (e) => {
      this.$.currentTime = this.#timeFmt(this.#video.currentTime);
      this.$.totalTime = this.#timeFmt(this.#video.duration);
    });

    this.#video.addEventListener('timeupdate', (e) => {
      let perc = Math.round(100 * (this.#video.currentTime / this.#video.duration));
      this.$.progressCssWidth = perc + '%';
      this.$.currentTime = this.#timeFmt(this.#video.currentTime);
    });

    let volume = window.localStorage.getItem(ImsVideo.is + ':volume');
    if (volume) {
      let vol = parseFloat(volume);
      this.setVolume(vol);
      this.$.volumeValue = vol;
    }
  }
}

ImsVideo.shadowStyles = styles;
ImsVideo.template = template;

ImsVideo.reg('ims-video');
