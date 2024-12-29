import Symbiote, { html, css} from '@symbiotejs/symbiote';

export class ImsRange extends Symbiote {

  init$ = {
    cssLeft: '50%',
    barActive: false,
    value: 50,
    onChange: (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.$.value = parseFloat(this._range.value);
      this.dispatchEvent(new Event('change'));
    },
  };

  renderCallback() {
    /** @type {HTMLInputElement} */
    this._range = this.ref.range;
    [...this.attributes].forEach((attr) => {
      let exclude = ['style', 'ref'];
      if (!exclude.includes(attr.name)) {
        this.ref.range.setAttribute(attr.name, attr.value);
      }
    });
    this.sub('value', (val) => {
      let pcnt = (val / 100) * 100;
      this.$.cssLeft = `${pcnt}%`;
    });
    this.defineAccessor('value', (val) => {
      this.$.value = val;
    });
  }
}

ImsRange.rootStyles = css`
ims-range {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--ui-size);
}

ims-range[disabled] {
  opacity: .3;
  pointer-events: none;
}

ims-range datalist {
  display: none;
}

ims-range input {
  width: 100%;
  height: 100%;
  opacity: 0;
}

ims-range .track-wrapper {
  position: absolute;
  right: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2px;
  user-select: none;
  pointer-events: none;
}

ims-range .track {
  position: absolute;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2px;
  background-color: currentColor;
  border-radius: 2px;
  opacity: 0.5;
}

ims-range .slider {
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: currentColor;
  border-radius: 100%;
  transform: translateX(-50%);
}

ims-range .bar {
  position: absolute;
  left: 0;
  height: 100%;
  background-color: currentColor;
  border-radius: 2px;
}

ims-range .caption {
  position: absolute;
  display: inline-flex;
  justify-content: center;
}
`;

ImsRange.template = html`
<div class="track-wrapper">
  <div class="track"></div>
  <div class="bar" ${{'style.width': 'cssLeft', '@active': 'barActive'}}></div>
  <div class="slider" ${{'style.left': 'cssLeft'}}></div>
</div>

<input type="range" ref="range" ${{value: 'value', oninput: 'onChange'}} />
`;

ImsRange.reg('ims-range');
