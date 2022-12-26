//const url = "https://taiga-metrics.herokuapp.com";
const url = "http://localhost:3000";
var metrics = [];
var selectedgroup = "";
var lastCheck = "";

var currentTime = new Date().getTime();


//-------LOCALSTORAGE CONTROLLERS-------//

//agafar el grup del local storage i posarlo com a selected
chrome.storage.local.get('group', function (result) {
  if (result.group != undefined) {
    selectedgroup = result.group;
    console.log("Local Storage group: ", result.group);
  }
  else console.log("No group selected");
});

//AGAFAR EL CHECK AL LOCALSTORAGE
chrome.storage.local.get('lastCheck', function (result) {
  if (result.lastCheck != undefined) {
    console.log("last Check was: ", result.lastCheck);
    lastCheck = result.lastCheck;
  }
  else console.log("No check has ben done")
});

//AGAFAR LES MÈTRIQUES AL LOCALSTORAGE
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
      console.log("metric are up to date");
      if (result.metrics != undefined) {
        console.log("Local Storage metrics: ", result.metrics);
        metrics = result.metrics;
      }
    }
  }
  //no hi ha hagut un check, s'ha de buscar mètriques a la API
  else {
    console.log("No check, calling metrics API");
    getmetricsfromurl(selectedgroup);
  }
});





//-------LISTENERS-------//

//ENVIAR LES MÈTRIQUES SI EM PREGUNTEN
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.query === "metrics") {
      console.log("metrics requested");
      console.log(metrics);
      //CANVIAR
      //sendResponse({message: metrics[selectedgroup]});
      sendResponse({message: metrics});
    }  
  }
);

//quan hi ha un canvi al grup posarlo com a seleced
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if ("group" in changes) {
    var group = changes.group.newValue;
    if (group != undefined) {
      console.log("There has been a group change");
      selectedgroup = group;
      //treure aixo
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
    else if (response.status == 401) {
      console.log("User is not logged in");
      chrome.tabs.create({ url: url+'/auth/google' });
    }
    else if (response.status == 400) {
      console.log("Group code does not exist");
    }
    throw new Error('('+ response.status + ') '+ response.statusText);
  })
  .then(function(responseJson) {
    console.log(responseJson);
    getTaigametrics(responseJson);
    metricsCheck();
  })
  .catch((error) => {
    console.log(error);
    //metrics = [];
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


//CLASSIFICAR I ASSIGNAR MÈTRIQUES NOMÉS DE TAIGA
//GUARDAR AL LOCALSTORAGE
function getTaigametrics(json) {
  metrics = [];
  console.log(json);
  for (let index in json) {
    var id = json[index]['id'];
    if(!id.includes('commits') && !id.includes('lines')) {
      metrics.push(json[index]);
    }
  }
  saveMetrics();
}

