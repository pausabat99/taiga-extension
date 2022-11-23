var url = "http://gessi-dashboard.essi.upc.edu:8888/api/metrics/current?prj=s11a"

fetch(url,
    { method: 'GET',
    //headers: misCabeceras,
    mode: 'cors', // <---
    cache: 'default'
}).then((response) => {
  if (response.ok) {
    return response.json();
  }
  throw new Error('Something went wrong');
})
.then((responseJson) => {
  console.log(responseJson);
})
.catch((error) => {
  console.log(error)
});

