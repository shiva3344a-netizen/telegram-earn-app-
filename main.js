let tg = window.Telegram.WebApp;
tg.expand();

let user = tg.initDataUnsafe?.user;
let uid = user?.id || Math.floor(Math.random() * 100000);

/* USERNAME DISPLAY */
let displayName = "User";
if (user) {
  if (user.username) displayName = "@" + user.username;
  else if (user.first_name) displayName = user.first_name;
}

document.getElementById("username").innerText = "Welcome " + displayName;
document.getElementById("userid").innerText = uid;

/* CONFIG */
const COINS_PER_AD = 10;
const COOLDOWN = 20; // seconds
const DAILY_AD_LIMIT = 50;
const DAILY_MAX_COINS = 500;

/* STORAGE */
let balance = parseInt(localStorage.getItem("balance")) || 0;
let lastAdTime = parseInt(localStorage.getItem("lastAdTime")) || 0;

document.getElementById("balance").innerText = balance;

/* DAILY RESET */
function getToday() {
  return new Date().toDateString();
}

if (localStorage.getItem("adDay") !== getToday()) {
  localStorage.setItem("adDay", getToday());
  localStorage.setItem("adsToday", 0);
  localStorage.setItem("coinsToday", 0);
}

/* UI UPDATE */
function updateStats() {
  let adsToday = parseInt(localStorage.getItem("adsToday")) || 0;
  let coinsToday = parseInt(localStorage.getItem("coinsToday")) || 0;

  document.getElementById("adsSeen").innerText = adsToday;
  document.getElementById("adsLeft").innerText = DAILY_AD_LIMIT - adsToday;
  document.getElementById("coinsToday").innerText = coinsToday;

  let now = Date.now();
  let diff = Math.floor((now - lastAdTime) / 1000);

  if (diff < COOLDOWN) {
    document.getElementById("cooldownText").innerText =
      `Next ad in ${COOLDOWN - diff}s`;
  } else {
    document.getElementById("cooldownText").innerText =
      "Ready to watch ad";
  }
}
setInterval(updateStats, 1000);

/* WATCH AD */
function watchAd() {
  let now = Date.now();
  let adsToday = parseInt(localStorage.getItem("adsToday")) || 0;
  let coinsToday = parseInt(localStorage.getItem("coinsToday")) || 0;

  if (now - lastAdTime < COOLDOWN * 1000) {
    alert("Please wait for cooldown");
    return;
  }

  if (adsToday >= DAILY_AD_LIMIT || coinsToday >= DAILY_MAX_COINS) {
    alert("Daily limit reached");
    return;
  }

  balance += COINS_PER_AD;
  adsToday++;
  coinsToday += COINS_PER_AD;

  localStorage.setItem("balance", balance);
  localStorage.setItem("adsToday", adsToday);
  localStorage.setItem("coinsToday", coinsToday);
  localStorage.setItem("lastAdTime", now);

  lastAdTime = now;
  document.getElementById("balance").innerText = balance;
}

/* REFERRAL */
let myRef = localStorage.getItem("myRef") || "REF" + uid;
localStorage.setItem("myRef", myRef);
document.getElementById("refcode").innerText = myRef;

function copyRef() {
  navigator.clipboard.writeText(
    `https://t.me/YOUR_BOT_USERNAME?start=${myRef}`
  );
  alert("Referral link copied");
}

function applyRef() {
  if (localStorage.getItem("usedRef")) {
    alert("Referral already applied");
    return;
  }
  let code = document.getElementById("enterRef").value.trim();
  if (!code) return alert("Enter valid code");
  localStorage.setItem("usedRef", code);
  alert("Referral applied successfully");
}

/* WITHDRAW */
function withdraw() {
  if (balance < 1000) {
    alert("Minimum withdrawal is 1000 coins");
    return;
  }

  let history = document.getElementById("history");
  let noHistory = document.getElementById("noHistory");
  if (noHistory) noHistory.remove();

  let li = document.createElement("li");
  li.innerText = "$1 USDT (BEP-20) – Pending";
  history.prepend(li);

  balance -= 1000;
  localStorage.setItem("balance", balance);
  document.getElementById("balance").innerText = balance;

  document.getElementById("withdrawStatus").innerText =
    "Status: Pending";
}

/* TABS */
function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}