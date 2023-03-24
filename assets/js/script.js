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

let searchQuery = '';
const searchInput = document.getElementById('search_input');
const suggestionDropdown = document.getElementById('suggestions');
const ApiKey = ('a29e01702f3d4aa2a58af885563c92b7')
const cardTitle = document.querySelector('.card-title');
const cardImg = document.querySelector('#card_Img_0');
const cardGenre = document.querySelector('#genre_0')
const apiUrl = `https://api.rawg.io/api/games?key=${ApiKey}&page_size=3`






window.addEventListener('load', function () {
	const backgroundImage0 = document.getElementById('card_Img_0');
	const name0 = document.getElementById('card_title_0');
	const genre0 = document.getElementById('genre_0');
	const backgroundImage1 = document.getElementById('card_Img_1');
	const name1 = document.getElementById('card_title_1');
	const genre1 = document.getElementById('genre_1');
	const backgroundImage2 = document.getElementById('card_Img_2');
	const name2 = document.getElementById('card_title_2');
	const genre2 = document.getElementById('genre_2');
	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			const item0 = data.results[0];
			const itme0_genres = data.results[0].genres;
			const itme1_genres = data.results[1].genres;
			const itme2_genres = data.results[2].genres;
			backgroundImage0.src = item0.background_image;
			name0.innerText = item0.name;
			genre0.innerText = itme0_genres[0].name;
			const item1 = data.results[1];
			backgroundImage1.src = item1.background_image;
			name1.innerText = item1.name;
			genre1.innerText = itme1_genres[0].name;
			const item2 = data.results[2];
			backgroundImage2.src = item2.background_image;
			name2.innerText = item2.name;
			genre2.innerText = itme2_genres[0].name;
		})
		.catch(error => console.error(error));


});


//add an event listener to search input field
searchInput.addEventListener('input', () => {
	//gets the search query from the input field
	searchQuery = searchInput.value;

	//construct the API URL with the search query as a parameter
	const apiUrl = `https://api.rawg.io/api/games?key=${ApiKey}&search=${searchQuery}&page_size=5`;

	//fetches data from the API, converts the response to JSON
	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			const games = data.results;
			const filteredGames = games.filter(game => game.name.toLowerCase().includes(searchQuery.toLowerCase()));
			const gameImg = data.results[0].background_image;
			const gameGenre = data.results[0].genres[0].name;
			const centerRow = document.querySelector('#rows')
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
						const cardToRemove1 = document.querySelector('#card_1');
						if (cardToRemove1) {
							cardToRemove1.remove();
						}
						const cardToRemove2 = document.querySelector('#card_2');
						if (cardToRemove2) {
							cardToRemove2.remove();
						}
						searchInput.value = game.name; // fill out search input with suggestion text
						suggestionDropdown.innerHTML = ''; // clear suggestion dropdown
						cardTitle.innerHTML = game.name; // update the card title with the selected game name
						cardImg.setAttribute('src', gameImg); //updates the picture
						cardGenre.innerHTML = gameGenre; // updates the genre
						centerRow.style.justifyContent = "center";

					});
					suggestionList.appendChild(suggestionItem); //adds items to list
				});
				suggestionDropdown.appendChild(suggestionList); //adds list to sugestion drop down
			}
			console.log(filteredGames);
			console.log(gameImg);
		})
		//logs any errors in the console 
		.catch(error => console.error(error));


});
