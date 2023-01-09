const url = "http://localhost:3000";
//const url = "https://taiga-metrics.herokuapp.com";
var metrics = [];
var selectedgroup = "";
var lastCheck = "";
var groupName = "";
var extensionTab = "";
var selectedmetrics = [];

var currentTime = new Date().getTime();


//get varables from localStorage
getLocalCheck();
getLocalGroupCode();
getLocalGroupName();
getLocalMetrics();


//-------LISTENERS-------//

//ENVIAR LES MÈTRIQUES SI EM PREGUNTEN
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.query === "metrics") {
      console.log("metrics requested", metrics);
      if (metrics.length == 0) {
        sendResponse({message: []});
        getLocalMetrics();
      }
      else sendResponse({message: metrics});
    }  
    else if (request.query === "groupname") {
      console.log("group name requested", groupName);
      if (groupName == "") {
        sendResponse({message: ""});
        getLocalGroupName();
      }
      else sendResponse({message: groupName});
    }
    else if (request.query === "group") {
      console.log("group requested", selectedgroup);
      if (selectedgroup == "") {
        sendResponse({message: ""});
        getLocalGroupCode();
      }
      else sendResponse({message: selectedgroup});
    }
    else if (request.query === "selectedmetrics") {
      console.log("selected metrics requested", selectedmetrics);
      if (selectedmetrics.length == 0) {
        sendResponse({message: []});
        getlocalselectedmetrics();
      }
      else sendResponse({message: selectedmetrics});
    }
    else if (request.query === "saveselectedmetrics") {
      saveselectedmetrics(request.data);
    }
  }
);

function saveselectedmetrics(selected) {
  selectedmetrics = selected;
  chrome.storage.local.set({'selectedmetrics': selected}, function() {
    console.log('Selected metrics saved: ', selected);
  });
}

function sendMetricswhenObtained() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {query: "metricsRecieved", data: metrics, dataname: groupName});  
  });
}

function sendGroupName() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {query: "groupNameRecieved", data: groupName});  
  });
}

function sendGroupCode() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {query: "groupCodeRecieved", data: selectedgroup});  
  });
}

function sendSelectedMetrics() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {query: "selectedMetricsRecieved", data: selectedmetrics});  
  });
}

//-------LOCALSTORAGE CONTROLLERS-------//

//agafar el grup del local storage i posarlo com a selected
function getLocalGroupCode() {
  chrome.storage.local.get('group', function (result) {
    if (result.group != undefined) {
      selectedgroup = result.group;
      console.log("Local Storage group: ", result.group);
      sendGroupCode();
    }
    else console.log("No group selected");
  });
}


//agafar el nom del grup del local storage
function getLocalGroupName() {
  chrome.storage.local.get('groupname', function (result) {
    if (result.groupname != undefined) {
      groupName = result.groupname;
      console.log("Local Storage group name: ", result.groupname);
      sendGroupName();
    }
    else console.log("No group name");
  });
}


//AGAFAR EL CHECK AL LOCALSTORAGE
function getLocalCheck() {
  chrome.storage.local.get('lastCheck', function (result) {
    if (result.lastCheck != undefined) {
      console.log("last Check was: ", result.lastCheck);
      lastCheck = result.lastCheck;
    }
    else console.log("No check has ben done");
  });
}


//AGAFAR LES MÈTRIQUES SELECCIONADES
function getlocalselectedmetrics() {
  chrome.storage.local.get('selectedmetrics', function (result) {
    if (result.selectedmetrics != undefined && result.selectedmetrics.length > 0) {
      console.log("Local Storage selected metrics: ", result.selectedmetrics);
      selectedmetrics = result.selectedmetrics;
      sendSelectedMetrics();
    }
    else console.log("No selected metrics");
  })
}


//AGAFAR LES MÈTRIQUES AL LOCALSTORAGE
function getLocalMetrics() {
  chrome.storage.local.get('metrics', function (result) {
    //hi ha hagut un check
    if (lastCheck != "") {
      var difference = Math.abs(currentTime - lastCheck) / 3600000;
      console.log(difference);
      //s'ha de buscar mètriques a la API
      if (difference > 24) {
        console.log("need to refresh metrics");
        getmetricsfromurl(selectedgroup);
      }
      //s'ha de buscar mètriques al localstorage
      else {
        console.log("metrics are up to date");
        console.log(result.metrics);
        if (result.metrics != undefined && result.metrics.length > 0) {
          console.log("Local Storage metrics: ", result.metrics);
          metrics = result.metrics;
        }
        else {
          console.log("metrics not found, calling API");
          getmetricsfromurl(selectedgroup);
        }
      }
    }
    //no hi ha hagut un check, s'ha de buscar mètriques a la API
    else {
      if (selectedgroup != "") {
        console.log("No check, calling metrics API");
        getmetricsfromurl(selectedgroup);
      }
      console.log("No group selected, can't call API");
    }
  });
}




//quan hi ha un canvi al grup posarlo com a selected
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if ("group" in changes) {
    var group = changes.group.newValue;
    if (group != undefined) {
      console.log("There has been a group change");
      selectedgroup = group;
      getmetricsfromurl(selectedgroup);
    }
  }
});


//-------FUNCTIONS-------//

//AGAFAR MÈTRIQUES DES DE LA API
function getmetricsfromurl(groupcode) {
  console.log("API GET call");

  fetch(url+'/metrics/?groupcode='+ groupcode, {
    method: 'GET'
  })
  .then(function(response) {
    console.log(response);
    if (response.ok) {
      return response.json();
    }
    else if (response.status == 400) {
      console.log("Group code does not exist");
    }
    else if (response.status == 401) {
      logIn();
    }
    throw new Error('('+ response.status + ') '+ response.statusText);
  })
  .then(function(responseJson) {
    console.log(responseJson);
    if (responseJson.metrics.length > 0) {
      getTaigametrics(responseJson);
      metricsCheck();
    }
    else console.log("metrics response was empty")
  })
  .catch((error) => {
    console.log(error);
    metrics = [];
    saveMetrics();
  });
}

//DEFINIR UN CHECK DE MÈTRIQUES
function metricsCheck() {
  newCheck = new Date().getTime();
  chrome.storage.local.set({'lastCheck': newCheck}, function() {
    console.log('time-check saved');
  });
  lastCheck = newCheck;
}

//GUARDAR LES MÈTRICQUES AL LOCALSTORAGE
function saveMetrics() {
  chrome.storage.local.set({'metrics': metrics}, function() {
    console.log(metrics);
    console.log('metrics saved');
  });
}

//GUARDAR EL GROUPNAME AL LOCALSTORAGE
function saveGroupName() {
  chrome.storage.local.set({'groupname': groupName}, function() {
    console.log(groupName);
    console.log('group name saved');
  });
}

//CLASSIFICAR I ASSIGNAR MÈTRIQUES NOMÉS DE TAIGA
//GUARDAR AL LOCALSTORAGE
function getTaigametrics(metricsJSON) {
  metrics = [];
  //console.log(metricsJSON);
  let json = metricsJSON.metrics;
  for (let index in json) {
    var id = json[index]['id'];
    if(!id.includes('commits') && !id.includes('lines')) {
      metrics.push(json[index]);
    }
  }
  saveMetrics();

  groupName = metricsJSON.groupname;
  saveGroupName();
  sendMetricswhenObtained();
}

//LOGIN A LA API
function logIn() {
  console.log("API GET call login");
  chrome.tabs.create({ url: url });
}

