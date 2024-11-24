import Symbiote, { html, css } from '@symbiotejs/symbiote';

let ICONS = {
  play: 'M320-200v-560l440 280-440 280Z',
  stop: 'M240-240v-480h480v480H240Z',
  manual: 'M402-40q-30 0-56-13.5T303-92L48-465l24-23q19-19 45-22t47 12l116 81v-383q0-17 11.5-28.5T320-840q17 0 28.5 11.5T360-800v320h80v-400q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v400h80v-360q0-17 11.5-28.5T640-880q17 0 28.5 11.5T680-840v360h80v-280q0-17 11.5-28.5T800-800q17 0 28.5 11.5T840-760v560q0 66-47 113T680-40H402Z',
  fs_on: 'M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z',
  fs_off: 'M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z',
  zoom_in: 'M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Zm-40-60v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z',
  zoom_out: 'M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400ZM280-540v-80h200v80H280Z',
};

export class ImsButton extends Symbiote {
  constructor() {
    super();
    this.role = 'button';
  }

  initCallback() {
    this.sub('icon', (val) => {
      if (!val || !Object.keys(ICONS).includes(val)) {
        return;
      }
      this.$.d = ICONS[val];
    });
  }
}
ImsButton.rootStyles = css`
  ims-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #fff;
    background-color: rgba(255, 255, 255, .1);
    height: 32px;
    width: 32px;
    border-radius: 100%;
    transition: .3s;

    &:hover {
      background-color: rgba(255, 255, 255, .3);
    }

    &[disabled] {
      opacity: .2;
      pointer-events: none;
    }

    svg {
      height: 20px;
      width: 20px;
    }
  }
`;

ImsButton.template = html`
<svg xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 -960 960 960">
  <path fill="currentColor" ${{'@d': 'd'}} />
</svg>`;

ImsButton.bindAttributes({
  d: 'd',
  icon: 'icon',
});

ImsButton.reg('ims-button');

export default ImsButton;