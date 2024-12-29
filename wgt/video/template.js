import { html } from '@symbiotejs/symbiote';
export { ImsButton } from '../../lib/ims-button.js';
export { ImsRange } from '../../lib/ims-range.js';
export { ImsVideoToolbar } from './ims-video-toolbar.js';

export const template = html`
<div class="video-wrapper">
  <video 
    ref="video" 
    preload="metadata"
    crossorigin="anonymous">
  </video>
</div>
<ims-video-toolbar></ims-video-toolbar>
`;