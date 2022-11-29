var metricsData = [];
var globalMetrics = [];
var personalMetrics = [];
var selectedMetrics = [];

loadheaders();

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
      button.disabled = "true";
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

        divideMetrics();

        //HEADER
        var header = '<h1 id="content">Select metrics</h1>';
        header.id = "metricsheader";
        div.innerHTML = header;

        //SWITCH
        var selectordiv = document.createElement("div");
        selectordiv.id = "selectordiv";
        div.appendChild(selectordiv);

        var togglebutton = 
          '<label class="toggleSwitch nolabel" onclick="">' +
            '<input id="switchmetrics" type="checkbox"/>' +
            '<a></a>' +
            '<span>' +
                '<span class="left-span">Project metrics</span>' +
                '<span class="right-span">Team metrics</span>' +
            '</span>' +
          '</label>';
        selectordiv.innerHTML = togglebutton;

        //DROP DOWN SELECTOR
        var chooser = document.createElement("div");
        chooser.id = "chooser";
        chooser.className = "row"
        selectordiv.appendChild(chooser);

        var globaldiv = document.createElement("div");
        var personaldiv = document.createElement("div");
        globaldiv.className = "column left";
        personaldiv.className = "column left";
        chooser.appendChild(globaldiv);
        chooser.appendChild(personaldiv);

        getGlobalMetrics(globaldiv);
        getPersonalMetrics(personaldiv);
        personaldiv.style.display = 'none';

        var addbutton = document.createElement("button");
        addbutton.innerText = "+ ADD METRIC";
        addbutton.id = "addmetricsbutton";
        addbutton.className = "column rigth btn-small";
        addbutton.disabled = true;
        chooser.appendChild(addbutton);
        addbutton.addEventListener('click', addmetric);


        //HANDLE SWITCH
        var toggleswitch = document.getElementById("switchmetrics");
        toggleswitch.addEventListener('change', function () {
          if (toggleswitch.checked) {
            globaldiv.style.display = 'none';      // Hide global div
            personaldiv.style.display = 'block';
            //getPersonalMetrics(selectordiv);
            console.log('Checked');
          } else {
            personaldiv.style.display = 'none';      // Hide personal div
            globaldiv.style.display = 'block';
            //getGlobalMetrics(selectordiv);
            console.log('Not Checked');
          }
        });

        //SELECT METRICS WITH BUTTON AND SELECTOR


        
      } 
      //METRICS NOT FOUND
      else {
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

function addmetric() {
  var selected = document.getElementById("switchmetrics");
  if (selected.checked) {
    var selectedmetric = document.getElementById("selectpersonal").value;
    console.log(selectedmetric);
  }
  else {
    var selectedmetric = document.getElementById("selectglobal").value;
    console.log(selectedmetric);
  }
}


function loadheaders() {
  var head  = document.getElementsByTagName('head')[0];
  //LOAD CSS EXTENSION STYLESHEET
  var cssId = 'myCss';
  if (!document.getElementById(cssId))
  {
      var link  = document.createElement('link');
      link.id   = cssId;
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = '../styles/stylesheet.css';
      link.media = 'all';
      head.appendChild(link);
      console.log("Stylesheet loaded");
  }
}

function divideMetrics() {
  for (let i = 0; i < metricsData.length; ++i) {
    let searchCriteria = ["acceptance_criteria_check", "closed_tasks_with_AE", "deviation_effort_estimation_simple", "pattern_check", "tasks_sd", "tasks_with_EE", "unassignedtasks"];
    if (searchCriteria.includes(metricsData[i]['id'])) globalMetrics.push(metricsData[i]);
    else personalMetrics.push(metricsData[i]);
  }
}

function getGlobalMetrics(selector) {
  console.log(globalMetrics);

  var choose = document.createElement("select");
  choose.id = "selectglobal";
  choose.className = "selectmetrics";
  selector.appendChild(choose);

  var defaultoption = '<option value="default" selected disabled>Choose...</option>';
  choose.innerHTML = defaultoption;
  for (let i = 0; i < globalMetrics.length; ++i) {
    var option = document.createElement("option");
    option.value = "m"+i;
    option.innerHTML = globalMetrics[i]['name'];
    choose.appendChild(option);
  }

  choose.addEventListener('change', function() {
    var buttonmetrics = document.getElementById("addmetricsbutton");
    if (choose.value != "default") {
      buttonmetrics.disabled = false;
    }
  });
}

function getPersonalMetrics(selector) {
  console.log(personalMetrics);

  var choose = document.createElement("select");
  choose.id = "selectpersonal";
  choose.className = "selectmetrics";
  selector.appendChild(choose);

  var defaultoption = '<option value="default" selected disabled>Choose...</option>';
  choose.innerHTML = defaultoption;
  for (let i = 0; i < personalMetrics.length; ++i) {
    var option = document.createElement("option");
    option.value = "m"+i;
    option.innerHTML = personalMetrics[i]['name'];
    choose.appendChild(option);
  }

  choose.addEventListener('change', function() {
    var buttonmetrics = document.getElementById("addmetricsbutton");
    if (choose.value != "default") {
      buttonmetrics.disabled = false;
    }
  });
}











