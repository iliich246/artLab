import * as THREE from "three";
import ThreeApp from "./ThreeApp";

export default class Particles {
  threeApp: ThreeApp | undefined;
  container: THREE.Object3D | undefined;
  texture: THREE.Texture | undefined;
  width: number | undefined;
  height: number | undefined;


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

			// this.initPoints(true);
			// this.initHitArea();
			// this.initTouch();
			// this.resize();
			// this.show();
		});
  }
}
