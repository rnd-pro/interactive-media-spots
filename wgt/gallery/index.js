import Symbiote, { html } from '@symbiotejs/symbiote';

export class ImsGallery extends Symbiote {}

ImsGallery.template = html`
<canvas ref="canvas"></canvas>
`;

ImsGallery.reg('ims-gallery');

export default ImsGallery;