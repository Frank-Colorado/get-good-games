// API VARIABLES
const apiKey = "a29e01702f3d4aa2a58af885563c92b7";
const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4`;
// SEARCH BAR VARIABLES
const searchInput = document.getElementById("search_input");
const suggestionsList = document.getElementById("suggestions");
// MAIN CONTENT VARIABLES
const cardsDiv = document.getElementById("gameCards");
const mainHeader = document.getElementById("mainHeader");
// MODAL VARIABLES
const modal = document.getElementById("myModal");
const modalContainer = document.getElementById("modalContainer");
const modalTitle = document.getElementById("modalHeader");

// -----FETCH API FUNCTIONS -----
//
// This is an asynchronous function called 'callRawgApi'
// It has 1 parameter called 'queryParam'
// This function will fetch all game data we need from the RAWG API
const callRawgAPI = async (queryParam) => {
  // A try...catch block is used to catch any error
  try {
    // fetch is passed the 'queryParam' paramater
    // The await keyword is used in order to wait for a response from fetch
    // Once a response is recieved, the value is stored in the 'response' variable
    const response = await fetch(`${apiUrl}${queryParam}`);
    // Using an if statement, we check to see if the response is ok
    // if its not, then we throw a new Error
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Otherwise, the response is then changed to json format
    // once finished, the value is stored in the 'data' variable
    const data = await response.json();
    // the results key from the data is then returned
    return data.results;
  } catch (error) {
    console.error(error);
  }
};

// This is an asynchronous function called 'callCheapSharkAPI'
// It has 1 parameter called 'title'
// This function will fetch all deal data for the game title we give it from the CheapShark API
const callCheapSharkAPI = async (title) => {
  // The game title is encoded using 'encodeURIComponent' so that we can fetch data from CheapShark properly
  // This documentation about encodeURIComponent was used as a reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  const encodedGameTitle = encodeURIComponent(title);
  // The URL that will be fetched is created
  const URL = `https://www.cheapshark.com/api/1.0/games?title=${encodedGameTitle}&exact=0&limit=1`;
  try {
    // fetch is passed the 'URL' variable
    const response = await fetch(URL);
    // If the response is not ok
    if (!response.ok) {
      // A new error is thrown
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Otherwise, the response is changed to json format
    // and stored in the 'data' variable
    const data = await response.json();
    // The data is then returned
    return data;
  } catch (error) {
    console.error(error);
  }
};
// ------CREATE DISPLAY FUNCTIONS ------
//
// This is a function called 'createCardsDisplay'
// It has 1 parameter called 'data'
// This function will be called once RAWG API has fetched the data we need to create the display for the cards
const createCardsDisplay = async (data) => {
  // Any previous content in the Cards DIV is reset with ""
  mainHeader.innerText = "Here's whats good...";
  cardsDiv.innerHTML = "";
  // The '.forEach()' method is called on the data we received
  // For each game of the data
  data.forEach((game) => {
    // A 'div' is created and called 'gameCard'
    const gameCard = document.createElement("div");
    // These classes are added to the game card
    gameCard.classList.add("col-lg-4", "col-md-12", "mb-6");
    // The inner HTML of this card is then set using template literals
    // We set the card's image, game name, game genre, and create a button we will use to get the game's deals with.
    gameCard.innerHTML = `
<div class="card">
<div
  class="bg-image hover-overlay ripple"
  data-mdb-ripple-color="light"
>
  <img src= ${game.background_image} class="img-fluid" />
</div>
<div class="card-body black-font">
  <i id='likeBtn' class="fa-solid fa-heart fa-lg like-icon d-flex justify-content-end" data-id="${game.name}"></i>
  <h4 id="card_title_0" class="card-title">${game.name}</h4>

  <p class="card-text">
    Genre: ${game.genres[0].name}
  </p>

  <button
  type="button"
  id="dealButton"
  class="btn btn-primary bg-red modal-button"
  data-id="${game.name}"
  >
  Get Deal!
  </button>
    </div>
  </div>
  </div>

`;
    // The game card is appended to the 'cardsDiv'
    cardsDiv.appendChild(gameCard);
  });
};

// This is a function called 'createSuggestionsDisplay'
// It has 1 parameter called 'data'
// This function will be called when any input is passed into the search bar
const createSuggestionsDisplay = (data) => {
  // Any previous suggestions are cleared
  suggestionsList.innerHTML = "";
  // The '.slice()' method is used on the data array given
  // This creates an array of only the first 5 items of the data
  // A new array called 'suggestions' is created out of these 5 items
  const suggestions = data.slice(0, 5);
  // The '.forEach()' method is used on 'suggestions'
  // For each suggestion
  suggestions.forEach((suggestion) => {
    // A new list element is created
    const newSuggestion = document.createElement("li");
    // A 'data-id' attribute is created and set to the name of the suggestion
    // This is so when the list item is clicked on, the data for that game can be fetched
    newSuggestion.setAttribute("data-id", suggestion.name);
    newSuggestion.innerHTML = suggestion.name;
    newSuggestion.id = "suggestionItem";
    // The list item is appended to the list
    suggestionsList.appendChild(newSuggestion);
  });
};

// This is a function called 'setDealsDisplay'
// It has 1 parameter called 'deal'
// This function will be called when any 'get deals' button is clicked on a game card
const setDealsDisplay = (deal) => {
  // Any content in the modal is cleared
  modalContainer.innerHTML = "";
  // If the game clicked has a deal for it
  if (deal.length > 0) {
    // Then the title of the modal is set
    modalTitle.innerHTML = `
    <h2> HERE'S YOUR DEAL FOR ${deal[0].external.toUpperCase()} </h2>
    <i class="fa-solid fa-face-laugh-beam fa-2xl" id="search_icon"></i>
    `;
    // A div is created called 'modalBody'
    const modalBody = document.createElement("div");
    // These classes are added to the div
    modalBody.classList.add("myModal-body", "py-5");
    // The inner HTML of the modal body is then set using template literals
    modalBody.innerHTML = `
    <p> Cheapest Deal: $<span id="dealPrice">${deal[0].cheapest}</span></p>
    <p>
    <a id="dealLink" href="https://www.cheapshark.com/redirect?dealID=${deal[0].cheapestDealID}" target="_blank" class="red"> VIEW DEAL </a>
    </p>
    `;
    // The div is then appended to the 'modalContainer'
    modalContainer.appendChild(modalBody);
    // The modal is then revealed by removing display: none
    modal.classList.remove("d-none");
  } else {
    // If there isn't a deal for the game clicked
    // The modals content is set to let the user know there aren't any deals
    modalTitle.innerText = "SORRY THERE'S NO DEALS";
    modalTitle.innerHTML = `
      <h2 class='pb-5'> SORRY THERE'S NO DEALS </h2>
      <i class="fa-solid fa-face-frown fa-2xl" id="search_icon"></i>`;
    modal.classList.remove("d-none");
  }
};

// ----- LOCAL STORAGE FUNCTIONS -----
//
// This is a function called 'getFavoriteGameData'
// It has 1 parameter called 'games'
// This function will be called by the 'setFavoriteGames' function
const getFavoriteGameData = (games) => {
  // The '.map()' method is used on the games array
  // Each game is sent to 'callRawgAPI' to get their data
  // Promises.all is used so to wait for all games and their data to be fetched and returned
  // The array created is then returned
  return Promise.all(games.map((game) => callRawgAPI(`&search=${game}`)));
};

// This is an asynchronous function called 'getFavoriteGameData'
// It has 0 parameters
// This function will be called when the Favorites tab on the DOM is clicked
const setFavoriteGames = async () => {
  // The item 'favoriteGames' is grabbed from local storage
  const favoriteGames = JSON.parse(localStorage.getItem("favoriteGames"));
  // If this item doesn't exist
  if (favoriteGames === null) {
    // Then the user is notified that they haven't liked any games yet
    mainHeader.innerText = "You haven't liked any games yet!";
    cardsDiv.innerHTML = "";
  } else {
    // Otherwise, the favorite games are passed to 'getFavoriteGameData'
    // We wait for the data to be returned and then set it under a variable called 'favoritesData'
    const favoritesData = await getFavoriteGameData(favoriteGames);
    // The '.map()' method is used to go through all the 0 index items in 'favoritesData'
    // A new array is created called 'favorites'
    const favorites = favoritesData.map((favorite) => favorite[0]);
    // These favorite games are then passed to 'createCardsDisplay' to show them on the DOM
    createCardsDisplay(favorites);
  }
};

// This is a function called 'saveLikedGame'
// It has 2 parameters called 'game' and 'favoriteGames'
// This function will be called when the like button for any game is clicked
const saveLikedGame = (game, favoriteGames) => {
  // If the game liked DOESN'T already existes in our favorited games
  if (!favoriteGames.includes(game)) {
    // then the game is added to our favorites
    favoriteGames.push(game);
  }
  // If our list of favorite games is longer than 9 games
  if (favoriteGames.length > 9) {
    // Then the oldest game in the list is removed
    favoriteGames.shift();
  }
  // Our favorite games is sent to local storage and updated
  localStorage.setItem("favoriteGames", JSON.stringify(favoriteGames));
};

// ----- EVENT LISTENER FUNCTIONS -----
// This is an asynchronous function that is called when an input occurs in the search field
searchInput.addEventListener("input", async () => {
  // The value of inputed into the search bar is grabbed and used to create a query
  const query = `&search=${searchInput.value}`;
  // The query is then given to 'callRawgAPI' to a list of games that matches the user's input
  // We wait for the response and then create the variable 'data' with it
  const data = await callRawgAPI(query);
  // The data returned is then sent to 'createSuggestionsDisplay' to update the DOM
  createSuggestionsDisplay(data);
  // If the search bar is empty
  if (searchInput.value === "") {
    // Then the list of suggestions is cleared
    suggestionsList.innerHTML = "";
  }
});

// This is an asynchronous function that is called when the DOM is clicked on
// It has 1 parameter called 'e'
document.onclick = async (e) => {
  // The id of the DOM element clicked on tells us what the target is
  const target = e.target.id;
  // The value for the attribute 'data-id' is retrieved from the target clicked
  const id = e.target.getAttribute("data-id");
  // A switch statement is used to handle the many clickable elements on the DOM
  // If the target clicked on is...
  switch (target) {
    // An item in the suggestions dropdown with the id of 'suggestionItem'
    case "suggestionItem":
      // Then a query using the data-id of the target is created
      const searchQuery = `&search=${id}`;
      // The query is then sent to 'callRawgAPI' to fetch data on the game suggested
      const searchData = await callRawgAPI(searchQuery);
      // Game cards are then created from the data returned using 'createCardsDisplay'
      createCardsDisplay(searchData);
      // The search bar and its suggestions are then cleared
      searchInput.value = "";
      suggestionsList.innerHTML = "";
      break;
    // An tab in the genres sidbar with the id of 'genreTab'
    case "genreTab":
      // Then a query using the data-id of genre tab clicked is created
      const genreQuery = `&genres=${id}`;
      // The query is then sent to 'callRawgAPI' tp fetch data for the genre clicked
      const genreData = await callRawgAPI(genreQuery);
      // Game cards are then created from the data returned using 'createCardsDisplay'
      createCardsDisplay(genreData);
      break;
    // The get deals button with the id of 'dealButton'
    case "dealButton":
      // Then data-id for the game clicked on is sent to the 'callCheapSharkAPI' function
      const dealData = await callCheapSharkAPI(id);
      // The deal data returned is then sent to the 'setDealsDisplay' function to show the modal with the game's deal
      setDealsDisplay(dealData);
      break;
    // The like button on a game card is clicked with the id of 'likeBtn'
    case "likeBtn":
      // The like button is lit up by adding the class 'red'
      e.target.classList.add("red");
      // The 'favoriteGames' item is retrieved from local storage
      // If this item doesn't exist then an empty array is created
      const favoriteGames =
        JSON.parse(localStorage.getItem("favoriteGames")) || [];
      // The 'saveLikedGame' function is called and passed the data-id of the game liked and the list of favorited games
      saveLikedGame(id, favoriteGames);
      break;
    // The x button of the modal is clicked with the id of 'closeBtn'
    case "closeBtn":
      // The modal is hidden by adding 'display: none'
      modal.classList.add("d-none");
      break;
  }
};

// This is a function that will be called when the window object is clicked
window.onclick = (e) => {
  // If the target clicked is NOT the modal
  if (e.target == modal) {
    // Then the modal is hidded by adding 'display:none'
    modal.classList.add("d-none");
  }
};

// This is a function called 'onLoad'
// It has 0 parameters
// It will load popular games into the cards on window load
// This function will also be called when clicking on the 'popular' tab
const loadPopular = async () => {
  // The 'callRawgAPI' function is passsed a query
  const data = await callRawgAPI("&metacritic=100");
  // The game data returned is then sent to the 'createCardsDisplay'
  createCardsDisplay(data);
};

// This is a function that will be called when the window object is loaded
window.onload = () => {
  // The popular games in Rawg's game library will be loaded on the DOM
  loadPopular();
};
