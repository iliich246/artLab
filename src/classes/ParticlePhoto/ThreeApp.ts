import * as THREE from "three";
import { ParticlePhoto } from "./ParticlePhoto";
import Particles from "./Particles";

export default class ThreeApp {
  particlePhoto: ParticlePhoto;

  scene: THREE.Scene | undefined;

  camera: THREE.PerspectiveCamera | undefined;

  renderer: THREE.WebGLRenderer | undefined;

  clock: THREE.Clock | undefined;

  particles: Particles | undefined;

  constructor(particlePhoto: ParticlePhoto) {
    this.particlePhoto = particlePhoto;

    this.initThree();
    this.initParticles();
  }

  initThree() {
    if (!this.particlePhoto.threeContainer) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 300;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.clock = new THREE.Clock(true);
    
    this.particlePhoto.threeContainer.appendChild(this.renderer.domElement);
  }

  initParticles() {
    this.particles = new Particles(this);
    this.scene?.add(this.particles.container as THREE.Object3D);
  }
    
  
}
