const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

resize();

window.addEventListener("resize", resize);

let hearts = [];

class Heart {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.life = 1;

    this.size = Math.random() * 18 + 10;

    this.rotation = Math.random() * 6;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.vy += 0.03;

    this.rotation += 0.05;

    this.life -= 0.012;
  }

  draw() {
    ctx.save();

    ctx.translate(this.x, this.y);

    ctx.rotate(this.rotation);

    ctx.globalAlpha = this.life;

    ctx.fillStyle = "#ff5c93";

    const s = this.size;

    ctx.beginPath();

    ctx.moveTo(0, s / 4);

    ctx.bezierCurveTo(s / 2, -s / 2, s * 1.3, s / 3, 0, s);

    ctx.bezierCurveTo(-s * 1.3, s / 3, -s / 2, -s / 2, 0, s / 4);

    ctx.fill();

    ctx.restore();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hearts.forEach((h) => {
    h.update();

    h.draw();
  });

  hearts = hearts.filter((h) => h.life > 0);

  requestAnimationFrame(animate);
}

animate();

const startBtn = document.getElementById("startBtn");

const loader = document.getElementById("loader");

const fill = document.querySelector(".fill");

const percent = document.getElementById("percent");

const message = document.getElementById("message");

startBtn.onclick = () => {
  for (let i = 0; i < 180; i++) {
    hearts.push(new Heart(canvas.width / 2, canvas.height / 2));
  }

  startBtn.style.display = "none";

  setTimeout(() => {
    loader.style.display = "block";

    let progress = 0;

    const timer = setInterval(() => {
      progress++;

      fill.style.width = progress + "%";

      percent.textContent = progress + "%";

      if (progress >= 100) {
        clearInterval(timer);

        message.textContent = "System detected excessive cuteness.";

        setTimeout(() => {
          document.getElementById("landing").style.display = "none";

          document.getElementById("questionScreen").style.display = "flex";
        }, 1700);
      }
    }, 28);
  }, 900);
};

const noBtn = document.getElementById("noBtn");

const yesBtn = document.getElementById("yesBtn");

const area = document.getElementById("buttonArea");

const texts = [
  "Are you sure?",

  "Really?",

  "Think Again!",

  "Impossible.",

  "Last Chance...",

  "Too Late.",
];

let tries = 0;

function escapeButton() {
  const maxX = area.clientWidth - 150;

  const maxY = area.clientHeight - 80;

  noBtn.style.left = Math.random() * maxX + "px";

  noBtn.style.top = Math.random() * maxY + "px";

  if (tries < texts.length) {
    noBtn.textContent = texts[tries];
  }

  tries++;

  const scale = Math.max(0.3, 1 - tries * 0.12);

  noBtn.style.transform = `scale(${scale})`;

  if (tries >= texts.length) {
    noBtn.style.opacity = 0;

    noBtn.style.pointerEvents = "none";

    yesBtn.style.transform = "scale(1.2)";
  }
}

noBtn.addEventListener("mouseenter", escapeButton);

noBtn.addEventListener("click", escapeButton);
