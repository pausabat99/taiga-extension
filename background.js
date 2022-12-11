var url = "http://gessi-dashboard.essi.upc.edu:8888/api/metrics/current?prj=s"
var metrics = [];


chrome.storage.local.get('metrics', function (result) {
  console.log("Local Storage metrics: ", result.metrics);
  if (result.metrics != undefined) {
    metrics = result.metrics;
  }
});

chrome.storage.local.get('group', function (result) {
  console.log("Local Storage group: ", result.group);
  if (result.group != undefined) {
    changeUrl(result.group);
    getmetricsfromurl();
  }
});


chrome.storage.onChanged.addListener(function(changes, namespace) {
  if ("metrics" in changes) {
    metrics = changes.metrics.newValue;
    if (metrics != undefined) {
      metrics.toString();
      console.log("Mètriques canviades: ", metrics);
    }
  }
  else if ("group" in changes) {
    var group = changes.group.newValue;
    if (group != undefined) {
      changeUrl(group);
      getmetricsfromurl();
    }
  }
});


function getmetricsfromurl() {

  console.log("crida a la api");

  fetch(url,
    { method: 'GET',
    //headers: misCabeceras,
    mode: 'cors', // <---
    cache: 'default'
    }).then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Something went wrong');
    })
    .then(function(responseJson) {
      console.log(responseJson);
      getTaigametrics(responseJson);
    })
    .catch((error) => {
      console.log(error);
      metrics = []; //Group is incorrect or api does not work
    });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.query === "metrics") {
      sendResponse({message: metrics});
    }  
  }
);


function getTaigametrics(json) {
  metrics = [];
  for (let index in json) {
    var id = json[index]['id'];
    if(!id.includes('commits') && !id.includes('lines')) {
      metrics.push(json[index]);
    }
  }
  chrome.storage.local.set({'metrics': metrics}, function() {
    console.log('metrics saved');
});
}

function changeUrl(group) {
  if (url.slice(-1) == 's') {
    url += group;
  }
  else {
    url = url.slice(0, -3);
    url += group;
  }
  console.log(url);
}


