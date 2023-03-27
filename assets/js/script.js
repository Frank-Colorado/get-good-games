const apiKey = 'a29e01702f3d4aa2a58af885563c92b7';
const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4`;

function fillCards() {
	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			const gameTitles = [];
			const genres = [];
			const backgroundImages = [];
			const usedTitles = [];
			let i = 0;

			while (gameTitles.length < 3) {
				const randomIndex = Math.floor(Math.random() * data.results.length);
				const gameTitle = data.results[randomIndex].name;

				if (!usedTitles.includes(gameTitle)) {
					usedTitles.push(gameTitle);
					gameTitles.push(gameTitle);
					const genre = data.results[randomIndex].genres[0].name;
					genres.push(genre);
					const backgroundImage = data.results[randomIndex].background_image;
					backgroundImages.push(backgroundImage);

					// Fill in the card data
					const cardTitleElement = document.getElementById(`card_title_${i}`);
					cardTitleElement.innerHTML = gameTitle;

					const genreElement = document.getElementById(`genre_${i}`);
					genreElement.innerHTML = genre;

					const cardImgElement = document.getElementById(`card_Img_${i}`);
					cardImgElement.src = backgroundImage;

					i++;
				}
			}
		});
}


fillCards(apiUrl);



// fetches RAWG data based on the Top rated
function displayPopular() {
	const apiUrlRated = `${apiUrl}&ordering=-metacritic&dates=2022-01-01,2023-01-01`;
	fetch(apiUrlRated)
		.then(response => response.json())
		.then(data => {
			const gameTitles = [];
			const genres = [];
			const backgroundImages = [];
			const usedTitles = [];
			let i = 0;

			while (gameTitles.length < 3) {
				const randomIndex = Math.floor(Math.random() * data.results.length);
				const gameTitle = data.results[randomIndex].name;

				if (!usedTitles.includes(gameTitle)) {
					usedTitles.push(gameTitle);
					gameTitles.push(gameTitle);
					const genre = data.results[randomIndex].genres[0].name;
					genres.push(genre);
					const backgroundImage = data.results[randomIndex].background_image;
					backgroundImages.push(backgroundImage);

					// Fill in the card data
					const cardTitleElement = document.getElementById(`card_title_${i}`);
					cardTitleElement.innerHTML = gameTitle;

					const genreElement = document.getElementById(`genre_${i}`);
					genreElement.innerHTML = genre;

					const cardImgElement = document.getElementById(`card_Img_${i}`);
					cardImgElement.src = backgroundImage;

					i++;
				}
			}

			// Unhide card_1 and card_2
			const card1 = document.getElementById('card_1');
			if (card1) {
				card1.style.display = 'block';
			}
			const card2 = document.getElementById('card_2');
			if (card2) {
				card2.style.display = 'block';
			}
		});
}


// fetches RAWG data based on the selcted genre	
function displayGenreData(genreName) {
	const apiUrlGenre = `${apiUrl}&genres=${genreName}`;
	fetch(apiUrlGenre)
		.then(response => response.json())
		.then(data => {
			const gameTitles = [];
			const genres = [];
			const backgroundImages = [];
			const usedTitles = [];
			let i = 0;

			while (gameTitles.length < 3) {
				const randomIndex = Math.floor(Math.random() * data.results.length);
				const gameTitle = data.results[randomIndex].name;

				if (!usedTitles.includes(gameTitle)) {
					usedTitles.push(gameTitle);
					gameTitles.push(gameTitle);
					const genre = data.results[randomIndex].genres[0].name;
					genres.push(genre);
					const backgroundImage = data.results[randomIndex].background_image;
					backgroundImages.push(backgroundImage);

					// Fill in the card data
					const cardTitleElement = document.getElementById(`card_title_${i}`);
					cardTitleElement.innerHTML = gameTitle;

					const genreElement = document.getElementById(`genre_${i}`);
					genreElement.innerHTML = genre;

					const cardImgElement = document.getElementById(`card_Img_${i}`);
					cardImgElement.src = backgroundImage;
					i++;
				}
				// Unhide card_1 and card_2
				const card1 = document.getElementById('card_1');
				if (card1) {
					card1.style.display = 'block';
				}
				const card2 = document.getElementById('card_2');
				if (card2) {
					card2.style.display = 'block';
				}
			}

		});

}

const searchInput = document.getElementById('search_input');
const suggestions = document.getElementById('suggestions');

function handleSuggestionClick(event) {
	const suggestionText = event.target.innerText;
	console.log(`You clicked on suggestion: ${suggestionText}`);

	// Clear the suggestions div
	suggestions.innerHTML = '';

	// Clear the search input
	searchInput.value = '';

	// Fetch search result data
	const query = suggestionText;
	const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${query}&platforms=4`;
	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			// Populate the first card with the search result data
			populateFirstCard(data);
		})
		.catch(error => {
			console.error(error);
		});
}

searchInput.addEventListener('input', () => {
	const query = searchInput.value;
	const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${query}&platforms=4`;

	if (query === '') {
		suggestions.innerHTML = '';
		return;
	}

	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			console.log(data);

			suggestions.innerHTML = '';

			// Loop through the results and display up to 5 suggestions
			for (let i = 0; i < Math.min(data.results.length, 5); i++) {
				const result = data.results[i];
				const suggestion = document.createElement('div');
				suggestion.classList.add('suggestion');
				suggestion.innerHTML = result.name;
				suggestion.addEventListener('click', handleSuggestionClick);
				suggestions.appendChild(suggestion);
			}
		})
		.catch(error => {
			console.error(error);
		});
});

function populateFirstCard(data) {
	const gameTitle = data.results[0].name;
	const genre = data.results[0].genres[0].name;
	const backgroundImage = data.results[0].background_image;

	// Hide card_1 and card_2 if they exist
	const card1 = document.getElementById('card_1');
	if (card1) {
		card1.style.display = 'none';
	}
	const card2 = document.getElementById('card_2');
	if (card2) {
		card2.style.display = 'none';
	}

	// Fill in the card data
	const cardTitleElement = document.getElementById('card_title_0');
	cardTitleElement.innerHTML = gameTitle;

	const genreElement = document.getElementById('genre_0');
	genreElement.innerHTML = genre;

	const cardImgElement = document.getElementById('card_Img_0');
	cardImgElement.src = backgroundImage;

	const centerRow = document.getElementById('card_row');
	centerRow.style.justifyContent = 'center';
}