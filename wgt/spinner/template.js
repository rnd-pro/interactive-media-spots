import { html } from '@symbiotejs/symbiote';
export { ImsSpinnerToolbar} from './ims-spinner-toolbar.js';
export { ImsProgressBar } from '../../lib/ims-progress-bar.js';

export const template = html`
<canvas ref="canvas"></canvas>
<div sensor ref="sensor"></div>
<ims-progress-bar></ims-progress-bar>
<slot></slot>
<ims-spinner-toolbar ref="toolbar"></ims-spinner-toolbar>
`;