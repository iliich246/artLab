import * as THREE from "three";
import ThreeAnimator from "../AnimationBuilder/ThreeAnimator";
import TWEEN from "@tweenjs/tween.js";

import particleImg from "./assets/particle.png"

export class ParticleText extends ThreeAnimator {
  font: any;
  particle: THREE.Texture | undefined;
  scene: THREE.Scene | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;

  constructor() {
    super();
    this.particle = new THREE.TextureLoader().load(particleImg.src);
  }

  public initialization(): void {
    super.initialization();
    
  }

  render() {

  }

  resize() {

  }
}

const particleText = new ParticleText();
export default particleText;
