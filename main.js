const tg = Telegram.WebApp;
tg.expand();

// USER
const user = tg.initDataUnsafe?.user || {};
const userId = user.id || "guest";
const username = user.username || "User";
document.getElementById("username").innerText = "Welcome @" + username;

// SETTINGS
const BOT = "AdsEarning_43_Bot";
const AD_REWARD = 0.0002;
const REF_PERCENT = 0.2;
const DAILY_LIMIT = 250;
const COOLDOWN_SEC = 3;

// STORAGE KEYS
const BAL_KEY = "bal_" + userId;
const ADS_KEY = "ads_" + userId;
const DAY_KEY = "day_" + userId;
const REF_KEY = "refs_" + userId;

// LOAD DATA
let balance = Number(localStorage.getItem(BAL_KEY)) || 0;
let adsSeen = Number(localStorage.getItem(ADS_KEY)) || 0;
let dailyEarned = Number(localStorage.getItem(DAY_KEY)) || 0;
let refHistory = JSON.parse(localStorage.getItem(REF_KEY)) || [];

let cooldown = false;

// REF LINK
const refCode = "ref" + userId;
const refLink = `https://t.me/${BOT}?start=${refCode}`;
document.getElementById("refLink").value = refLink;

// HANDLE REF START
const startParam = tg.initDataUnsafe?.start_param;
if (startParam && startParam.startsWith("ref")) {
  const inviter = startParam.replace("ref", "");
  if (inviter !== String(userId)) {
    const key = "refs_" + inviter;
    let list = JSON.parse(localStorage.getItem(key)) || [];
    if (!list.includes(username)) {
      list.push(username);
      localStorage.setItem(key, JSON.stringify(list));
    }
  }
}

// UI UPDATE
function updateUI() {
  document.getElementById("balance").innerText =
    `$${balance.toFixed(4)}`;
  document.getElementById("adsSeen").innerText = adsSeen;
  document.getElementById("dailyEarned").innerText =
    dailyEarned.toFixed(4);
  document.getElementById("cooldown").innerText =
    cooldown ? "Cooldown..." : "Ready";

  document.getElementById("refHistory").innerText =
    refHistory.length ? refHistory.join("\n") : "No invites found";

  localStorage.setItem(BAL_KEY, balance);
  localStorage.setItem(ADS_KEY, adsSeen);
  localStorage.setItem(DAY_KEY, dailyEarned);
}

// COOLDOWN
function startCooldown() {
  cooldown = true;
  let t = COOLDOWN_SEC;
  const i = setInterval(() => {
    t--;
    document.getElementById("cooldown").innerText = `Cooldown ${t}s`;
    if (t <= 0) {
      clearInterval(i);
      cooldown = false;
      updateUI();
    }
  }, 1000);
}

// WATCH AD (REAL REWARD)
function watchAd() {
  if (cooldown) return;
  if (adsSeen >= DAILY_LIMIT) {
    alert("Daily ad limit reached");
    return;
  }

  show_10434113().then(() => {
    balance += AD_REWARD;
    dailyEarned += AD_REWARD;
    adsSeen++;

    // REFERRAL 20%
    if (startParam && startParam.startsWith("ref")) {
      const inviter = startParam.replace("ref", "");
      const refEarn = AD_REWARD * REF_PERCENT;
      const key = "bal_" + inviter;
      let invBal = Number(localStorage.getItem(key)) || 0;
      invBal += refEarn;
      localStorage.setItem(key, invBal);
    }

    updateUI();
    startCooldown();
  }).catch(() => {
    alert("Ad not available");
  });
}

// COPY REF
function copyRef() {
  navigator.clipboard.writeText(refLink);
  alert("Referral link copied");
}

updateUI();
function requestPayout() {
  const wallet = document.getElementById("wallet").value.trim();
  const status = document.getElementById("payoutStatus");

  if (!wallet || wallet.length < 6) {
    status.innerText = "❌ Enter a valid crypto address";
    return;
  }

  if (balance < 0.05) {
    status.innerText = "❌ Minimum withdraw is $0.05";
    return;
  }

  let payouts =
    JSON.parse(localStorage.getItem("payouts_" + userId)) || [];

  payouts.push({
    amount: balance.toFixed(4),
    wallet: wallet,
    time: new Date().toLocaleString(),
    status: "Pending"
  });

  localStorage.setItem(
    "payouts_" + userId,
    JSON.stringify(payouts)
  );

  status.innerText = "✅ Withdrawal requested (0–72 hours)";

  balance = 0;
  dailyEarned = 0;
  adsSeen = 0;

  updateUI();
}
