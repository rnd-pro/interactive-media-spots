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
<div 
  class="progress"
  ref="progress"
  ${{onclick: 'progressClicked'}}>
  <div class="bar" ${{'style.width': 'progressCssWidth'}}></div>
</div>
<ims-video-toolbar></ims-video-toolbar>
`;