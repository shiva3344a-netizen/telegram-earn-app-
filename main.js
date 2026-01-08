const tg = Telegram.WebApp;
tg.expand();
// user id
const userId = tg.initDataUnsafe?.user?.id || "guest";

// load saved data
let coins = Number(localStorage.getItem("coins_" + userId)) || 0;
let adsSeen = Number(localStorage.getItem("ads_" + userId)) || 0;

let cooldown = false;
let cd = 3;

const BOT = "AdsEarning_43_Bot";
const uid = tg.initDataUnsafe?.user?.id || Math.floor(Math.random()*1e9);

// username
document.getElementById("username").innerText =
  "Welcome @" + (tg.initDataUnsafe?.user?.username || "User");

// referral
const refCode = "ref" + uid;
const refLink = `https://t.me/${BOT}?start=${refCode}`;

// referral history
let refs = JSON.parse(localStorage.getItem("refs") || "[]");

// ad
function watchAd() {
  if (cooldown) return alert("Wait");

  show_10434113().then(() => {
    coins += 10;
    adsSeen++;
    updateUI();
    startCD();
  });
}

function startCD() {
  cooldown = true;
  let t = cd;
  const i = setInterval(()=>{
    t--;
    if(t<=0){clearInterval(i);cooldown=false;}
  },1000);
}
function updateUI() {
  // balance
  document.getElementById("balance").innerText = coins + " Coins";

  // USD conversion (10 coins = $0.01)
  document.getElementById("usd").innerText =
    "≈ $" + (coins / 1000).toFixed(2);

  // ads stats
  document.getElementById("adsSeen").innerText = adsSeen + "/50";
  document.getElementById("dailyEarned").innerText =
    (adsSeen * 10) + "/500";

  // cooldown text
  document.getElementById("cooldown").innerText =
    cooldown ? "Cooldown running..." : "Ready to watch ad";

  // save data (VERY IMPORTANT)
  localStorage.setItem("coins_" + userId, coins);
  localStorage.setItem("ads_" + userId, adsSeen);
}

// tabs
function openTab(t){
  if(t==="ref"){
    alert(
      refs.length
      ? refs.join("\n")
      : "No invites found"
    );
  }
  if(t==="pay") alert("Payout coming soon");
}

// fake verify (real check in bot)
function verifyJoin(){
  document.getElementById("joinBlock").style.display="none";
}
updateUI();
