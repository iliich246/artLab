import * as THREE from "three";
import ThreeAnimator from "../AnimationBuilder/ThreeAnimator";
import image from "../../assets/sample-02.png";
import TouchTexture from "./TouchTexture";
import ThreeControls from "../AnimationBuilder/ThreeControls";

const glslify = require('glslify');

import vertShader from "./shaders/particle.vert";
import fragShader from "./shaders/particle.frag";


type InteractiveParticlesUniforms = {
  uTime: { value: number };
  uRandom: { value: number };
  uDepth: { value: number };
  uSize: { value: number };
  uTextureSize: { value: THREE.Vector2 };
  uTexture: { value: THREE.Texture | null };
  uTouch: { value: THREE.Texture | null };
};

export class InteractiveParticles extends ThreeAnimator{

  container: THREE.Object3D | undefined;
	object3D: THREE.Object3D | undefined;
  scene: THREE.Scene | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  texture: THREE.Texture | undefined;
  touchTexture: TouchTexture | undefined;
  hitArea: THREE.Mesh | undefined;

  fovHeight: number = 0; 
  threeControls: ThreeControls | undefined;

  width: number = 0;
  height: number = 0;
  numPoints: number = 0;

  uniforms: InteractiveParticlesUniforms = {
    uTime: { value: 0 },
    uRandom: { value: 1.0 },
    uDepth: { value: 2.0 },
    uSize: { value: 1.90 },
    uTextureSize: { value: new THREE.Vector2(this.width, this.height) },
    uTexture: { value: null },
    uTouch: { value: null },
  };

  constructor() {
    super();
  }

  initialization() {
    super.initialization();

    if (!this.isTreeContainerInitialized) {
      throw Error("You should setThreeContainer first before using this class");
    }

    this.container = new THREE.Object3D();

    const loader = new THREE.TextureLoader();

    loader.load(image.src, (texture) => {
      this.texture = texture;
			this.texture.minFilter = THREE.LinearFilter;
			this.texture.magFilter = THREE.LinearFilter;
			this.texture.format = THREE.RGBAFormat;

			this.width = texture.image.width;
			this.height = texture.image.height;

      this.initThree();
      this.initPoints();
      this.initTouch();
      this.initHitArea();
      this.startSequence();
    });

    this.scene = new THREE.Scene();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 300;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.threeContainer?.appendChild(this.renderer.domElement);
    this.scene.add(this.container as THREE.Object3D);
    this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
    
  
  }

  initPoints() {
    if (!this.texture) {
      throw Error("No texture specified");
    }

    if (!this.width && !this.height) {
      throw Error("No width or height specified");
    }

    this.numPoints = this.width * this.height;

    let numVisible = this.numPoints;
		let threshold = 0;
		let originalColors;

    numVisible = 0;
		threshold = 34;

    const img = this.texture.image;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');  
    
    if (!ctx) {
      throw Error("No canvas context");
    }

    canvas.width = this.width;
    canvas.height = this.height;
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, this.width, this.height * -1);
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    originalColors = Float32Array.from(imgData.data);

    for (let i = 0; i < this.numPoints; i++) {
      if (originalColors[i * 4 + 0] > threshold) numVisible++;
    }

    this.uniforms.uTexture.value = this.texture as THREE.Texture;
    this.uniforms.uTextureSize.value = new THREE.Vector2(this.width, this.height);
    
		const material = new THREE.RawShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: glslify(vertShader),
			fragmentShader: glslify(fragShader),
			depthTest: false,
			transparent: true,
			// blending: THREE.AdditiveBlending
		}); 
    
    const geometry = new THREE.InstancedBufferGeometry();

		const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
		positions.setXYZ(0, -0.5,  0.5,  0.0);
		positions.setXYZ(1,  0.5,  0.5,  0.0);
		positions.setXYZ(2, -0.5, -0.5,  0.0);
		positions.setXYZ(3,  0.5, -0.5,  0.0);
		geometry.setAttribute("position", positions);   

		const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
		uvs.setXYZ(0, 0.0, 0.0, 0.0);
		uvs.setXYZ(1, 1.0, 0.0, 0.0);
		uvs.setXYZ(2, 0.0, 1.0, 0.0);
		uvs.setXYZ(3, 1.0, 1.0, 0.0);
		geometry.setAttribute("uv", uvs);  
    
    geometry.setIndex(
			new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1)
		);

		const indices = new Uint16Array(numVisible);
		const offsets = new Float32Array(numVisible * 3);
		const angles = new Float32Array(numVisible); 
    
		for (let i = 0, j = 0; i < this.numPoints; i++) {
			if (originalColors[i * 4 + 0] <= threshold) continue;
	
			offsets[j * 3 + 0] = i % this.width;
			offsets[j * 3 + 1] = Math.floor(i / this.width);
	
			indices[j] = i;
	
			angles[j] = Math.random() * Math.PI;
	
			j++;
		}      

		geometry.setAttribute(
			"pindex",
			new THREE.InstancedBufferAttribute(indices, 1, false)
		);
		geometry.setAttribute(
			"offset",
			new THREE.InstancedBufferAttribute(offsets, 3, false)
		);
		geometry.setAttribute(
			"angle",
			new THREE.InstancedBufferAttribute(angles, 1, false)
		);  
    
		this.object3D = new THREE.Mesh(geometry, material);
		this.container?.add(this.object3D);
  }

  initTouch() {
    this.touchTexture = new TouchTexture(this);
    this.uniforms.uTouch.value = this.touchTexture.texture;
  }

  initHitArea() {
    const geometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true, depthTest: false });
		material.visible = false;
		this.hitArea = new THREE.Mesh(geometry, material);
		this.container?.add(this.hitArea);

    setTimeout(() => {
      console.log([`XXX`, this.renderer?.domElement]);
      
      this.renderer.domElement.tabIndex = 1;
      this.renderer.domElement.focus();
    }, 0);
    setTimeout(() => {
      console.log([`XXX`, 'hitArea', this.hitArea]);
      
      this.threeControls = new ThreeControls(this, this.camera as THREE.Camera, this.renderer?.domElement as HTMLElement);
      this.threeControls?.objects.push(this.hitArea);
      this.renderer.domElement.focus();
      this.threeControls?.enable();
    }, 0);  

  }

  render() {
    this.uniforms.uTime.value += 0.01;
    this.uniforms.uSize.value = Math.random() * 0.1 + 0.5;
    this.uniforms.uDepth.value = Math.random() * 0.1 + 0.5;
    this.renderer?.render(this.scene as THREE.Scene, this.camera as THREE.PerspectiveCamera);
  }

  protected resize(): void {
    if (!this.object3D) {
      throw Error("object3D not initialized");
    };

    if (!this.camera) {
      throw Error("camera not initialized");
    };

    if (!this.renderer) {
      throw Error("renderer not initialized");
    };

    if (!this.hitArea) {
      throw Error("hitArea not initialized");
    }

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
    const scale = this.fovHeight / this.height;
    this.object3D.scale.set(scale, scale, 1);
		this.hitArea.scale.set(scale, scale, 1);

      
  }
}

const interactiveParticles = new InteractiveParticles();
export default interactiveParticles;
