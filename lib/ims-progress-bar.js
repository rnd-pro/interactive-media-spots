import Symbiote, { css } from '@symbiotejs/symbiote';

export class ImsProgressBar extends Symbiote {

  renderCallback() {
    this.sub('^progress', (val) => {
      this.style.width = val + '%';
      if (val >= 98) {
        window.setTimeout(() => {
          this.setAttribute('finished', '');
          let onTransitionEnd = () => {
            this.style.display = 'none';
            this.removeEventListener('transitionend', onTransitionEnd);
          };
          this.addEventListener('transitionend', onTransitionEnd);
        }, 1000);
      } else if (val <= 3) {
        this.removeAttribute('finished');
        this.style.display = 'block';
      }
    });
  }

}

ImsProgressBar.rootStyles = css`
  ims-progress-bar {
    position: absolute;
    border-top: 2px solid #000;
    background-color: #fff;
    height: 2px;
    bottom: 0;
    left: 0;
    transition: 0.8s;
    pointer-events: none;
    
    &[finished] {
      opacity: 0;
    }
  }
`;

ImsProgressBar.reg('ims-progress-bar');

export default ImsProgressBar;

