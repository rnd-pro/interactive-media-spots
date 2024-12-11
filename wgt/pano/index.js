import Symbiote from '@symbiotejs/symbiote';
import { ImsPanoData } from './ImsPanoData.js';
import { loadSourceData } from '../../lib/loadSourceData.js';
import { ResizeController } from '../../lib/ResizeController.js';
import * as THREE from 'three';
import { template } from './template.js';
import { styles } from './styles.js';
import { FullscreenMgr } from '../../lib/FullscreenMgr.js';

export class ImsPano extends Symbiote {

  init$ = {
    fullscreen: false,
    onFs: () => {
      this.$.fullscreen = !this.$.fullscreen;
    },
    manual: false,
    onPlayPause: () => {
      this.$.manual = !this.$.manual;
      this.ref.toolbar.$.playStateIcon = this.$.manual ? 'play' : 'manual';
    },
  }

  /** @type {THREE.WebGLRenderer} */
  #renderer;

  /** @type {THREE.Scene} */
  #scene;

  /** @type {THREE.PerspectiveCamera} */
  #camera;

  /** @type {THREE.Mesh} */
  #pano;

  /** @type {DOMRect} */
  #rect;

  #userInteracting = false;
  #manual = false;
  #onPointerDownMouseX = 0;
  #onPointerDownMouseY = 0;
  #lon = 0;
  #lat = 0;
  #phi = 0;
  #theta = 0;

  #animate = () => {
    if (!(this.#userInteracting || this.$.manual)) {
      this.#lon += 0.1;
    }

    this.#lat = Math.max( -85, Math.min(85, this.#lat));
    this.#phi = THREE.MathUtils.degToRad(90 - this.#lat);
    this.#theta = THREE.MathUtils.degToRad(this.#lon);

    let x = 500 * Math.sin(this.#phi) * Math.cos(this.#theta);
    let y = 500 * Math.cos(this.#phi);
    let z = 500 * Math.sin(this.#phi) * Math.sin(this.#theta);

    this.#camera.lookAt( x, y, z );
    this.#renderer.render(this.#scene, this.#camera);
  }

  #onPointerMove = (e) =>{
    if (!e.isPrimary) return;
    this.#lon = ( this.#onPointerDownMouseX - e.clientX ) * 0.1 + this.#onPointerDownLon;
    this.#lat = ( e.clientY - this.#onPointerDownMouseY ) * 0.1 + this.#onPointerDownLat;
  }

  #onPointerUp = (e) => {
    if (!e.isPrimary) return;
    this.#userInteracting = false;
    document.removeEventListener('pointermove', this.#onPointerMove);
    document.removeEventListener('pointerup', this.#onPointerUp);
  }

  #onPointerDownLon = 0;
  #onPointerDownLat = 0;
  #onPointerDown = (e) => {
    if (!e.isPrimary) return;

    this.#userInteracting = true;

    this.#onPointerDownMouseX = e.clientX;
    this.#onPointerDownMouseY = e.clientY;

    this.#onPointerDownLon = this.#lon;
    this.#onPointerDownLat = this.#lat;

    document.addEventListener('pointermove', this.#onPointerMove);
    document.addEventListener('pointerup', this.#onPointerUp);
  }

  #onDocumentMouseWheel = (e) => {
    let fov = this.#camera.fov + e.deltaY * 0.05;
    this.#camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
    this.#camera.updateProjectionMatrix();
  }

  #onResize = () => {
    this.#rect = this.getBoundingClientRect();
    this.#camera.aspect = this.#rect.width / this.#rect.height;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(this.#rect.width, this.#rect.height);
  }

  /**
   * 
   * @param {ImsPanoData} srcData 
   */
  #init(srcData) {
    this.#rect = this.getBoundingClientRect();
    this.#renderer = new THREE.WebGLRenderer({ canvas: this.ref.canvas });
    this.#scene = new THREE.Scene();
    this.#camera = new THREE.PerspectiveCamera( 75, this.#rect.width / this.#rect.height, 1, 1100 );
    let geometry = new THREE.SphereGeometry( 500, 60, 40 );
    geometry.scale( -1, 1, 1 );
    let texture = new THREE.TextureLoader().load(srcData.srcList[0]);
    texture.colorSpace = THREE.SRGBColorSpace;
    let material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    this.#pano = new THREE.Mesh(geometry, material);
    this.#scene.add(this.#pano);
    this.#renderer.setPixelRatio(window.devicePixelRatio);
    this.#renderer.setSize(this.#rect.width, this.#rect.height);
    if (!srcData.autoplay) {
      this.$.manual = true;
      this.ref.toolbar.$.playStateIcon = 'play';
    }
    this.#renderer.setAnimationLoop(this.#animate);
    this.style.touchAction = 'none';
    this.addEventListener('pointerdown', this.#onPointerDown);
    this.addEventListener('wheel', this.#onDocumentMouseWheel);
    ResizeController.add(this, this.#onResize);
  }

  /** @type {ImsPanoData} */
  #srcData;
  renderCallback() {

    this.sub('srcData', async (srcDataUrl) => {
      this.#srcData = new ImsPanoData(await loadSourceData(srcDataUrl));
      this.#init(this.#srcData);
    });

    FullscreenMgr.init();
    this.sub('fullscreen', (val) => {
      if (val) {
        FullscreenMgr.enable(this);
      } else {
        FullscreenMgr.disable();
      }
    });
  }


}

ImsPano.bindAttributes({
  'src-data': 'srcData',
});

ImsPano.shadowStyles = styles;
ImsPano.template = template;

ImsPano.reg('ims-pano');

export default ImsPano;