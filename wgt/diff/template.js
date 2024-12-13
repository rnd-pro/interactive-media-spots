import { html } from '@symbiotejs/symbiote';
export { ImsDiffToolbar } from './ims-diff-toolbar.js';

export const DIFF_TPL = html`
<div slider ref="slider"></div>
<canvas ref="canvas"></canvas>
<ims-diff-toolbar></ims-diff-toolbar>
`;
