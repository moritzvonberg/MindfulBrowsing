const blacklistInput = document.getElementById("blacklist-input");
const delayInput = document.getElementById("delay-input");
const cooldownInput = document.getElementById("allow-interval-input");
const settingsSubmit = document.getElementById("settings-submit");

// Restricts input for the given textbox to the given inputFilter function.
// https://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input/469362#469362
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
      textbox.addEventListener(event, function() {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          this.value = "";
        }
    });
    });
}

function loadFormFields(){
    chrome.storage.sync.get(["blacklist", "delay", "cooldown"], (result) => {
        blacklistInput.value = result.blacklist;
        delayInput.value = result.delay || 5;
        cooldownInput.value = result.cooldown || 1;
    });
}

loadFormFields();

// Filter regex for numbers (no exponent)
setInputFilter(delayInput, function(input) {
    return /^\d*\.?\d*$/.test(input);
});

setInputFilter(cooldownInput, function(input) {
    return /^\d*\.?\d*$/.test(input);
});

settingsSubmit.addEventListener("click", () => {
    let newBlacklistContent = blacklistInput.value;
    let newDelay = parseFloat(delayInput.value);
    let newCooldown = parseFloat(cooldownInput.value);

    chrome.storage.sync.set({"blacklist": newBlacklistContent, "delay": newDelay, "cooldown": newCooldown}, () => {
        alert(`settings updated.
        Delay = ${newDelay}s
        Cooldown = ${newCooldown}min`);
    });
    loadFormFields();

});