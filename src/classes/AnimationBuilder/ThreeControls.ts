import * as THREE from "three";
import { makeObservable, observable, action } from "mobx";
import ThreeAnimator from "./ThreeAnimator";
import AbstractAnimator from "./AbstractAnimator";

export default class ThreeControls {
  threeAnimator: ThreeAnimator | undefined;
  domElement: HTMLElement | undefined;

  camera: THREE.Camera | undefined;
  mouse: THREE.Vector2 = new THREE.Vector2();
  offset: THREE.Vector3 = new THREE.Vector3();
  intersection: THREE.Vector3 = new THREE.Vector3();
  raycaster: THREE.Raycaster = new THREE.Raycaster();
  plane: THREE.Plane = new THREE.Plane();

  objects: THREE.Object3D[] = [];
  intersectionData: any;
  enabled: boolean = false;

  cir: THREE.Mesh | undefined;

  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  } = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };  

  constructor(threeAnimator: ThreeAnimator, camera: THREE.Camera, domElement: HTMLElement) {
    if (AbstractAnimator.isServer) return;

    this.threeAnimator = threeAnimator;
    this.domElement = domElement;
    this.camera = camera;

    this.calculateRect();

    makeObservable(this, {
      enabled: observable,
      enable: action,
      disable: action,
    });
  }

  calculateRect = (x?: number, y?: number, width?: number, height?: number) => {
    if (!this.domElement) return;

    if (x || y || width || height) {
			this.rect = { 
        x: x as number, 
        y: y as number, 
        width: width as number, 
        height: height as number 
      };
		}
		// else if (this.domElement === window) {
		// 	this.rect = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
		// }
		else {
      const el = this.domElement as HTMLElement;
			this.rect = el.getBoundingClientRect();
		}
  }

  enable = () => {
    if (this.enabled) return;
    this.enabled = true;

    this.addListeners();
  }

  disable = () => {
    if (!this.enabled) return;
    this.enabled = false;

    this.removeListeners();
  }

  addListeners = () => {
    if (!this.domElement) return;

    document.body.addEventListener('mousemove', this.onMouseMove);
  }

  removeListeners = () =>  {
    if (!this.domElement) return;

    document.body.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove = (event: MouseEvent) => {
    const touch = { x: event.clientX, y: event.clientY };

    this.mouse.x = ((touch.x + this.rect.x) / this.rect.width) * 2 - 1;
		this.mouse.y = -((touch.y + this.rect.y) / this.rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera as THREE.Camera);

    const intersects = this.raycaster.intersectObjects(this.objects);
    
    
		if (intersects.length > 0) {
			const object = intersects[0].object;
			this.intersectionData = intersects[0];

      const camera = this.camera as THREE.Camera;

			this.plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(this.plane.normal), object.position);
      this.cir?.position.set(intersects[0].point.x, intersects[0].point.y, 0); 
      console.log([`XXX`, intersects[0].point.x, intersects[0].point.y]);   
			// if (this.hovered !== object) {
			// 	this.emit('interactive-out', { object: this.hovered });
			// 	this.emit('interactive-over', { object });
			// 	this.hovered = object;
			// }
			// else {
			// 	this.emit('interactive-move', { object, intersectionData: this.intersectionData });
			// }
		}
		else {
			this.intersectionData = null;

			// if (this.hovered !== null) {
			// 	this.emit('interactive-out', { object: this.hovered });
			// 	this.hovered = null;
			// }
		}    
  }
}
