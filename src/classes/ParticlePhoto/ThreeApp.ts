import * as THREE from "three";
import { ParticlePhoto } from "./ParticlePhoto";
import Particles from "./Particles";
import * as dat from "dat.gui";
import image from "../../assets/sample-02.png";

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
    //this.initParticles();
  }

  initThree() {
    if (!this.particlePhoto.threeContainer) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.camera.position.z = 300;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.clock = new THREE.Clock(true);
    const state = {
      cubeX: 0.01,
      cubeY: 0.01
    }
    const gui = new dat.GUI();
    gui.add(state, 'cubeX', -0.05, 0.05, 0.01);
    gui.add(state, 'cubeY', -0.05, 0.05, 0.01);
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
    this.particlePhoto.threeContainer.appendChild(this.renderer.domElement);

    this.particles = new Particles(this);
    this.particles.init(image.src);
    this.scene?.add(this.particles.container as THREE.Object3D);
    let x = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += state.cubeX;
      cube.rotation.y += state.cubeY;
      x = x + 0.1;
      this.particles.uniforms.uTime.value = x;
      this.renderer?.render(this.scene as THREE.Scene, this.camera as THREE.PerspectiveCamera);
    };

    animate();
  }

  initParticles() {
    this.particles = new Particles(this);
    this.particles.init(image.src);
    this.scene?.add(this.particles.container as THREE.Object3D);
  }

}
