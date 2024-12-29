import { css } from '@symbiotejs/symbiote';

export const styles = css`
:host {
  display: inline-grid;
  grid-template-rows: 1fr min-content;
  max-height: 100vh;
  overflow: hidden;
  font-family: monospace;
  background-color: #000;
  
  [hidden] {
    display: none !important;
  }

  lr-range[disabled] {
    opacity: 0.4;
    pointer-events: none;
  }

  .video-wrapper {
    overflow: hidden;
  }

  video {
    display: inline-block;
    width: 100%;
    max-width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #000;
  }

  &[playback] .toolbar {
    opacity: 0.2;
  }

}

:host([controls]) .toolbar {
  display: flex;
}

:host(:not([controls])) .progress {
  display: none;
}
`;