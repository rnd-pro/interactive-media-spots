import Symbiote, { html, css } from '@symbiotejs/symbiote';
export { ImsButton } from '../../lib/ims-button.js';

export class ImsDiffToolbar extends Symbiote {
  init$ = {
    fsStateIcon: 'fs_on',
  }

  initCallback() {
    this.sub('^fullscreen', (val) => {
      this.$.fsStateIcon = val ? 'fs_off' : 'fs_on';
    });
  }
}

ImsDiffToolbar.rootStyles = css`
ims-diff-toolbar {
  position: absolute;
  display: inline-flex;
  gap: 5px;
  background-color: rgba(0, 0, 0, .3);
  backdrop-filter: blur(4px);
  color: #fff;
  padding: 5px;
  z-index: 10000;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  border-radius: 22px;
  transition: .5s;

  &:hover {
    background-color: rgba(0, 0, 0, .6);
    box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
  }
}
`;

ImsDiffToolbar.template = html`
<ims-button ${{onclick: '^onFs', '@icon': 'fsStateIcon'}}></ims-button>
`;

ImsDiffToolbar.reg('ims-diff-toolbar');