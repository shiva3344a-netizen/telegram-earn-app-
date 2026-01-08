const tg = Telegram.WebApp;
tg.expand();

let coins = 0;
let adsSeen = 0;
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
  document.getElementById("balance").innerText = coins+" Coins";
  document.getElementById("usd").innerText =
    `≈ $${(coins/1000).toFixed(2)}`;
  document.getElementById("adsSeen").innerText = adsSeen;
  document.getElementById("dailyEarned").innerText = coins;
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
