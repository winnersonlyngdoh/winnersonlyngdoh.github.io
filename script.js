// ==========================================
// Canvas Setup
// ==========================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ==========================================
// Heart Particle System
// ==========================================

let hearts = [];

class Heart {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.size = Math.random() * 18 + 10;

    this.rotation = Math.random() * Math.PI * 2;

    this.life = 1;
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

    ctx.fillStyle = "#ff5d95";

    const s = this.size;

    ctx.beginPath();

    ctx.moveTo(0, s / 4);

    ctx.bezierCurveTo(s / 2, -s / 2, s * 1.3, s / 3, 0, s);

    ctx.bezierCurveTo(-s * 1.3, s / 3, -s / 2, -s / 2, 0, s / 4);

    ctx.fill();

    ctx.restore();
  }
}

// ==========================================
// Animation Loop
// ==========================================

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].update();
    hearts[i].draw();

    if (hearts[i].life <= 0) {
      hearts.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();

// ==========================================
// DOM Elements
// ==========================================

const landing = document.getElementById("landing");

const startBtn = document.getElementById("startBtn");

const loader = document.getElementById("loader");

const fill = document.querySelector(".fill");

const percent = document.getElementById("percent");

const message = document.getElementById("message");

const questionScreen = document.getElementById("questionScreen");

// ==========================================
// Start Button
// ==========================================

startBtn.addEventListener("click", () => {
  // Heart Explosion

  for (let i = 0; i < 180; i++) {
    hearts.push(new Heart(canvas.width / 2, canvas.height / 2));
  }

  startBtn.style.display = "none";

  // Show Loader

  setTimeout(() => {
    loader.style.display = "block";

    startLoveMeter();
  }, 900);
});

// ==========================================
// Love Meter
// ==========================================

function startLoveMeter() {
  let progress = 0;

  const timer = setInterval(() => {
    progress++;

    fill.style.width = progress + "%";

    percent.textContent = progress + "%";

    if (progress >= 100) {
      clearInterval(timer);

      message.textContent = "System detected excessive cuteness.";

      setTimeout(() => {
        landing.style.display = "none";

        questionScreen.style.display = "flex";
      }, 1700);
    }
  }, 28);
}
// ==========================================
// Love Question Screen
// ==========================================

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttonArea = document.getElementById("buttonArea");

const fortuneScreen = document.getElementById("fortuneScreen");

const noMessages = [
  "Are you sure?",
  "Really?",
  "Think Again?",
  "Nope 😶",
  "Last Chance...",
  "Too Late.",
];

let noAttempts = 0;

function moveNoButton() {
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const maxX = buttonArea.clientWidth - buttonWidth;
  const maxY = buttonArea.clientHeight - buttonHeight;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  noBtn.style.left = randomX + "px";
  noBtn.style.top = randomY + "px";

  if (noAttempts < noMessages.length) {
    noBtn.textContent = noMessages[noAttempts];
  }

  noAttempts++;

  const scale = Math.max(0.3, 1 - noAttempts * 0.12);

  noBtn.style.transform = `scale(${scale})`;

  if (noAttempts >= noMessages.length) {
    noBtn.style.opacity = "0";

    noBtn.style.pointerEvents = "none";

    yesBtn.style.transform = "scale(1.2)";
  }
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton);

// ==========================================
// Yes Button
// ==========================================

yesBtn.addEventListener("click", () => {
  questionScreen.style.display = "none";

  fortuneScreen.style.display = "flex";
});

// ==========================================
// Daily Fortune
// ==========================================

const fortuneBtn = document.getElementById("fortuneBtn");

const fortuneCard = document.getElementById("fortuneCard");

const fortuneText = document.getElementById("fortuneText");

const fortunes = [
  "💕 Today you'll receive unlimited cuddles.",

  "🤗 You owe your boyfriend one hug.",

  "🎁 High probability of getting spoiled today.",

  "⚠️ Warning: Excessive beauty detected.",

  "😊 You are legally required to smile today.",
];

fortuneBtn.addEventListener("click", () => {
  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

  fortuneText.textContent = randomFortune;

  fortuneCard.classList.add("show");
});

// ==========================================
// Optional: Prevent the same fortune twice
// ==========================================

let lastFortune = -1;

fortuneBtn.addEventListener("click", () => {
  let index;

  do {
    index = Math.floor(Math.random() * fortunes.length);
  } while (index === lastFortune && fortunes.length > 1);

  lastFortune = index;

  fortuneText.textContent = fortunes[index];

  fortuneCard.classList.add("show");
  setTimeout(() => {
    fortuneScreen.style.display = "none";

    scratchScreen.style.display = "flex";

    initializeScratchCard();
  }, 3000);
});
const scratchScreen = document.getElementById("scratchScreen");

const scratchCanvas = document.getElementById("scratchCanvas");

const scratchCtx = scratchCanvas.getContext("2d");

function initializeScratchCard() {
  scratchCanvas.width = scratchCanvas.offsetWidth;

  scratchCanvas.height = scratchCanvas.offsetHeight;

  scratchCtx.fillStyle = "#b0b0b0";

  scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

  scratchCtx.fillStyle = "#ffffff";

  scratchCtx.font = "20px Playfair Display";

  scratchCtx.fillText("Scratch Here...", 120, 90);
}

let scratching = false;

scratchCanvas.addEventListener("mousedown", () => {
  scratching = true;
});

scratchCanvas.addEventListener("mouseup", () => {
  scratching = false;
});

scratchCanvas.addEventListener("mouseleave", () => {
  scratching = false;
});

scratchCanvas.addEventListener("mousemove", (e) => {
  if (!scratching) return;

  const rect = scratchCanvas.getBoundingClientRect();

  const x = e.clientX - rect.left;

  const y = e.clientY - rect.top;

  scratchCtx.globalCompositeOperation = "destination-out";

  scratchCtx.beginPath();

  scratchCtx.arc(x, y, 22, 0, Math.PI * 2);

  scratchCtx.fill();
});
