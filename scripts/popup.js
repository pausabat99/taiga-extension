document.addEventListener("DOMContentLoaded", function() {

    chrome.storage.local.get('group', function (result) {
        if (result.group != undefined) {
          var selectedbutton = document.getElementById(result.group);
          selectedbutton.classList.add("selected");
        }
    });
    
    let buttons = document.querySelectorAll("button");
    buttons.forEach(function(button) {
        button.addEventListener("click", function() {
            resetSelected();
            chrome.storage.local.set({'group': button.value}, function() {});
            button.classList.add("selected");
        });
    });
        
});

function resetSelected() {
    var elems = document.querySelectorAll(".selected");
    [].forEach.call(elems, function(el) {
        el.className = el.className.replace(/\bselected\b/, "");
    });
}



