var url = "http://gessi-dashboard.essi.upc.edu:8888/api/metrics/current?prj=s11a"
var metrics = [];

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
  console.log(error)
});


function getTaigametrics(json) {
  for (let index in json) {
    var id = json[index]['id'];
    if(!id.includes('commits') && !id.includes('lines')) {
      metrics.push(json[index]);
    }
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.request === "metrics")
      sendResponse({farewell: metrics});
  }
);