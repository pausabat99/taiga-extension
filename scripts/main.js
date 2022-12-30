var metricsData = [];
var globalMetrics = [];
var personalMetrics = [];
var selectedMetrics = [];
var groupName = "";
var group = "";

loadheaders();

setTimeout(() => {
  execute();
}, "6000")

function getMetricsJSON() {
  chrome.runtime.sendMessage({query: "metrics"}, function(response) {
    //Treure aquest console.log
    console.log(response.message);
    metricsData = response.message;
  });
}

function getSelectedGroupName() {
  chrome.runtime.sendMessage({query: "groupname"}, function(response) {
    console.log(response.message);
    groupName = response.message;
  })
}

function getSelectedGroup() {
  chrome.runtime.sendMessage({query: "group"}, function(response) {
    console.log(response.message);
    group = response.message;
  })
}


//----MAIN FUNCTION----//
function execute() {
    const description = document.getElementsByClassName("description")[0];
    var projectName = document.getElementsByClassName("project-name")[0];

    projectName.style.minWidth = "270px";

    var realprojectname = projectName.childNodes[0].data;

    getMetricsJSON();
    getSelectedGroup();
    getSelectedGroupName();

    var metrics = document.createElement("div");
    var button = document.createElement("button");
    button.id = "metricsButton";
    button.className = "btn-small";
    button.innerHTML = "METRICS";
    metrics.appendChild(button);

    description.parentNode.insertBefore(metrics, description.nextSibling);

    button.onclick = function() {
      button.style.display = "none";
      metrics.innerHTML = '<h2>METRICS</h2>';
      var timeline = document.getElementsByClassName("timeline")[0];
      var firstChild = timeline.children[0];
      firstChild.remove();

      var div = document.createElement("div");
      div.id = "metricsDiv";

      timeline.appendChild(div);
      
      if (metricsData.length > 0 && realprojectname.includes(groupName)) {

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
        addbutton.innerText = "+ ADD";
        addbutton.id = "addmetricsbutton";
        addbutton.className = "column rigth btn-small";
        addbutton.disabled = true;
        chooser.appendChild(addbutton);
        addbutton.addEventListener('click', addmetric);

        //VIEW METRICS BUTTON
        var viewbutton = document.createElement("button");
        viewbutton.innerText = "View metrics";
        viewbutton.id = "viewmetricsbutton";
        viewbutton.className = "btn-big";
        viewbutton.disabled = true;
        div.appendChild(viewbutton);

        // METRICS CARDS GRID
        var cards = document.createElement("div");
        cards.id = "cardsDiv";
        cards.className = "cardsDivSingle";
        div.appendChild(cards);
        //Listener to showmetrics
        viewbutton.addEventListener('click', showmetrics);
        

        //HANDLE SWITCH
        var toggleswitch = document.getElementById("switchmetrics");
        toggleswitch.addEventListener('change', function () {
          if (toggleswitch.checked) {
            globaldiv.style.display = 'none';      // Hide global div
            personaldiv.style.display = 'block';
            console.log('Team metrics');
            let selector = personaldiv.firstElementChild;
            if (selector.value == "default") {
              addbutton.disabled = true;
            }
          } else {
            personaldiv.style.display = 'none';      // Hide personal div
            globaldiv.style.display = 'block';
            console.log('Project metrics');
            let selector = globaldiv.firstElementChild;
            if (selector.value == "default") {
              addbutton.disabled = true;
            }
          }
        }); 
      } 
      //METRICS NOT FOUND
      else {
        var divimage = document.createElement("div");
        divimage.className = "empty-large";
        var img = document.createElement("img");
        img.src = "https://tree.taiga.io/v-1664173031373/images/empty/empty_tex.png";
        divimage.appendChild(img);

        var errormessage = document.createElement("div");
        if (group == "") {
          errormessage.innerHTML =
            '<h2>Ooops, something went wrong. Group not selected...</h2>' +
            '<p>Please select group and reaload page</p>';
        }
        else if (metricsData.length == 0) {
          errormessage.innerHTML = 
            '<h2>Ooops, something went wrong. Metrics could not be loaded...</h2>' +
            '<p>Please try to reload page</p>';
        }
        else if (!realprojectname.includes(groupName) && groupName != projectName) {
          errormessage.innerHTML =
            '<h2>Ooops, something went wrong. You do not have permissions to see these metrics...</h2>' +
            '<p>Please select your group and reaload page</p>';
        }
        divimage.appendChild(errormessage);

        div.appendChild(divimage);
      }
    }
}

//FUNCTIONS

function showmetrics() {
  //REMOVE PREVIOUS LOADED CARDS
  var cardsDiv = document.getElementById("cardsDiv"); 
  while (cardsDiv.lastElementChild) {
    cardsDiv.removeChild(cardsDiv.lastElementChild);
  }
  if (selectedMetrics.length > 1) cardsDiv.className = "cardsDiv";
  for (i in selectedMetrics) {
    var card = document.createElement("div");
    card.className = "cardnormal";
    if (selectedMetrics.length == 1) card.style.width = "auto";
    card.innerHTML = 
      '<div>' +
        '<div id="titlecardsection">' +
          '<h4 class="metric_title">' + selectedMetrics[i]['name'] + '</h4>' +
          '<div class="dropdown">' +
            '<button class="dropdownbutton">...</button>' +
            '<div class="dropdown-content-hide">' +
              '<ul>' +
                '<li><button class="infobutton">' +
                  '<svg class="iconsmall">' +
                    '<use xlink:href="#icon-help-circle" attr-href="#icon-help-circle"></use>' +
                  '</svg>' +
                  '<div class="popup">' +
                    'Metric description<span class="popuptext">'+ selectedMetrics[i]['description'] +'</span>' +
                  '</div>'+
                '</button></li>' +
                '<li><button class="closebutton">' +
                  '<svg class="iconsmall"><use xlink:href="#icon-trash" attr-href="#icon-trash"></use></svg>' +
                  'Delete metric</button>' +
                '</li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<hr>' +
        '<div class="chart-out">' +
          '<div class="chart-in" id="chart-in'+i+'">' +
        '</div>' +
        '<div class="datesection">' +
          '<p>Date of calculation: ' + selectedMetrics[i]['date'] + '</p>'
        '</div>'
      '</div>';
      cardsDiv.appendChild(card);
      creategraphicBar(i, selectedMetrics[i]['value_description']);
  }

  setupDropdownbuttons();
  setupClosebuttons();
  setupInfobuttons();
}

/**
 * FUNCTIONS TO SET UP METRICS CARDS
 */

function setupDropdownbuttons() {
  var dropdownbuttons = document.getElementsByClassName("dropdownbutton");
  for (let i = 0; i < dropdownbuttons.length; ++i) {
    let button = dropdownbuttons[i];
    button.addEventListener('click', function() {
      let content = button.nextSibling;
      if(content.className == "dropdown-content-show") {
        content.style.animation = "fadeOut 500ms";
        setTimeout(() => {
          content.className ="dropdown-content-hide";
        }, 400); 
      }
      else {
        content.className = "dropdown-content-show";
        content.style.animation = "fadeIn 500ms";
      }
    })
  }
}

function setupClosebuttons() {
  var closebuttons = document.getElementsByClassName("closebutton");
  for (let i = 0; i < closebuttons.length; ++i) {
    let button = closebuttons[i];
    button.addEventListener('click', function() {
      console.log(selectedMetrics);
      selectedMetrics.splice(i, 1);
      cardsDiv.children[i].style.animation = "fadeOut 500ms";
      setTimeout(() => {
        cardsDiv.children[i].remove();
        if (selectedMetrics.length < 2) cardsDiv.className = "cardsDivSingle";
      }, 400);
      console.log(selectedMetrics);
    });
  }
}

function setupInfobuttons() {
  var infobuttons = document.getElementsByClassName('infobutton');
  for (let i = 0; i < infobuttons.length; ++i) {
    let button = infobuttons[i];
    button.addEventListener('click', function() {
      let popup = button.children[0].nextSibling;
      popup = popup.children[0]
      popup.classList.toggle("show");
    });
  }
}


function addmetric() {
  var switchmetrics = document.getElementById("switchmetrics");
  let viewbutton = document.getElementById("viewmetricsbutton");
  if (switchmetrics.checked) {
    var id = document.getElementById("selectpersonal").value;
    id = id.replace('pm','');
    if (!selectedMetrics.includes(personalMetrics[id])) {
      selectedMetrics.push(personalMetrics[id]);
    }  
  }
  else {
    var id = document.getElementById("selectglobal").value;
    id = id.replace('gm','');
    if (!selectedMetrics.includes(globalMetrics[id])) {
      selectedMetrics.push(globalMetrics[id]);
    }
  }
  if (selectedMetrics.length > 0) viewbutton.disabled = false;
  console.log(selectedMetrics);
}


function loadheaders() {
  var head  = document.head;
  //LOAD CSS EXTENSION STYLESHEET
  var cssId = 'myCss';
  if (!document.getElementById(cssId))
  {
      var link  = document.createElement('link');
      link.id   = cssId;
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = '../../styles/main.css';
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

  var defaultoption = '<option value="default" selected disabled>Choose metric...</option>';
  choose.innerHTML = defaultoption;
  for (let i = 0; i < globalMetrics.length; ++i) {
    if (globalMetrics[i]['description'] == "") {
      globalMetrics[i]['description'] = "No info";
    }
    var option = document.createElement("option");
    option.value = "gm"+i;
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
    option.value = "pm"+i;
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

function creategraphicBar(index, metricValue) {
  metricValue = metricValue*100;
  let infoButton = document.createElement('label');
  let infoText = document.createTextNode(`${metricValue}%`);
  infoButton.classList.add("info");
  infoButton.appendChild(infoText);
  let barIn = document.createElement("div");
  barIn.classList.add("bar-in");
  barIn.style.width = `${metricValue}%`;
  let barOut = document.createElement("div");
  barOut.classList.add("bar-out");
  barOut.appendChild(infoButton);
  barOut.appendChild(barIn); 
  document.getElementById("chart-in"+index).appendChild(barOut);
}











