import * as THREE from "three";
import ThreeAnimator from "../AnimationBuilder/ThreeAnimator";
import TWEEN from "@tweenjs/tween.js";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import particleImg from "./assets/particle.png";
import fontResource from "./assets/font.json";

export class ParticleText extends ThreeAnimator {
  font: any;
  particle: THREE.Texture | undefined;
  scene: THREE.Scene | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;

  planeArea: THREE.Mesh | undefined;

  container: THREE.Object3D | undefined; 

  data = {
    text: 'FUTURE\nIS NOW',
    amount: 1500,
    particleSize: 1,
    particleColor: 0xffffff,
    textSize: 16,
    area: 250,
    ease: .05,
  }

  constructor() {
    super();
    
  }

  public initialization(): void {
    super.initialization();

    if (!this.isTreeContainerInitialized) {
      throw Error("You should setThreeContainer first before using this class");
    }

    const fontObject = {
      data: fontResource,
      isFont: true,
      type: "Font"
    };

    this.font = fontObject;

    new THREE.TextureLoader().load(particleImg.src, (texture) => {
      this.particle = texture; 
      
      this.initThree();
      this.initParticles();
    });
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 65, window.innerWidth /  window.innerHeight, 1, 10000 );
    this.camera.position.set( 0,0, 100 );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.threeContainer?.appendChild(this.renderer.domElement);
    this.scene.add(this.container as THREE.Object3D);
  }

  initParticles() {
    const geometry = new THREE.PlaneGeometry( 
      this.visibleWidthAtZDepth( 100, this.camera as THREE.PerspectiveCamera ), 
      this.visibleHeightAtZDepth( 100, this.camera as THREE.PerspectiveCamera )
    );
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true } );

		this.planeArea = new THREE.Mesh( geometry, material );
		this.planeArea.visible = false;
  }

  visibleHeightAtZDepth ( depth: number, camera: THREE.PerspectiveCamera ) {

	  const cameraOffset = camera.position.z;
	  if ( depth < cameraOffset ) depth -= cameraOffset;
	  else depth += cameraOffset;

	  const vFOV = camera.fov * Math.PI / 180; 

	  return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
	}

  visibleWidthAtZDepth( depth: number, camera: THREE.PerspectiveCamera ) {

	  const height = this.visibleHeightAtZDepth( depth, camera );
	  return height * camera.aspect;
	}

  createText() {

  }

  render() {

  }

  resize() {

  }
}

const particleText = new ParticleText();
export default particleText;
