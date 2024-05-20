import * as THREE from 'three';
import { InteractiveParticles } from './InteractiveParticles';

type Point = {
  x: number;
  y: number;
  age: number;
  force: number;
}

export default class TouchTexture {
  parent: InteractiveParticles;
  size: number;
  maxAge: number;
  radius: number;
  trail: Point[];

  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;

  texture: THREE.Texture | null = null;

  constructor(parent: InteractiveParticles) {
		this.parent = parent;
		this.size = 64;
		this.maxAge = 120;
		this.radius = 0.15;
		this.trail = [];

		this.initTexture();
	}

  initTexture() {
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.canvas.height = this.size;
		this.ctx = this.canvas.getContext('2d');

    if (!this.ctx) {
      throw Error("No canvas context");
    }

		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.texture = new THREE.Texture(this.canvas);

		this.canvas.id = "touchTexture";
		this.canvas.style.width = this.canvas.style.height = `${this.canvas.width}px`;
	}

  clear() {
    if (!this.ctx) {
      throw Error("No canvas context");
    }

    if (!this.canvas) {
      throw Error("No canvas");
    }

		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	update() {
    if (!this.texture) {
      throw Error("No texture");
    }

		this.clear();

		// age points
		this.trail.forEach((point, i) => {
			point.age++;
			// remove old
			if (point.age > this.maxAge) {
				this.trail.splice(i, 1);
			}
		});

		this.trail.forEach((point, i) => {
			this.drawTouch(point);
		});

		this.texture.needsUpdate = true;
	}  

  addTouch(point: Point) {
		let force = 0;
		const last = this.trail[this.trail.length - 1];
		if (last) {
			const dx = last.x - point.x;
			const dy = last.y - point.y;
			const dd = dx * dx + dy * dy;
			force = Math.min(dd * 10000, 1);
		}
		this.trail.push({ x: point.x, y: point.y, age: 0, force });
	}

  drawTouch(point: Point) {
    if (!this.ctx) {
      throw Error("No canvas context");
    }

		const pos = {
			x: point.x * this.size,
			y: (1 - point.y) * this.size
		};

		let intensity = 1;
		if (point.age < this.maxAge * 0.3) {
			intensity = (point.age / (this.maxAge * 0.3), 0, 1, 1);
		} else {
			intensity = (1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7), 0, 1, 1);
		}

		intensity *= point.force;

		const radius = this.size * this.radius * intensity;
		const grd = this.ctx.createRadialGradient(pos.x, pos.y, radius * 0.25, pos.x, pos.y, radius);
		grd.addColorStop(0, `rgba(255, 255, 255, 0.2)`);
		grd.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

		this.ctx.beginPath();
		this.ctx.fillStyle = grd;
		this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
		this.ctx.fill();
	}
}