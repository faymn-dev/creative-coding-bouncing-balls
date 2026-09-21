import { PARTICLE_LINE_WIDTH, PARTICLE_RADIUS } from "./particle";
import { random } from "./utils";
import { createVector, type Vector } from "./vector";

export class ExplosionManager {
  explosionParticles: ExplosionParticle[] = [];

  update() {
    for (let i = this.explosionParticles.length - 1; i >= 0; i--) {
      const particle = this.explosionParticles[i];
      if (particle.opacity <= 0.01) {
        this.explosionParticles.splice(i, 1);
      }
    }

    for (const particle of this.explosionParticles) {
      particle.update();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const particle of this.explosionParticles) {
      particle.draw(ctx);
    }
  }

  explodeAt(pos: Vector) {
    for (let i = 0; i < 15; i++) {
      this.explosionParticles.push(new ExplosionParticle(pos));
    }
  }
}

class ExplosionParticle {
  pos: Vector;
  vel: Vector;
  acc: Vector = createVector();
  opacity = 1;

  constructor(pos: Vector) {
    this.pos = pos.clone();
    this.vel = createVector(random(-5, 5), random(-10, 0));
  }

  update() {
    this.opacity = Math.max(this.opacity - 0.02, 0);
    this.acc.add(createVector(0, 0.25));
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = "#BE0000";
    ctx.fillStyle = "#F26363";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, PARTICLE_RADIUS / 2, 0, 2 * Math.PI);
    ctx.lineWidth = PARTICLE_LINE_WIDTH / 2;
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }
}
