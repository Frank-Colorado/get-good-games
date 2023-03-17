
fetch('https://api.rawg.io/api/platforms?key=a29e01702f3d4aa2a58af885563c92b7')

.then(response => response.json())

.then(data => {

console.log(data);

document.getElementById('tester').textContent = data.results[0].name;
	   
	  
 })



var requestOptions = {

	method: 'GET',

	redirect: 'follow'

  };

	fetch("https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15", requestOptions)

	  .then(response => response.json())

	  .then(result => console.log(result))

	  .catch(error => console.log('error', error));
