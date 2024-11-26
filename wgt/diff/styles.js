import { css } from '@symbiotejs/symbiote';

export const DIFF_STYLES = css`
  :host {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: var(--color-fg);
    background-color: var(--color-bg);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    overflow: hidden;
    box-sizing: border-box;
  }
  canvas {
    height: 100%;
    width: 100%;
    object-fit: contain;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }
`;