import Symbiote, { html, css } from '@symbiotejs/symbiote';
import { ImsButton } from '../../lib/ims-button.js';
export { ImsRange } from '../../lib/ims-range.js';

ImsButton.icons = {
  ...ImsButton.icons,
  pause: 'M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z',
  mute: 'M778.92-74.46 658.31-195.08q-20.77 13.31-43.77 23.08-23 9.77-47.62 16.38v-62q12.85-4.61 25-9.42 12.16-4.81 23-11.42L471.54-381.85v173.38L300-380H151.54v-200h121.85L79.85-773.54 122-815.69l699.07 699.07-42.15 42.16Zm-19.54-216.23-43-43q20.85-32.54 31.85-69.81t11-77.5q0-90.92-52.88-163.38-52.89-72.47-139.43-100v-62Q679-776.46 749.11-686.46q70.12 90 70.12 205.46 0 52.62-15.65 101.04-15.66 48.42-44.2 89.27ZM636.92-413.15l-70-70v-145q40.46 22 62.54 61.96T651.54-480q0 17.69-3.66 34.5-3.65 16.81-10.96 32.35ZM471.54-578.54l-86.31-86.69 86.31-86.3v172.99Z',
  unmute: 'M561.54-155.62v-62q86.54-27.53 139.42-100 52.89-72.46 52.89-163.38t-52.89-163.38q-52.88-72.47-139.42-100v-62q111.69 29.92 182 119.92 70.3 90 70.3 205.46 0 115.46-70.3 205.46-70.31 90-182 119.92ZM146.16-380v-200h148.46l171.53-171.53v543.06L294.62-380H146.16Zm415.38 46.15v-294.3q40.46 22 62.54 61.96 22.07 39.96 22.07 86.19 0 45.61-22.27 84.88-22.27 39.27-62.34 61.27Z',
  captions_on: 'M212.31-180Q182-180 161-201q-21-21-21-51.31v-455.38Q140-738 161-759q21-21 51.31-21h535.38Q778-780 799-759q21 21 21 51.31v455.38Q820-222 799-201q-21 21-51.31 21H212.31Zm83.08-186.15H400q17.38 0 29.46-12.08 12.08-12.08 12.08-29.46v-27.69h-47.69V-420q0 2.31-1.93 4.23-1.92 1.92-4.23 1.92h-80q-2.3 0-4.23-1.92-1.92-1.92-1.92-4.23v-120q0-2.31 1.92-4.23 1.93-1.92 4.23-1.92h80q2.31 0 4.23 1.92 1.93 1.92 1.93 4.23v16.15h47.69v-28.46q0-17.38-12.08-29.46-12.08-12.08-29.46-12.08H295.39q-17.39 0-29.47 12.08-12.07 12.08-12.07 29.46v144.62q0 17.38 12.07 29.46 12.08 12.08 29.47 12.08Zm264.61 0h104.61q17.39 0 29.47-12.08 12.07-12.08 12.07-29.46v-27.69h-47.69V-420q0 2.31-1.92 4.23-1.93 1.92-4.23 1.92h-80q-2.31 0-4.23-1.92-1.93-1.92-1.93-4.23v-120q0-2.31 1.93-4.23 1.92-1.92 4.23-1.92h80q2.3 0 4.23 1.92 1.92 1.92 1.92 4.23v16.15h47.69v-28.46q0-17.38-12.07-29.46-12.08-12.08-29.47-12.08H560q-17.38 0-29.46 12.08-12.08 12.08-12.08 29.46v144.62q0 17.38 12.08 29.46 12.08 12.08 29.46 12.08Z',
  captions_off: 'M831.69-43.39 695.08-180H212.31Q182-180 161-201q-21-21-21-51.31v-455.38q0-6.23 1.73-11.39 1.73-5.15 4.81-9.46l-95.31-95.31L94-866.61 874.46-86.15l-42.77 42.76ZM820-253.85 694.46-379.39q5.85-5 8.77-12.53 2.92-7.54 2.92-15.77v-27.69h-47.69v16.92h-3.08l-89.23-89.23V-540q0-2.31 1.93-4.23 1.92-1.92 4.23-1.92h80q2.3 0 4.23 1.92 1.92 1.92 1.92 4.23v16.15h47.69v-28.46q0-17.38-12.07-29.46-12.08-12.08-29.47-12.08H560q-15.85 0-27.35 10.35-11.5 10.35-13.42 25.81v3.07L293.85-780h453.84Q778-780 799-759q21 21 21 51.31v453.84Zm-524.61-112.3H400q17.38 0 29.46-12.08 12.08-12.08 12.08-29.46v-7.39l-20.31-20.3h-27.38V-420q0 2.31-1.93 4.23-1.92 1.92-4.23 1.92h-80q-2.3 0-4.23-1.92-1.92-1.92-1.92-4.23v-124.31q0-2.31 1.92-4.23 1.93-1.92 4.23-1.92h16.93l-38.46-38.46H280q-11.23 3.07-18.69 13.3-7.46 10.24-7.46 23.31v144.62q0 17.38 12.07 29.46 12.08 12.08 29.47 12.08Z',
};
export {ImsButton}

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