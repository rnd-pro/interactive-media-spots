import { css } from '@symbiotejs/symbiote';

export const shadowCss = css`
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
}
:host([active]) {
  cursor: grab;
}
:host([active]:active) {
  cursor: grabbing;
}
:host([active]:active) ims-spinner-toolbar {
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
[sensor] {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 44px;
  box-sizing: border-box;
}
slot {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.2s;
}
:host([active]) slot {
  opacity: 0;
  pointer-events: none;
}
`;