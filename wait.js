var waitTime;


$(document).ready(main);

function main(){
    document.getElementById("phrase").innerHTML = getPhrase();
    getDelay().then((x) => {waitTime = x.delay})
    .then(x => document.getElementById("countdown").innerHTML = waitTime)
    .then(tick)
}

function tick() {
    document.getElementById('countdown').innerHTML = waitTime;
    
    if (waitTime > 0) {
        waitTime--;
        setTimeout(tick, 1000);
    }
}

async function getDelay(){
    return await chrome.storage.sync.get(["delay"]);
}

function getPhrase() {
    var phrases = Array();
    
    phrases[0] = "What should you be doing right now?";
    phrases[1] = "How much do you value your time?";
    phrases[2] = "Is it really worth the wait?";
    phrases[3] = "Is this what you planned on doing today?";
    phrases[4] = "What's on your to do list?";
    phrases[5] = "Do you know what Command-W does?";
    phrases[6] = "Why did you even install this extension?";
    
    return phrases[Math.floor(Math.random()*phrases.length)];
}


