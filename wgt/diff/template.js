import { html } from '@symbiotejs/symbiote';
export { ImsDiffToolbar } from './ims-diff-toolbar.js';

export const DIFF_TPL = html`
<canvas ref="canvas"></canvas>
<div slider ref="slider"></div>
<ims-diff-toolbar></ims-diff-toolbar>
`;
