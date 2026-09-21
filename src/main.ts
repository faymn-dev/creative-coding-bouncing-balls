import { Particle } from "./particle";
import { WIDTH, HEIGHT } from "./config";

import "./style.css";
import { ExplosionManager } from "./explosion";

const canvas = document.getElementById("app__canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.style.width = `${WIDTH}px`;
canvas.style.height = `${HEIGHT}px`;
canvas.width = WIDTH;
canvas.height = HEIGHT;

const particles: Particle[] = [];
const explosionManager = new ExplosionManager();

function animate() {
  explosionManager.update();

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    if (particle.health < 0) {
      explosionManager.explodeAt(particle.pos);
      particles.splice(i, 1);
    }
  }

  for (const particle of particles) {
    particle.update(particles);
  }

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  explosionManager.draw(ctx);
  for (const particle of particles) {
    particle.draw(ctx);
  }
}

setInterval(animate, 1000 / 90);

addEventListener("keypress", (event) => {
  if (event.key === " ") {
    particles.push(new Particle());
  }
});
