import Symbiote, { html, css } from '@symbiotejs/symbiote';
export { ImsButton } from '../../lib/ims-button.js';
export { ImsRange } from '../../lib/ims-range.js';

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
  position: absolute;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  background-color: rgba(0, 0, 0, .3);
  backdrop-filter: blur(4px);
  transition: 0.4s;
  padding: 5px;
  gap: 5px;
  user-select: none;
  bottom: 10px;

  border-radius: 22px;

  &:hover {
    opacity: 1 !important;
    background-color: rgba(0, 0, 0, .6);
    box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
  }

  .tb-block {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .timer {
    font-size: 12px;
    padding-left: 5px;
    padding-right: 5px;
  }
}
`;

ImsVideoToolbar.template = html`
<div class="tb-block">
  <ims-button ${{onclick: '^onPP', '@icon': '^ppIcon'}}></ims-button>
  <div class="timer">{{^currentTime}} / {{^totalTime}}</div>
</div>

<div class="tb-block">
  <ims-button ${{onclick: '^onCap', '@hidden': '^noSubtitles', '@icon': '^capIcon'}}></ims-button>
  <ims-button ${{onclick: '^onMute', '@icon': '^volIcon'}}></ims-button>

  <ims-range 
    type="range" 
    ${{onchange: '^onVolChange', '@disabled': '^volumeDisabled', value: '^volumeValue'}}>
  </ims-range>

  <ims-button ${{onclick: '^onFs', '@icon': 'fsStateIcon'}}></ims-button>
</div>
`;

ImsVideoToolbar.reg('ims-video-toolbar');