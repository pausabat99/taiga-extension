var metricsData = [];

setTimeout(() => {
  execute();
}, "6000")


function execute() {
    const title = document.getElementsByClassName("description")[0];

    const firstheader = document.getElementsByTagName("meta")[0];
    var shit = document.getElementsByTagName("meta")[1];
    shit.remove();
    var meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "upgrade-insecure-requests";
    firstheader.parentNode.insertBefore(meta, firstheader);

    getJSON();

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
        '<div id="content">'+
          '<h1 id="content">Selecciona les mètriques</h1>' +
          '<select id="selector">' +
              '<option value="m1">Mètrica 1</option>' +
              '<option value="m2">Mètrica 2</option>' +
              '<option value="m3">Mètrica 3</option>' +
              '<option value="m4">Mètrica 4</option>' +
              '<option value="m5">Mètrica 5</option>' +
          '</select>' +
        '</div>';
      div.innerHTML = html;

      timeline.appendChild(div);
    }
}

function getJSON() {
  
}












