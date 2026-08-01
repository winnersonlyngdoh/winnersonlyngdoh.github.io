// ======================================================
// CANVAS SETUP
// ======================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// ======================================================
// HEART PARTICLES
// ======================================================

const hearts = [];

class Heart {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.size = Math.random() * 20 + 10;

    this.rotation = Math.random() * Math.PI * 2;

    this.rotationSpeed = (Math.random() - 0.5) * 0.2;

    this.life = 1;

    this.fade = 0.012;

    this.color = ["#ff4d88", "#ff6fa3", "#ff87b4", "#ff9ec4"][
      Math.floor(Math.random() * 4)
    ];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.vy += 0.03;

    this.rotation += this.rotationSpeed;

    this.life -= this.fade;
  }

  draw() {
    ctx.save();

    ctx.translate(this.x, this.y);

    ctx.rotate(this.rotation);

    ctx.globalAlpha = Math.max(this.life, 0);

    ctx.fillStyle = this.color;

    const s = this.size;

    ctx.beginPath();

    ctx.moveTo(0, s / 4);

    ctx.bezierCurveTo(s / 2, -s / 2, s * 1.3, s / 3, 0, s);

    ctx.bezierCurveTo(-s * 1.3, s / 3, -s / 2, -s / 2, 0, s / 4);

    ctx.fill();

    ctx.restore();
  }
}

// ======================================================
// HEART EXPLOSION
// ======================================================

function createHeartExplosion(x, y, amount = 220) {
  for (let i = 0; i < amount; i++) {
    hearts.push(new Heart(x, y));
  }
}

// ======================================================
// ANIMATION LOOP
// ======================================================

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

// ======================================================
// DOM ELEMENTS
// ======================================================

const landing = document.getElementById("landing");

const startBtn = document.getElementById("startBtn");

const loader = document.getElementById("loader");

const fill = document.querySelector(".fill");

const percent = document.getElementById("percent");

const message = document.getElementById("message");

const questionScreen = document.getElementById("questionScreen");

const yesBtn = document.getElementById("yesBtn");

const noBtn = document.getElementById("noBtn");

const buttonArea = document.getElementById("buttonArea");

const fortuneScreen = document.getElementById("fortuneScreen");

const fortuneBtn = document.getElementById("fortuneBtn");

const fortuneCard = document.getElementById("fortuneCard");

const fortuneText = document.getElementById("fortuneText");

const scratchScreen = document.getElementById("scratchScreen");

const scratchCanvas = document.getElementById("scratchCanvas");

const scratchCtx = scratchCanvas.getContext("2d");
// ======================================================
// LANDING SCREEN
// ======================================================

startBtn.addEventListener("click", startExperience);

function startExperience() {
  // Prevent multiple clicks
  startBtn.disabled = true;

  // Heart explosion from center
  createHeartExplosion(canvas.width / 2, canvas.height / 2, 250);

  // Hide button
  startBtn.style.transform = "scale(0)";
  startBtn.style.opacity = "0";

  // Show loader after explosion
  setTimeout(() => {
    startBtn.style.display = "none";

    loader.style.display = "block";

    loader.style.opacity = "0";
    loader.style.transform = "translateY(20px)";

    requestAnimationFrame(() => {
      loader.style.transition = "opacity .6s ease, transform .6s ease";

      loader.style.opacity = "1";
      loader.style.transform = "translateY(0)";
    });

    startLoveMeter();
  }, 900);
}

// ======================================================
// LOVE METER
// ======================================================

function startLoveMeter() {
  let progress = 0;

  fill.style.width = "0%";
  percent.textContent = "0%";
  message.textContent = "";

  const interval = setInterval(() => {
    progress++;

    fill.style.width = progress + "%";

    percent.textContent = progress + "%";

    // Cute loading messages
    if (progress === 15) message.textContent = "Scanning heart...";

    if (progress === 35) message.textContent = "Locating Pookie...";

    if (progress === 60) message.textContent = "Analyzing cuteness...";

    if (progress === 85) message.textContent = "Almost done...";

    if (progress >= 100) {
      clearInterval(interval);

      percent.textContent = "100%";

      message.textContent = "System detected excessive cuteness. ❤️";

      // Small celebration
      createHeartExplosion(canvas.width / 2, canvas.height / 2, 120);

      setTimeout(showQuestionScreen, 1800);
    }
  }, 30);
}

// ======================================================
// TRANSITION TO QUESTION SCREEN
// ======================================================

function showQuestionScreen() {
  landing.style.opacity = "0";
  landing.style.transition = "opacity .7s ease";

  setTimeout(() => {
    landing.style.display = "none";

    questionScreen.style.display = "flex";

    questionScreen.style.opacity = "0";

    requestAnimationFrame(() => {
      questionScreen.style.transition = "opacity .7s ease";

      questionScreen.style.opacity = "1";
    });
  }, 700);
}
// ======================================================
// LOVE QUESTION SCREEN
// ======================================================

const noTexts = [
  "Are you sure? 🥺",
  "Really? 😢",
  "Think again ❤️",
  "That's illegal 😶",
  "Last chance...",
  "No button revoked.",
];

let noAttempts = 0;

// --------------------------------------------
// Random Position Generator
// --------------------------------------------

function randomPosition() {
  const padding = 15;

  const maxX = buttonArea.clientWidth - noBtn.offsetWidth - padding;

  const maxY = buttonArea.clientHeight - noBtn.offsetHeight - padding;

  return {
    x: Math.random() * maxX + padding,
    y: Math.random() * maxY + padding,
  };
}

// --------------------------------------------
// Escape Animation
// --------------------------------------------

function escapeNoButton() {
  const pos = randomPosition();

  noBtn.style.left = pos.x + "px";
  noBtn.style.top = pos.y + "px";

  if (noAttempts < noTexts.length) {
    noBtn.textContent = noTexts[noAttempts];
  }

  noAttempts++;

  const scale = Math.max(0.25, 1 - noAttempts * 0.13);

  noBtn.style.transform = `scale(${scale}) rotate(${(Math.random() - 0.5) * 20}deg)`;

  if (noAttempts >= noTexts.length) {
    noBtn.style.opacity = "0";

    noBtn.style.pointerEvents = "none";

    yesBtn.style.transform = "scale(1.18)";

    yesBtn.style.boxShadow = "0 0 40px rgba(255,70,120,.45)";

    yesBtn.textContent = "Yes ❤️";
  }
}

// --------------------------------------------
// Desktop
// --------------------------------------------

noBtn.addEventListener("mouseenter", escapeNoButton);

// --------------------------------------------
// Mobile
// --------------------------------------------

noBtn.addEventListener("pointerdown", function (e) {
  e.preventDefault();

  escapeNoButton();
});

// --------------------------------------------
// YES BUTTON
// --------------------------------------------

yesBtn.addEventListener("click", () => {
  // Celebration

  createHeartExplosion(canvas.width / 2, canvas.height / 2, 160);

  questionScreen.style.opacity = "0";
  questionScreen.style.transition = "opacity .6s ease";

  setTimeout(() => {
    questionScreen.style.display = "none";

    fortuneScreen.style.display = "flex";

    fortuneScreen.style.opacity = "0";

    requestAnimationFrame(() => {
      fortuneScreen.style.transition = "opacity .6s ease";

      fortuneScreen.style.opacity = "1";
    });
  }, 650);
});
// ======================================================
// DAILY FORTUNE
// ======================================================

// Fortune List

const fortunes = [
  "💕 Today you'll receive unlimited cuddles.",

  "🤗 You owe your boyfriend one hug.",

  "🎁 High probability of getting spoiled today.",

  "⚠️ Warning: Excessive beauty detected.",

  "😊 You are legally required to smile today.",

  "❤️ Your boyfriend misses you right now.",

  "🌹 Today is a perfect day for forehead kisses.",

  "🐻 You have a 100% chance of being adorable today.",

  "💖 Someone thinks you're the cutest girl alive.",

  "✨ Lucky Number: Infinity, because my love for you never ends.",
];

// Prevent consecutive duplicates

let previousFortune = -1;

// --------------------------------------------
// Reveal Fortune
// --------------------------------------------

fortuneBtn.addEventListener("click", revealFortune);

function revealFortune() {
  let index;

  do {
    index = Math.floor(Math.random() * fortunes.length);
  } while (index === previousFortune);

  previousFortune = index;

  // Disable button while showing animation

  fortuneBtn.disabled = true;

  fortuneBtn.style.opacity = ".7";

  // Display fortune

  fortuneText.textContent = fortunes[index];

  fortuneCard.classList.add("show");

  // Heart burst

  createHeartExplosion(
    canvas.width / 2,

    canvas.height / 2,

    100,
  );

  // Automatically continue after a delay

  setTimeout(() => {
    transitionToScratch();
  }, 4500);
}

// --------------------------------------------
// Transition
// --------------------------------------------

function transitionToScratch() {
  fortuneScreen.style.opacity = "0";

  fortuneScreen.style.transition = "opacity .7s ease";

  setTimeout(() => {
    fortuneScreen.style.display = "none";

    scratchScreen.style.display = "flex";

    scratchScreen.style.opacity = "0";

    requestAnimationFrame(() => {
      scratchScreen.style.transition = "opacity .7s ease";

      scratchScreen.style.opacity = "1";

      initializeScratchCard();
    });
  }, 700);
}
// ======================================================
// SCRATCH CARD
// ======================================================

let scratching = false;
let revealed = false;

// --------------------------------------------
// Initialize Card
// --------------------------------------------

function initializeScratchCard() {
  revealed = false;

  scratchCanvas.width = scratchCanvas.offsetWidth;
  scratchCanvas.height = scratchCanvas.offsetHeight;

  scratchCanvas.style.touchAction = "none";

  scratchCtx.globalCompositeOperation = "source-over";

  // Silver background
  const gradient = scratchCtx.createLinearGradient(
    0,
    0,
    scratchCanvas.width,
    scratchCanvas.height,
  );

  gradient.addColorStop(0, "#d8d8d8");
  gradient.addColorStop(0.5, "#f5f5f5");
  gradient.addColorStop(1, "#bdbdbd");

  scratchCtx.fillStyle = gradient;

  scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

  // Metallic noise

  for (let i = 0; i < 900; i++) {
    scratchCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.25})`;

    scratchCtx.fillRect(
      Math.random() * scratchCanvas.width,

      Math.random() * scratchCanvas.height,

      2,

      2,
    );
  }

  // Text

  scratchCtx.fillStyle = "#555";

  scratchCtx.font = "bold 28px Playfair Display";

  scratchCtx.textAlign = "center";

  scratchCtx.fillText(
    "Scratch Me ❤️",

    scratchCanvas.width / 2,

    scratchCanvas.height / 2 + 10,
  );
}

// ======================================================
// SCRATCH FUNCTION
// ======================================================

function scratch(e) {
  if (revealed) return;

  const rect = scratchCanvas.getBoundingClientRect();

  const x = e.clientX - rect.left;

  const y = e.clientY - rect.top;

  scratchCtx.globalCompositeOperation = "destination-out";

  scratchCtx.beginPath();

  scratchCtx.arc(x, y, 26, 0, Math.PI * 2);

  scratchCtx.fill();
}

// ======================================================
// POINTER EVENTS
// ======================================================

scratchCanvas.addEventListener("pointerdown", (e) => {
  scratching = true;

  scratch(e);
});

scratchCanvas.addEventListener("pointermove", (e) => {
  if (!scratching) return;

  scratch(e);
});

window.addEventListener("pointerup", () => {
  scratching = false;

  checkReveal();
});

window.addEventListener("pointercancel", () => {
  scratching = false;
});

// ======================================================
// CHECK REVEAL
// ======================================================

function checkReveal() {
  if (revealed) return;

  const pixels = scratchCtx.getImageData(
    0,

    0,

    scratchCanvas.width,

    scratchCanvas.height,
  ).data;

  let transparent = 0;

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) {
      transparent++;
    }
  }

  const percent = transparent / (scratchCanvas.width * scratchCanvas.height);

  if (percent > 0.65) {
    revealScratch();
  }
}

// ======================================================
// REVEAL
// ======================================================

function revealScratch() {
  revealed = true;

  scratchCtx.clearRect(
    0,

    0,

    scratchCanvas.width,

    scratchCanvas.height,
  );

  createHeartExplosion(
    canvas.width / 2,

    canvas.height / 2,

    180,
  );

  // Optional transition

  setTimeout(() => {
    alert("More surprises coming soon ❤️");
  }, 1200);
}
