var blacklist;
var delay;
var cooldown;
var waitedDict;

async function initSettings() {
    chrome.storage.sync.get(null, function(res) {
        blacklist = res.blacklist || "";
        delay = res.delay || 7;
        cooldown = res.cooldown || 0.5;        
        waitedDict = res.waitedDict || new Object();
    });
    chrome.storage.sync.set({"blacklist": blacklist, "delay": delay, "cooldown": cooldown, "waitedDict": waitedDict});
}

async function updateSettings() {
    chrome.storage.sync.get(["blacklist", "delay", "cooldown"], function(res) {
        blacklist = res.blacklist;
        delay = res.delay;
        cooldown = res.cooldown;
    });
}

async function updateWaited(){
    chrome.storage.sync.get("waitedDict").then(x => waitedDict = x.waitedDict);
}

function tabWait(tab, elapsedTimeMs, targetDurationMs, callback) {
    if (tab.active) {
        elapsedTimeMs += 250;
        if (elapsedTimeMs >= targetDurationMs) {
            callback();
            return;
        }
    }
    setTimeout(() => tabWait(tab, elapsedTimeMs + 250, targetDurationMs, callback), 250);
}

function sleep(ms) {
    return new Promise(res => {
        setTimeout(res, ms);
    });
}

async function redirectToBackground(tabId, destinationUrl) {
    chrome.tabs.update(tabId, {
        url: chrome.runtime.getURL('wait.html')
    });
    sleep(delay * 1000).then(() => chrome.tabs.update(tabId, {url: destinationUrl}));
}

// async function waitedAlreadyFromStorage(hostname) {
//     return await chrome.storage.sync.get(["waitedDict"], (res) => {
//         return Date.now() < res.waitedDict[hostname] + 60 * 1000 * cooldown;
//     });
// }

function waitedAlready(hostname){
    return Date.now() < waitedDict[hostname] + 60 * 1000 * cooldown;
}


async function notifyCooldownTriggered(hostname){
    updateWaited();
    waitedDict[hostname] = Date.now();
    chrome.storage.sync.set({"waitedDict": waitedDict});
}


chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
    initSettings();
});

// update settings if settings storage changes
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if(changes.blacklist || changes.delay || changes.cooldown){
        updateSettings();
    }
    if(changes.waitedDict){
        updateWaited();
    }
});

// check url against blacklist
chrome.webNavigation.onBeforeNavigate.addListener((data) => {
    if (data.parentFrameId === -1) {
        console.log(data);
        let testUrl = new URL(data.url);
        // if url hostname is in blacklist, check if we have already waited for url within time limit
        if (testUrl){
            if ((testUrl.protocol == "https:" || testUrl.protocol == "http:") && blacklist.includes(testUrl.hostname)) {
                if (waitedAlready(testUrl.hostname)) {
                    console.log(`bypassing wait because cooldown site:${testUrl}`);
                    // do nothing, let request go through
                } else {
                    // add hostname to list of cooldowns
                    console.log(`triggering cooldown site:${testUrl}`);
                    notifyCooldownTriggered(testUrl.hostname);
                    redirectToBackground(data.tabId, data.url);
                }
            } else {
                console.log(`Url hostname not in blacklist site:${testUrl.hostname}`);
            }
        } else {
            console.log(`url can't match ${data.url}`)
        }
    }
});