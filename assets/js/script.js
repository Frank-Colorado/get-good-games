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
const dealPrice = document.getElementById("dealPrice");
const dealLink = document.getElementById("dealLink");

// This is an asynchronous function called 'callRawgApi'
const callRawgAPI = async (queryParam) => {
  try {
    const response = await fetch(`${apiUrl}${queryParam}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
  }
};

// This is an asynchronous function called 'callRawgApi'
const callCheapSharkAPI = async (title) => {
  const encodedGameTitle = encodeURIComponent(title);
  const URL = `https://www.cheapshark.com/api/1.0/games?title=${encodedGameTitle}&exact=0&limit=1`;
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// This is a function called 'createCards'
const createCards = async (data) => {
  mainHeader.innerText = "Here's whats good...";
  cardsDiv.innerHTML = "";
  for (const game of data) {
    const gameCard = document.createElement("div");
    gameCard.classList.add("col-lg-4", "col-md-12", "mb-6");
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
    cardsDiv.appendChild(gameCard);
  }
};

// This is a function called 'createSuggestionsDisplay'
const createSuggestionsDisplay = (data) => {
  // clear suggestions list
  suggestionsList.innerHTML = "";
  // create list of 5 suggestions
  const suggestions = data.slice(0, 5);
  // create list item
  suggestions.forEach((suggestion) => {
    const newSuggestion = document.createElement("li");
    newSuggestion.setAttribute("data-id", suggestion.name);
    newSuggestion.innerHTML = suggestion.name;
    newSuggestion.id = "suggestionItem";
    suggestionsList.appendChild(newSuggestion);
  });
};

// This is a function called 'setDeals'
const setDeals = (deal) => {
  modalContainer.innerHTML = "";
  if (deal.length > 0) {
    modalTitle.innerHTML = `
    <h2> HERE'S YOUR DEAL FOR ${deal[0].external.toUpperCase()} </h2>
    <i class="fa-solid fa-face-laugh-beam fa-2xl" id="search_icon"></i>
    `;
    const modalBody = document.createElement("div");
    modalBody.classList.add("myModal-body", "py-5");
    modalBody.innerHTML = `
    <p> Cheapest Deal: $<span id="dealPrice">${deal[0].cheapest}</span></p>
    <p>
    <a id="dealLink" href="https://www.cheapshark.com/redirect?dealID=${deal[0].cheapestDealID}" target="_blank" class="red"> VIEW DEAL </a>
    </p>
    `;
    modalContainer.appendChild(modalBody);
    modal.classList.remove("d-none");
  } else {
    modalTitle.innerText = "SORRY THERE'S NO DEALS";
    modalTitle.innerHTML = `
      <h2 class='pb-5'> SORRY THERE'S NO DEALS </h2>
      <i class="fa-solid fa-face-frown fa-2xl" id="search_icon"></i>`;
    modal.classList.remove("d-none");
  }
};

const getFavoriteGameData = (games) => {
  return Promise.all(games.map((game) => callRawgAPI(`&search=${game}`)));
};

const setFavoriteGames = async () => {
  // This function will be called when the favorites tab is clicked
  const favoriteGames = JSON.parse(localStorage.getItem("favoriteGames"));
  if (favoriteGames === null) {
    mainHeader.innerText = "You haven't liked any games yet!";
    cardsDiv.innerHTML = "";
  } else {
    const favoritesData = await getFavoriteGameData(favoriteGames);
    const favorites = favoritesData.map((favorite) => favorite[0]);
    createCards(favorites);
  }
};

// This is an async function called 'saveLikedGame'
const saveLikedGame = (game, favoriteGames) => {
  if (!favoriteGames.includes(game)) {
    favoriteGames.push(game);
  }
  if (favoriteGames.length > 10) {
    favoriteGames.shift();
  }
  localStorage.setItem("favoriteGames", JSON.stringify(favoriteGames));
};
// This is an asynchronous function that is called when an input event happens to 'searchInput'
searchInput.addEventListener("input", async () => {
  const query = `&search=${searchInput.value}`;
  const data = await callRawgAPI(query);
  createSuggestionsDisplay(data);
  if (searchInput.value === "") {
    suggestionsList.innerHTML = "";
  }
});

// This is a function that is called when an element with the class 'suggestionItem' is clicked on
document.onclick = async (e) => {
  const target = e.target.id;
  const id = e.target.getAttribute("data-id");
  switch (target) {
    case "suggestionItem":
      const searchQuery = `&search=${id}`;
      const searchData = await callRawgAPI(searchQuery);
      createCards(searchData);
      searchInput.value = "";
      suggestionsList.innerHTML = "";
      break;
    case "genreTab":
      const genreQuery = `&genres=${id}`;
      const genreData = await callRawgAPI(genreQuery);
      createCards(genreData);
      break;
    case "dealButton":
      const dealData = await callCheapSharkAPI(id);
      setDeals(dealData);
      break;
    case "likeBtn":
      e.target.classList.toggle("red");
      const favoriteGames =
        JSON.parse(localStorage.getItem("favoriteGames")) || [];
      saveLikedGame(id, favoriteGames);
      break;
  }
};

// This is a function that will be called when the window object is clicked
window.onclick = (e) => {
  if (e.target == modal) {
    modal.classList.add("d-none");
  }
};

// This is a function called 'onLoad'
// It has 0 parameters
// It will load popular games into the cards on window load
// This function will also be called when clicking on the 'popular' tab
const loadPopular = async () => {
  const data = await callRawgAPI("&metacritic=100");
  createCards(data);
};

// This is a function that will be called when the window object is loaded
window.onload = () => {
  loadPopular();
};
