/*
var requestOptions = {

	method: 'GET',

	redirect: 'follow'

  };

	fetch("https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15", requestOptions)

	  .then(response => response.json())

	  .then(result => console.log(result))

	  .catch(error => console.log('error', error));

*/

//get the search input element by its ID
const searchInput = document.getElementById('search_input');
const suggestionDropdown = document.getElementById('suggestions');

//add an event listener to search input field
searchInput.addEventListener('input', () => {
	//gets the search query from the input field
	const searchQuery = searchInput.value;

	//construct the API URL with the search query as a parameter
	const apiUrl = `https://api.rawg.io/api/games?key=a29e01702f3d4aa2a58af885563c92b7&search=${searchQuery}`;

	//fetches data from the API, converts the response to JSON and logs it to the console
	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			const games = data.results.slice(0, 5); // limit to first 5 games
			// clear the suggestion dropdown if the search query is empty
			if (searchQuery === '') {
				suggestionDropdown.innerHTML = '';
			} else {
				// create the suggestion list
				suggestionDropdown.innerHTML = '';
				const suggestionList = document.createElement('ul');
				games.forEach(game => {
					const suggestionItem = document.createElement('li');
					suggestionItem.innerText = game.name;
					suggestionItem.addEventListener('click', () => {
						searchInput.value = game.name; // fill out search input with suggestion text
						suggestionDropdown.innerHTML = ''; // clear suggestion dropdown
					});
					suggestionList.appendChild(suggestionItem);
				});
				suggestionDropdown.appendChild(suggestionList);
			}
		})
		//logs any errors in the console 
		.catch(error => console.error(error));
});
