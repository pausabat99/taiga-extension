setTimeout(() => {
    execute();
  }, "7000")


function execute() {
    const collection = document.getElementsByClassName("single-project-intro")[0];
    var spn = document.createElement("a");
    spn.textContent = "METRICS!!!";
    collection.parentNode.insertBefore(spn, collection.nextSibling);
}










