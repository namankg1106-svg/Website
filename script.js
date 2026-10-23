const scene = document.querySelector(".scene");
const button = document.getElementById("openLetter");
const birthdayPage = document.getElementById("birthdayPage");
const backButton = document.getElementById("backButton");
const albumButton = document.getElementById("albumButton");
const albumMessage = document.getElementById("albumMessage");

button.addEventListener("click", () => {
  if (!button.classList.contains("open")) {
    // First tap opens the envelope and lets the letter be read. Do not change pages yet.
    button.classList.add("open");
    button.setAttribute("aria-label", "Tap again to continue to the birthday page");
    const hint = button.querySelector(".hint");
    if (hint) hint.textContent = "tap to continue ♡";
    // Show the continue prompt only after the envelope/letter animation has finished.
    setTimeout(() => button.classList.add("ready"), 950);
  } else {
    // Second tap continues to the birthday page.
    scene.classList.add("show-birthday");
    birthdayPage.setAttribute("aria-hidden", "false");
  }
  for (let i = 0; i < 12; i++) {
    const heart = document.createElement("span");
    heart.textContent = Math.random() > .5 ? "♡" : "♥";
    heart.style.cssText = `position:absolute;left:${20+Math.random()*60}%;top:${48+Math.random()*20}%;z-index:10;color:${["#d89aa9","#c8b3dc","#e1bd91"][i%3]};font-size:${12+Math.random()*12}px;pointer-events:none;animation:floatHeart 2.2s ease-out forwards`;
    button.appendChild(heart); setTimeout(() => heart.remove(), 2300);
  }
});
backButton.addEventListener("click", () => showOnlyPage(document.getElementById("intro")));
const albumPage = document.getElementById("albumPage");
const memoriesPage = document.getElementById("memoriesPage");
function showOnlyPage(page) {
  if (page !== memoriesPage && page !== document.getElementById("wishesPage")) resetShower();
  ["intro", "birthdayPage", "albumPage", "memoriesPage", "wishesPage", "secretLetterPage", "secretLetter2Page", "cakePage"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("aria-hidden", String(el !== page));
  });
  scene.classList.toggle("show-birthday", page === birthdayPage);
  scene.classList.toggle("show-album", page === albumPage);
  scene.classList.toggle("show-memories", page === memoriesPage);
  scene.classList.toggle("show-wishes", page === document.getElementById("wishesPage"));
  scene.classList.toggle("show-secret-letter", page === document.getElementById("secretLetterPage"));
  scene.classList.toggle("show-cake", page === document.getElementById("cakePage"));
  scene.classList.toggle("show-secret-letter2", page === document.getElementById("secretLetter2Page"));
  document.querySelectorAll(".media-slot video").forEach(v => {
    if (page === memoriesPage) v.play().catch(() => {}); else v.pause();
  });
}
albumButton.addEventListener("click", () => showOnlyPage(albumPage));
document.getElementById("albumBack").addEventListener("click", () => showOnlyPage(birthdayPage));
document.getElementById("memoriesContinue").addEventListener("click", () => showOnlyPage(memoriesPage));
document.getElementById("memoriesBack").addEventListener("click", () => showOnlyPage(albumPage));

let memoryIndex = 0;
const memories = [
  {top:"for you!", art:"💐 🐱", photo:"photos/photo5.jpg", title:"HAPPY BIRTHDAY", caption:"the way you smile makes every day brighter."},
  {top:"happy happy happy", art:"🐈🎉", photo:"photos/card2.jpg", pos:"center 85%", title:"BIRTHDAY!!!", caption:"ordinary days with you have always been my favourite ones."},
  {top:"a little note", art:"💗 ✨ 🐻", photo:"photos/photo20.jpg", title:"YOU ARE SO LOVED", caption:"thank you for making life feel a little more magical."}
];
function renderMemory() {
  const m = memories[memoryIndex];
  document.getElementById("memoryTopline").textContent = m.top;
  const ill = document.getElementById("memoryIllustration");
  ill.classList.add("has-photo");
  ill.innerHTML = `<img src="${m.photo}" alt="Our memory" style="object-position:${m.pos || "center"}">`;
  document.getElementById("memoryTitle").textContent = m.title;
  document.getElementById("memoryCaption").textContent = m.caption;
  document.getElementById("memoryCount").textContent = `MEMORY 0${memoryIndex+1} / 03`;
  document.querySelectorAll("#albumDots span").forEach((dot,i)=>dot.classList.toggle("active",i===memoryIndex));
}
document.getElementById("memoryPrev").addEventListener("click", () => { memoryIndex=(memoryIndex+2)%3; renderMemory(); });
document.getElementById("memoryNext").addEventListener("click", () => { memoryIndex=(memoryIndex+1)%3; renderMemory(); });
renderMemory();

const showerPhotos = Array.from({length:20}, (_, i) => `photos/photo${i+1}.jpg`);
showerPhotos.forEach(src => { const p = new Image(); p.src = src; });
const showerButton = document.getElementById("showerButton");
const showerEl = document.getElementById("photoShower");
const wishPrompt = document.getElementById("wishPrompt");
const wishesPage = document.getElementById("wishesPage");
const SHOWER_MS = 25000;
let showerState = "idle", showerTimer = null;   // idle -> raining -> done

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
// the photo sequence plays 3 times in one shower; no photo twice in a row
function photoSequence(cycles) {
  const seq = [];
  for (let c = 0; c < cycles; c++) {
    const round = shuffled(showerPhotos);
    if (seq.length && round[0] === seq[seq.length - 1]) [round[0], round[1]] = [round[1], round[0]];
    seq.push(...round);
  }
  return seq;
}
function startShower() {
  showerEl.innerHTML = "";
  showerEl.classList.add("active");
  const symbols = ["♡","♥","✿","✨","💗"];
  const spread = 18;                       // pieces start falling across 18s, each takes 4-7s
  const seq = photoSequence(3);            // 20 photos x 3 = 60 photos
  seq.forEach((src, i) => {
    const piece = document.createElement("span");
    piece.className = "shower-piece";
    piece.style.left = (4 + Math.random() * 88) + "%";
    piece.style.animationDelay = (i / seq.length * spread) + "s";
    piece.style.animationDuration = (4 + Math.random() * 3) + "s";
    const img = document.createElement("img");
    img.src = src;
    piece.appendChild(img);
    showerEl.appendChild(piece);
  });
  // hearts and sparkles
  const heartColors = ["#d9788f","#e8a0b4","#c8b3dc","#e9b872","#f2c7d2"];
  for (let i = 0; i < 44; i++) {
    const h = document.createElement("span");
    h.className = "shower-piece shower-small";
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.left = (2 + Math.random() * 94) + "%";
    h.style.fontSize = (16 + Math.random() * 18) + "px";
    h.style.color = heartColors[i % heartColors.length];
    h.style.animationDelay = (Math.random() * spread) + "s";
    h.style.animationDuration = (4 + Math.random() * 3) + "s";
    showerEl.appendChild(h);
  }
  // colored paper confetti
  const paperColors = ["#f4a6b8","#f7d070","#9ed2c6","#b8a4e0","#f08a7a","#8fc1e8","#f6b8d6","#ffd9a0"];
  for (let i = 0; i < 90; i++) {
    const c = document.createElement("span");
    c.className = "shower-piece confetti";
    const w = 6 + Math.random() * 7;
    c.style.cssText = `left:${Math.random()*100}%;width:${w}px;height:${w*(1.2+Math.random()*1.1)}px;background:${paperColors[i % paperColors.length]};border-radius:${Math.random()>.7?"50%":"2px"};animation-delay:${Math.random()*spread}s;animation-duration:${3.5+Math.random()*3.5}s`;
    showerEl.appendChild(c);
  }
}
function finishShower() {
  showerState = "done";
  wishPrompt.classList.add("show");        // the white screen stays; "pick a wish" appears in the centre
}
function resetShower() {
  clearTimeout(showerTimer);
  showerState = "idle";
  showerEl.classList.remove("active");
  showerEl.innerHTML = "";
  wishPrompt.classList.remove("show");
  showerButton.style.opacity = "";
  showerButton.style.pointerEvents = "";
}
showerButton.addEventListener("click", () => {
  if (showerState !== "idle") return;
  showerState = "raining";
  showerButton.style.opacity = ".6";
  showerButton.style.pointerEvents = "none";
  startShower();
  showerTimer = setTimeout(finishShower, SHOWER_MS);
});
document.getElementById("wishOpen").addEventListener("click", () => showOnlyPage(wishesPage));

// The final letter is a playful scavenger hunt: eleven taps at different spots unlock it.
const secretLetterPage = document.getElementById("secretLetterPage");
const secretTapTarget = document.getElementById("secretTapTarget");
const secretNote = document.getElementById("secretNote");
const secretLetterPaper = document.getElementById("secretLetterPaper");
const secretMessages = [
  "Awww bubu, idhar tap karo naaa 🥹💗",
  "Alee mera cutipiee, itni jaldi kya hai? 😚",
  "Kuchu puchu mai yaha huuu! 👀💕",
  "What are u doinggg? button ke paas dekho 😂",
  "Awww gussa aara hai butku ko? Hehehe 😭💗",
  "Heheee, pakad ke dikhao mujhe 😋",
  "Awww bubu, thoda pyaar se tap karo na 🥺",
  "Nahi nahi, mai yaha nahi hu… udharrr! 👉😂",
  "Alee cutipiee, bas thoda sa aurrr 💞",
  "Hahahaha, mai yahi huuu! Almost bubu 😭💗",
  "YAYYYY! Mera bubu found the letter! 💌🥹"
];
const secretPositions = [
  ["12%","44%"],["58%","49%"],["28%","59%"],["62%","35%"],
  ["8%","66%"],["54%","68%"],["32%","39%"],["68%","56%"],
  ["16%","72%"],["57%","42%"],["center","74%"]
];
let secretTapCount = 0;
function resetSecretLetter() {
  secretTapCount = 0;
  secretNote.textContent = "Psst… bubu, find me and tap the button ♡";
  secretLetterPaper.hidden = true;
  secretLetterPage.classList.remove("revealed");
  secretTapTarget.hidden = false;
  secretTapTarget.style.position = "relative";
  secretTapTarget.style.left = "auto";
  secretTapTarget.style.top = "auto";
  secretTapTarget.style.transform = "none";
  secretNote.style.position = "relative";
  secretNote.style.left = "auto";
  secretNote.style.top = "auto";
  secretNote.style.transform = "none";
  secretTapTarget.textContent = "TAP ME ♡";
}
// Password gate: tapping "one last thing" asks for the password first.
const SECRET_PASSWORD = "1124";
const pwGate = document.getElementById("pwGate");
const pwCard = document.getElementById("pwCard");
const pwInput = document.getElementById("pwInput");
const pwError = document.getElementById("pwError");
function closePwGate() { pwGate.hidden = true; pwInput.value = ""; pwError.textContent = ""; }
function unlockSecretLetter() {
  if (pwInput.value.trim() === SECRET_PASSWORD) {
    closePwGate();
    const p2 = document.getElementById("secretLetter2Page");
    showOnlyPage(p2);
    p2.scrollTop = 0;
  } else {
    pwError.textContent = "Wrong password! Byeee guyzzz 👋😜";
    pwCard.classList.remove("shake");
    void pwCard.offsetWidth;
    pwCard.classList.add("shake");
    pwInput.select();
  }
}
// Make-a-wish cake sits between the wishes page and the secret letter.
const cakePage = document.getElementById("cakePage");
const candles = [...cakePage.querySelectorAll(".candle")];
const cakeSub = document.getElementById("cakeSub");
const cakeMsg = document.getElementById("cakeMsg");
const cakeContinue = document.getElementById("cakeContinue");
const cakeMic = document.getElementById("cakeMic");
const confettiBox = document.getElementById("confetti");
let micStream = null, micCtx = null, micTimer = null;
function stopMic() {
  clearInterval(micTimer); micTimer = null;
  if (micStream) micStream.getTracks().forEach(t => t.stop());
  if (micCtx) micCtx.close().catch(() => {});
  micStream = micCtx = null;
}
function resetCake() {
  stopMic();
  candles.forEach(c => c.classList.remove("out"));
  cakeMsg.hidden = true; cakeContinue.hidden = true; cakeMic.hidden = false;
  cakeSub.textContent = "tap the candles to blow them out 🕯️";
  confettiBox.innerHTML = "";
}
function launchConfetti() {
  const colors = ["#f7b8ce","#c78392","#f5d58a","#ffffff","#e9a9bd","#b9d8c9"];
  for (let i = 0; i < 46; i++) {
    const p = document.createElement("i");
    p.style.left = Math.random() * 100 + "%";
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = 2.6 + Math.random() * 2.4 + "s";
    p.style.animationDelay = Math.random() * 0.9 + "s";
    confettiBox.appendChild(p);
  }
}
function checkCake() {
  if (candles.every(c => c.classList.contains("out"))) {
    stopMic();
    cakeSub.textContent = "wish made 🤍";
    cakeMic.hidden = true; cakeMsg.hidden = false; cakeContinue.hidden = false;
    launchConfetti();
  }
}
candles.forEach(c => {
  const blow = () => { c.classList.add("out"); checkCake(); };
  c.addEventListener("click", blow);
  c.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); blow(); } });
});
cakeMic.addEventListener("click", async () => {
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = micCtx.createAnalyser();
    analyser.fftSize = 512;
    micCtx.createMediaStreamSource(micStream).connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    cakeSub.textContent = "now blow… 🌬️";
    let loud = 0;
    micTimer = setInterval(() => {
      analyser.getByteTimeDomainData(data);
      let peak = 0;
      for (const v of data) peak = Math.max(peak, Math.abs(v - 128));
      loud = peak > 60 ? loud + 1 : 0;
      if (loud >= 3) { candles.forEach(c => c.classList.add("out")); checkCake(); }
    }, 100);
  } catch (e) {
    cakeSub.textContent = "mic not available — just tap the candles 🕯️";
    cakeMic.hidden = true;
  }
});
cakeContinue.addEventListener("click", () => {
  resetCake();
  resetSecretLetter();
  showOnlyPage(secretLetterPage);
});
document.getElementById("cakeBack").addEventListener("click", () => { resetCake(); showOnlyPage(wishesPage); });
document.getElementById("secretLetterLink").addEventListener("click", () => {
  resetCake();
  showOnlyPage(cakePage);
});
document.getElementById("secretLetter2Back").addEventListener("click", () => showOnlyPage(secretLetterPage));
document.getElementById("secretMoreBtn").addEventListener("click", () => {
  pwInput.value = ""; pwError.textContent = "";
  pwGate.hidden = false;
  setTimeout(() => pwInput.focus(), 50);
});
document.getElementById("pwOpen").addEventListener("click", unlockSecretLetter);
pwInput.addEventListener("keydown", e => { if (e.key === "Enter") unlockSecretLetter(); });
document.getElementById("pwCancel").addEventListener("click", closePwGate);
secretTapTarget.addEventListener("click", () => {
  if (secretTapCount >= 11) return;
  secretTapCount++;
  secretNote.textContent = secretMessages[secretTapCount - 1];
  if (secretTapCount >= 11) {
    secretTapTarget.hidden = true;
    secretLetterPaper.hidden = false;
    secretLetterPage.classList.add("revealed");
    return;
  }
  const [x,y] = secretPositions[secretTapCount - 1];
  // Place the note and button as a single centered group, clamped to the visible page.
  // Pixel positioning avoids long messages spilling off either edge on narrow screens.
  const pageRect = secretLetterPage.getBoundingClientRect();
  const pageW = secretLetterPage.clientWidth;
  const pageH = secretLetterPage.clientHeight;
  const sidePad = Math.min(18, pageW * 0.04);
  const noteW = Math.min(pageW * 0.82, 340);
  const requestedX = x === "center" ? pageW / 2 : pageW * (parseFloat(x) / 100);
  const centerX = Math.max(sidePad + noteW / 2, Math.min(pageW - sidePad - noteW / 2, requestedX));
  const requestedY = pageH * (parseFloat(y) / 100);
  secretNote.style.position = "absolute";
  secretNote.style.width = `${noteW}px`;
  secretNote.style.left = `${centerX}px`;
  secretNote.style.transform = "translateX(-50%)";
  secretNote.style.margin = "0";
  secretNote.style.top = `${Math.max(100, Math.min(pageH - 115, requestedY - 57))}px`;
  secretTapTarget.style.position = "absolute";
  secretTapTarget.style.left = `${centerX}px`;
  secretTapTarget.style.top = `${Math.max(150, Math.min(pageH - 65, requestedY))}px`;
  secretTapTarget.style.transform = "translateX(-50%)";
  secretTapTarget.textContent = secretTapCount >= 9 ? "LAST FEW TAPS… ♡" : "TAP ME ♡";
});
document.getElementById("secretLetterBack").addEventListener("click", () => showOnlyPage(wishesPage));

const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let musicMuted = false, musicStarted = false;
bgMusic.loop = true; bgMusic.volume = 1;
function startMusic() {
  if (musicMuted || musicStarted) return;
  const p = bgMusic.play();
  if (p && p.then) p.then(() => { musicStarted = true; }).catch(() => { /* browser autoplay policy may require a first interaction */ });
  else musicStarted = true;
}
// Try immediately on page load, then retry on interaction if the browser blocks autoplay.
startMusic();
["click", "touchend", "pointerup", "keydown"].forEach(ev => document.addEventListener(ev, startMusic));
bgMusic.addEventListener("pause", () => { if (!musicMuted && musicStarted && !document.hidden) bgMusic.play().catch(() => {}); });
musicToggle.addEventListener("click", e => {
  e.stopPropagation();
  musicMuted = !musicMuted;
  if (musicMuted) bgMusic.pause(); else { musicStarted = false; startMusic(); }
  musicToggle.classList.toggle("off", musicMuted);
  musicToggle.setAttribute("aria-label", musicMuted ? "Play music" : "Mute music");
});
const style = document.createElement("style");
style.textContent = "@keyframes floatHeart{from{opacity:0;transform:translateY(15px) scale(.7)}20%{opacity:1}to{opacity:0;transform:translateY(-75px) scale(1.2) rotate(25deg)}}";
document.head.appendChild(style);

document.querySelectorAll(".media-slot video").forEach(v => {
  v.muted = true; v.loop = true;
  v.addEventListener("ended", () => { v.currentTime = 0; v.play().catch(() => {}); });
  v.addEventListener("pause", () => { if (memoriesPage.getAttribute("aria-hidden") === "false") v.play().catch(() => {}); });
});

// wishes page: tap a photo to flip it
document.querySelectorAll(".wish-card").forEach(card => {
  const flip = () => card.classList.toggle("flipped");
  card.addEventListener("click", flip);
  card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
});
document.getElementById("wishesBack").addEventListener("click", () => { resetShower(); showOnlyPage(memoriesPage); });
