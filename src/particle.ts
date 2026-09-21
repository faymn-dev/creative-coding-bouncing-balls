import { createVector } from "./vector";
import { WIDTH, HEIGHT } from "./config";
import { random } from "./utils";

const PARTICLE_MAX_HP = 20;
const PARTICLE_LINE_WIDTH = 5;
const PARTICLE_RADIUS = 15;

export class Particle {
  pos = createVector();
  vel = createVector();
  health = PARTICLE_MAX_HP;

  constructor() {
    this.randomize();
  }

  randomize() {
    this.pos = createVector(
      random(PARTICLE_RADIUS, WIDTH - PARTICLE_RADIUS),
      random(PARTICLE_RADIUS, HEIGHT - PARTICLE_RADIUS),
    );
    this.vel = createVector(random(-1, 1), random(-1, 1)).normalize();
  }

  update(particles: Particle[]) {
    if (this.pos.x + PARTICLE_RADIUS > WIDTH || this.pos.x - PARTICLE_RADIUS < 0) {
      this.vel.x *= -1;
    }
    if (this.pos.y + PARTICLE_RADIUS > HEIGHT || this.pos.y - PARTICLE_RADIUS < 0) {
      this.vel.y *= -1;
    }

    for (const particle of particles) {
      if (particle === this) {
        continue;
      }

      const delta = particle.pos.clone().sub(this.pos);
      const dist = delta.mag();
      const minDist = PARTICLE_RADIUS * 2 + PARTICLE_LINE_WIDTH;

      if (dist < minDist && dist > 0) {
        const overlap = minDist - dist;
        const normal = delta.clone().normalize();

        // prevent sticking
        this.pos.sub(normal.clone().mult(overlap * 0.5));
        particle.pos.add(normal.clone().mult(overlap * 0.5));

        const relativeVelocity = particle.vel.clone().sub(this.vel);
        const velAlongNormal = relativeVelocity.dot(normal);

        // do not resolve if velocities are separating
        if (velAlongNormal < 0) {
          const impulse = normal.clone().mult(velAlongNormal);

          this.vel.add(impulse);
          particle.vel.sub(impulse);

          this.health -= 1;
          particle.health -= 1;
        }
      }
    }

    this.pos.add(this.vel);
  }

  draw(ctx: CanvasRenderingContext2D) {
    let foreground = "#00BE00";
    let background = "#63F263";
    if (this.health < PARTICLE_MAX_HP * 0.25) {
      foreground = "#BE0000";
      background = "#F26363";
    } else if (this.health < PARTICLE_MAX_HP * 0.75) {
      foreground = "#BEB800";
      background = "#EFF263";
    }

    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, PARTICLE_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = background;
    ctx.strokeStyle = foreground;
    ctx.lineWidth = PARTICLE_LINE_WIDTH;
    ctx.stroke();
    ctx.fill();

    ctx.font = "14px sans-serif";
    ctx.fillStyle = foreground;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(this.health), this.pos.x, this.pos.y);
  }
}
