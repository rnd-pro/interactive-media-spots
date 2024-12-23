import { ImsBaseClass } from '../../lib/ImsBaseClass.js';
import { ImsPanoData } from './ImsPanoData.js';
import * as THREE from 'three';
import { template } from './template.js';
import { styles } from './styles.js';

export class ImsPano extends ImsBaseClass {

  dataClass = ImsPanoData;

  init$ = {
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

  #userInteracting = false;
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

    this.#camera.lookAt(x, y, z);
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
    if (!this.$.fullscreen) {
      return;
    }
    e.preventDefault();
    let fov = this.#camera.fov + e.deltaY * 0.05;
    this.#camera.fov = THREE.MathUtils.clamp(fov, 10, this.srcData.fov || 80);
    this.#camera.updateProjectionMatrix();
  }

  onResize = () => {
    let rect = this.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    super.onResize();
    this.#renderer.setSize(rect.width, rect.height);
    this.#camera.aspect = rect.width / rect.height;
    this.#camera.fov = this.srcData.fov || 80;
    this.#camera.updateProjectionMatrix();
  }

  init() {
    this.#renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.#scene = new THREE.Scene();
    this.#camera = new THREE.PerspectiveCamera(this.srcData.fov || 80, this.rect.width / this.rect.height, 1, 1100 );
    let geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    geometry.rotateY(THREE.MathUtils.degToRad(180));
    let texture = new THREE.TextureLoader().load(this.srcData.srcList[0]);
    texture.colorSpace = THREE.SRGBColorSpace;
    let material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    this.#pano = new THREE.Mesh(geometry, material);
    this.#scene.add(this.#pano);
    this.#renderer.setPixelRatio(window.devicePixelRatio);
    this.#renderer.setSize(this.rect.width, this.rect.height);
    if (this.srcData.autoplay) {
      this.ref.toolbar.$.playStateIcon = 'manual';
    } else {
      this.$.manual = true;
      this.ref.toolbar.$.playStateIcon = 'play';
    }
    this.#renderer.setAnimationLoop(this.#animate);
    this.style.touchAction = 'none';
    this.addEventListener('pointerdown', this.#onPointerDown);
    this.addEventListener('wheel', this.#onDocumentMouseWheel);
  }
}

ImsPano.shadowStyles = styles;
ImsPano.template = template;

ImsPano.reg('ims-pano');

export default ImsPano;