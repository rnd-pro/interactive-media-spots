import Symbiote, { html } from '@symbiotejs/symbiote';

export class ImsPano extends Symbiote {}

ImsPano.template = html`
<canvas ref="canvas"></canvas>
`;

ImsPano.reg('ims-pano');

export default ImsPano;