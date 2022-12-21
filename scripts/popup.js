document.addEventListener("DOMContentLoaded", function() {
    
    let buttons = document.querySelectorAll("button");
    buttons.forEach(function(button) {
        button.addEventListener("click", function() {
            chrome.storage.local.set({'group': button.value}, function() {});
        });
    });

    let loginbutton = document.getElementById('login');
    loginbutton.addEventListener("click", function() {
        chrome.tabs.create({url: $(this).attr('href')});
    });
    
});



