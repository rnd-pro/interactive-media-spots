import {css} from '@symbiotejs/symbiote';

export const styles = css`
  :host {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    max-height: 100vh;
    width: 100%;
    max-width: 100vw;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    user-select: none;
    overflow: hidden;
    background-color: var(--color-bg);
    color: var(--color-fg);
    cursor: grab;
  }
  :host(:active) {
    cursor: grabbing;
  }
  :host([active]:active) ims-pano-toolbar {
    opacity: .2;
  }
  :host([no-ui]) {
    ims-spinner-toolbar {
      display: none;
    }
  }

  canvas {
    box-sizing: border-box;
    transition: 0.1s;
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;
