import { Particle } from "./particle";
import { WIDTH, HEIGHT } from "./config";

import "./style.css";

const canvas = document.getElementById("app__canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.style.width = `${WIDTH}px`;
canvas.style.height = `${HEIGHT}px`;
canvas.width = WIDTH;
canvas.height = HEIGHT;

const particles: Particle[] = [];

function animate() {
  requestAnimationFrame(animate);

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    if (particle.health < 0) {
      // TODO spawn particle explosion
      particles.splice(i, 1);
    }
  }

  for (const particle of particles) {
    particle.update(particles);
  }

  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  for (const particle of particles) {
    particle.draw(ctx);
  }
}

requestAnimationFrame(animate);

addEventListener("click", () => {
  particles.push(new Particle());
});
