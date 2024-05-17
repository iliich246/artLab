import * as THREE from "three";
import ThreeApp from "./ThreeApp";
import vertShader from "./shaders/particle.vert";
import fragShader from "./shaders/particle.frag";

const glslify = require("glslify");
// import ss from "./shaders/particle.frag";
// const s = glslify(ss);
 console.log([`XXX`, glslify(vertShader)]);

export default class Particles {
  threeApp: ThreeApp | undefined;
  container: THREE.Object3D | undefined;
	object3D: THREE.Object3D | undefined;
  texture: THREE.Texture | undefined;
  width: number | undefined;
  height: number | undefined;

	uniforms = {
		uTime: { value: 0 },
		uRandom: { value: 1.0 },
		uDepth: { value: 2.0 },
		uSize: { value: 0.0 },
		uTextureSize: { value: null },
		uTexture: { value: null },
		uTouch: { value: null },
	}


  constructor(threeApp: ThreeApp) {
    this.threeApp = threeApp;
    this.container = new THREE.Object3D();
  }

  init(src: string) {
    const loader = new THREE.TextureLoader();

    loader.load(src, (texture) => {
			this.texture = texture;
			this.texture.minFilter = THREE.LinearFilter;
			this.texture.magFilter = THREE.LinearFilter;
			this.texture.format = THREE.RGBAFormat;

			this.width = texture.image.width;
			this.height = texture.image.height;

			this.initPoints(true);
			// this.initHitArea();
			// this.initTouch();
			// this.resize();
			// this.show();
		});
  }

  initPoints(discard: boolean = true) {
    const numPoints = (this.width || 0) * (this.height || 0);

    let numVisible = numPoints;
		let threshold = 0;
		let originalColors;

    //if (discard) {
      numVisible = 0;
			threshold = 34;

      const img = this.texture?.image;
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

      canvas.width = this.width as number;
			canvas.height = this.height as number;
			ctx?.scale(1, -1);
			ctx?.drawImage(img, 0, 0, this.width as number, this.height as number * -1);

      const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
			originalColors = Float32Array.from(imgData?.data);

      for (let i = 0; i < numPoints; i++) {
				if (originalColors[i * 4 + 0] > threshold) numVisible++;
			}
    //}

    // const uniforms = {
		// 	uTime: { value: 0 },
		// 	uRandom: { value: 1.0 },
		// 	uDepth: { value: 2.0 },
		// 	uSize: { value: 0.0 },
		// 	uTextureSize: { value: new THREE.Vector2(this.width, this.height) },
		// 	uTexture: { value: this.texture },
		// 	uTouch: { value: null },
		// };

		this.uniforms.uTextureSize.value = new THREE.Vector2(this.width, this.height);
		this.uniforms.uTexture.value = this.texture;

		//const x = glslify(require("./shaders"));
		const x = 1;
		console.log([`XXX`, x]);
		

		const material = new THREE.RawShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: glslify(vertShader),
			fragmentShader: glslify(fragShader),
			depthTest: false,
			transparent: false,
		});

		const geometry = new THREE.InstancedBufferGeometry();

		// positions
		const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
		positions.setXYZ(0, -0.5, 0.5, 0.0);
		positions.setXYZ(1, 0.5, 0.5, 0.0);
		positions.setXYZ(2, -0.5, -0.5, 0.0);
		positions.setXYZ(3, 0.5, -0.5, 0.0);
		geometry.setAttribute("position", positions);

		// uvs
		const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
		uvs.setXYZ(0, 0.0, 0.0, 0.0);
		uvs.setXYZ(1, 1.0, 0.0, 0.0);
		uvs.setXYZ(2, 0.0, 1.0, 0.0);
		uvs.setXYZ(3, 1.0, 1.0, 0.0);
		geometry.setAttribute("uv", uvs);

		
		

		// index
		geometry.setIndex(
			new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1)
		);

		const indices = new Uint16Array(numVisible);
		const offsets = new Float32Array(numVisible * 3);
		const angles = new Float32Array(numVisible);
	
		for (let i = 0, j = 0; i < numPoints; i++) {
			if (discard && originalColors[i * 4 + 0] <= threshold) continue;
	
			offsets[j * 3 + 0] = i % this.width;
			offsets[j * 3 + 1] = Math.floor(i / this.width);
	
			indices[j] = i;
	
			angles[j] = Math.random() * Math.PI;
	
			j++;
		}
	
		console.log([`XXX`, originalColors]);
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
		console.log([`XXX`, this.object3D]);
		
		this.container.add(this.object3D); 
  }
}
