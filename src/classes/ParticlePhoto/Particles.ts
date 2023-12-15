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

			this.initPoints(true);
			// this.initHitArea();
			// this.initTouch();
			// this.resize();
			// this.show();
		});
  }

  initPoints(discard: boolean) {
    const numPoints = (this.width || 0) * (this.height || 0);

    let numVisible = numPoints;
		let threshold = 0;
		let originalColors;

    if (discard) {
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
    }

  }
}
