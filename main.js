const tg = window.Telegram.WebApp;
tg.ready();

const user = tg.initDataUnsafe.user;

// Username fix
const name = user.username
  ? "@" + user.username
  : user.first_name;

document.getElementById("username").innerText = "Welcome " + name;

// Referral link fix
const refLink = `https://t.me/AdsEarning_43_Bot?start=${user.id}`;
document.getElementById("refLink").value = refLink;

// Dummy balance
let balance = 0.0;
document.getElementById("balance").innerText = "$" + balance.toFixed(4);

// Watch Ad
function watchAd() {
  balance += 0.001;
  document.getElementById("balance").innerText = "$" + balance.toFixed(4);
  alert("Ad watched! +$0.001");
}

// Copy referral
function copyRef() {
  navigator.clipboard.writeText(refLink);
  alert("Referral link copied!");
}

// Withdraw
function withdraw() {
  const type = document.getElementById("payoutType").value;
  const wallet = document.getElementById("wallet").value;

  if (!wallet) {
    alert("Enter wallet address");
    return;
  }

  if (balance < 0.05) {
    alert("Minimum withdraw is $0.05");
    return;
  }

  alert(`Withdraw Requested\nType: ${type}\nWallet: ${wallet}`);
}
