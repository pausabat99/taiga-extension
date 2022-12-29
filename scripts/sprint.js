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

function loadheaders() {}

//----MAIN FUNCTION----//
function execute() {
    
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