import { html } from '@symbiotejs/symbiote';
export { ImsPanoToolbar} from './ims-pano-toolbar.js';
export { ImsProgressBar } from '../../lib/ims-progress-bar.js';

export const template = html`
<canvas ref="canvas"></canvas>
<ims-pano-toolbar ref="toolbar"></ims-pano-toolbar>
`;
