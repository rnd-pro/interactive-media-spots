import { css } from '@symbiotejs/symbiote';

export const styles = css`
:host {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  font-family: monospace;
  
  [hidden] {
    display: none !important;
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
  }

  .progress {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: flex-end;
    height: 20px;
    cursor: pointer;
    transition: .2s;

    .bar {
      height: 2px;
      background-color: currentColor;
      transition: 0.5s;
    }

    &:hover {
      .bar {
        height: 4px;
        background-color: rgb(240, 0, 0);
      }
    }
  }
}
:host([playback]) ims-video-toolbar {
  opacity: .1;
}
`;
