var metricsData = [];

setTimeout(() => {
  execute();
}, "6000")

function getJSON() {
  chrome.runtime.sendMessage({query: "metrics"}, function(response) {
    //Treure aquest console.log
    console.log(response.message);
    metricsData = response.message;
  });
}

function execute() {
    const title = document.getElementsByClassName("description")[0];

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
      div.id = "metricsDiv";

      //DESCOMENTA PER VERUE QUE PASSA SI NO HI HA METRIQUES DISPONIBLES
      //metricsData = [];
      //console.log(metricsData);

      timeline.appendChild(div);

      if (metricsData.length > 0) {
        var header = '<h1 id="content">Select metrics</h1>';
        div.innerHTML = header;

        var buttonpersonal = document.createElement("button");
        var buttonglobal = document.createElement("button");

        var choose = document.createElement("select");
        div.appendChild(choose);

        for (let i = 0; i < metricsData.length; ++i) {
          var option = document.createElement("option");
          option.value = "m"+i;
          option.innerHTML = metricsData[i]['name'];
          choose.appendChild(option);
        }

      } else {
        var divimage = document.createElement("div");
        divimage.className = "empty-large";
        var img = document.createElement("img");
        img.src = "https://tree.taiga.io/v-1664173031373/images/empty/empty_tex.png";
        divimage.appendChild(img);

        var message = document.createElement("p");
        message.innerHTML = "Ooops, something went wrong. Metrics could not be loaded..."
        img.parentNode.insertBefore(message, img.nextSibling);
        div.appendChild(divimage);
      }
    }
}












