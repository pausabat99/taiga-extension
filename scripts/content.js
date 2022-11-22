setTimeout(() => {
    execute();
  }, "6000")


function execute() {
    const title = document.getElementsByClassName("description")[0];

    var metrics = document.createElement("div");
    var button = document.createElement("button");
    button.setAttribute("id", "metricsButton");
    button.innerHTML = "METRICS";
    metrics.appendChild(button);

    title.parentNode.insertBefore(metrics, title.nextSibling);

    button.onclick = function() {
      var timeline = document.getElementsByClassName("timeline")[0];
      var firstChild = timeline.children[0];
      firstChild.remove();

      var div = document.createElement("div");
      var html =
      '<h1 id="h1">Selecciona les mètriques</h1>';
      div.innerHTML = html;

      timeline.appendChild(div);
    }
}










