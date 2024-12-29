import Symbiote, { html, css } from '@symbiotejs/symbiote';
import { ImsButton } from '../../lib/ims-button.js';
export { ImsRange } from '../../lib/ims-range.js';

ImsButton.icons = {
  ...ImsButton.icons,
  pause: 'M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z',
  unmute: 'M300-380v-200h148.46L620-751.53v543.06L448.46-380H300Z',
  mute: 'M561.54-155.62v-62q86.54-27.53 139.42-100 52.89-72.46 52.89-163.38t-52.89-163.38q-52.88-72.47-139.42-100v-62q111.69 29.92 182 119.92 70.3 90 70.3 205.46 0 115.46-70.3 205.46-70.31 90-182 119.92ZM146.16-380v-200h148.46l171.53-171.53v543.06L294.62-380H146.16Zm415.38 46.15v-294.3q40.46 22 62.54 61.96 22.07 39.96 22.07 86.19 0 45.61-22.27 84.88-22.27 39.27-62.34 61.27Z',
  captions_on: '',
  captions_off: '',
};

export class ImsVideoToolbar extends Symbiote {
  init$ = {
    fsStateIcon: 'fs_on',
  }

  initCallback() {
    this.sub('^fullscreen', (val) => {
      this.$.fsStateIcon = val ? 'fs_off' : 'fs_on';
    });
  }
}

ImsVideoToolbar.rootStyles = css`
ims-video-toolbar {
  position: relative;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  background-color: rgba(0, 0, 0, 1);
  backdrop-filter: blur(4px);
  transition: 0.4s;
  padding: 5px;
  gap: 5px;
  opacity: .8;

  .progress {
    position: absolute;
    top: -18px;
    right: 0;
    left: 0;
    display: flex;
    align-items: flex-end;
    height: 20px;
    cursor: pointer;

    .bar {
      height: 2px;
      background-color: #fff;
      transition: 0.5s;
    }
  }
}

ims-video-toolbar:hover {
  opacity: 1;
}

ims-video-toolbar .tb-block {
  display: flex;
  align-items: center;
  gap: 5px;
}
`;

ImsVideoToolbar.template = html`
<div 
  class="progress"
  ref="progress"
  ${{onclick: '^progressClicked'}}>
  <div class="bar" ${{'style.width': '^progressCssWidth'}}></div>
</div>

<div class="tb-block">
  <ims-button ${{onclick: '^onPP', '@icon': '^ppIcon'}}></ims-button>
  <div class="timer">{{^currentTime}} / {{^totalTime}}</div>
</div>

<div class="tb-block">
  <ims-button ${{onclick: '^onCap', '@hidden': '!^hasSubtitles'}} icon="captions_on"></ims-button>
  <ims-button ${{onclick: '^onMute', '@icon': '^volIcon'}}></ims-button>

  <ims-range 
    type="range" 
    ${{onchange: '^onVolChange', '@disabled': '^volumeDisabled', value: '^volumeValue'}}>
  </ims-range>

  <ims-button ${{onclick: '^onFs', '@icon': 'fsStateIcon'}}></ims-button>
</div>
`;

ImsVideoToolbar.reg('ims-video-toolbar');