function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
var randomHexNumber = getRndInteger(16**7, 16**8-1).toString(16).toUpperCase();
var text = `0x${randomHexNumber} erased`
const sleep = ms => new Promise(r => setTimeout(r, ms));
sleep(100)
document.getElementById('addr').innerHTML = text
document.getElementById('heading').innerHTML = text
document.getElementById('counter').innerHTML = "5"
var t = 500
setInterval(() => {
    t -= 1
    document.getElementById('counter').innerHTML = `You will be redirected back to my home page in ${(t/100).toFixed(2)} seconds...`
}, 10)
setTimeout(function(){
    window.location.replace("https://ultrio.neocities.org/");
}, 5000)