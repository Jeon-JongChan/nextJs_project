"use client";
import {useEffect} from "react";
export default function Component(props) {
  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 창 크기 조절에 대응하기
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    const animate = new Animate(ctx, props?.objCount ? Number(props.objCount) : 10);
    animate.animate();
  }, []);
  return (
    <>
      <canvas id="canvas" className="fixed background-canvas top-0 left-0"></canvas>
    </>
  );
}
class Animate {
  constructor(ctx, objCount = 10) {
    this.canvas = document.querySelector("canvas") || null;
    this.ctx = ctx;
    this.objCount = objCount;
    this.stars = [];
    this.createStars();
    this.rafId = null;
  }

  createStars(cnt = this.objCount, init = false) {
    if (init) this.stars = [];
    for (let i = 0; i < cnt; i++) {
      this.stars.push(new Star(this.ctx));
    }
  }

  animate() {
    this.rafId = requestAnimationFrame(this.animate.bind(this));
    if (!this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.stars.forEach((star) => {
      star.update();
    });
  }

  stopAnimate() {
    cancelAnimationFrame(this.rafId);
  }
}

class Star {
  constructor(ctx) {
    this.canvas = document.querySelector("canvas") || null;
    this.ctx = ctx;
    this.x = Math.random() * this.canvas.width;
    this.y = 0;
    this.size = Math.random() * 40 + 10;
    this.speed = Math.random() * 3 + 1;
    this.opacity = Math.random() + 2;
    this.angle = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.1 - 0.05;
    this.particles = [];
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.angle);
    // 별 모양 그리기
    this.ctx.beginPath();
    this.ctx.moveTo(0, -this.size / 2);
    for (let i = 0; i < 5; i++) {
      this.ctx.rotate(Math.PI / 5);
      this.ctx.lineTo(0, -this.size / 4);
      this.ctx.rotate(Math.PI / 5);
      this.ctx.lineTo(0, -this.size / 2);
    }
    this.ctx.closePath();
    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    this.ctx.fill();
    this.ctx.restore();
  }

  update() {
    if (!this.canvas) return;
    this.y += this.speed;
    this.angle += this.rotationSpeed;
    if (this.y > this.canvas.height) {
      this.y = 0;
      this.x = Math.random() * this.canvas.width;
    }
    this.draw();

    this.particles.forEach((particle) => {
      particle.update();
    });

    // 작은 별들 생성
    if (Math.random() < 0.2) {
      // 조정 가능한 값
      this.particles.push(new Particle(this.ctx, this.x, this.y, this.speed, this.removeTailParticles.bind(this)));
    }
  }

  removeTailParticles(particle) {
    if (this.particles.indexOf(particle) !== -1) {
      this.particles.splice(this.particles.indexOf(particle), 1);
    }
  }
}

class Particle {
  /* prettier-ignore */
  constructor(ctx, x, y, speed, removeFunc) {
    this.ctx = ctx;
    this.x = Math.random() * 8 + x;
    this.y = y;
    this.size = Math.random() * 10 + 3;
    this.speed = Math.random() * 1 - (speed / 4); // 속도 조정
    this.opacity = 1;
    this.alphaSpeed = Math.random() * 0.02 + 0.01;
    this.removeFunc = removeFunc; // 파티클 스스로 삭제 함수
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.angle);
    // 별 모양 그리기
    this.ctx.beginPath();
    this.ctx.moveTo(0, -this.size / 2);
    for (let i = 0; i < 5; i++) {
      this.ctx.rotate(Math.PI / 5);
      this.ctx.lineTo(0, -this.size / 4);
      this.ctx.rotate(Math.PI / 5);
      this.ctx.lineTo(0, -this.size / 2);
    }
    this.ctx.closePath();
    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    this.ctx.fill();
    this.ctx.restore();
  }

  update() {
    this.y += this.speed;
    this.opacity -= this.alphaSpeed;
    if (this.opacity <= 0) {
      // particles.splice(particles.indexOf(this), 1);
      this.removeFunc(this);
    }
    this.draw();
  }
}
