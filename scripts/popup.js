document.addEventListener("DOMContentLoaded", function() {
    let buttons = document.querySelectorAll("button");
    buttons.forEach(function(button) {
        button.addEventListener("click", function() {
            //chrome.storage.local.clear();
            chrome.storage.local.set({'group': button.value}, function() {});
        });
    });
});

