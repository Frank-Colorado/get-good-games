// API VARIABLES
const apiKey = "a29e01702f3d4aa2a58af885563c92b7";
const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4`;
// SEARCH BAR VARIABLES
const searchInput = document.getElementById("search_input");
const suggestionsList = document.getElementById("suggestions");
// MAIN CONTENT VARIABLES
const cardsDiv = document.getElementById("gameCards");
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

// This is an asynchronous function that is called when an input event happens to 'searchInput'
searchInput.addEventListener("input", async () => {
  const query = `&search=${searchInput.value}`;
  const data = await callRawgAPI(query);
  createSuggestionsDisplay(data);
});

// This is a function that is called when an element with the class 'suggestionItem' is clicked on
document.addEventListener("click", async (e) => {
  const target = e.target.id;
  const id = e.target.getAttribute("data-id");
  console.log(target);
  console.log(id);
  switch (target) {
    case "suggestionItem":
      const searchQuery = `&search=${id}`;
      const searchData = await callRawgAPI(searchQuery);
      createCards(searchData);
      break;
    case "genreTab":
      const genreQuery = `&genres=${id}`;
      const genreData = await callRawgAPI(genreQuery);
      createCards(genreData);
      break;
    case "dealButton":
      const dealData = await callCheapSharkAPI(id);
      setDeals(dealData);
    default:
      console.log("nothing clicked");
  }
});
const setDeals = (deal) => {
  modalContainer.innerHTML = "";
  if (deal.length > 0) {
    modalTitle.innerText = `HERE'S YOUR DEAL FOR ${deal[0].external.toUpperCase()}`;
    const modalBody = document.createElement("div");
    modalBody.classList.add("myModal-body");
    modalBody.innerHTML = `
    <p> Cheapest Deal: $<span id="dealPrice">${deal[0].cheapest}</span></p>
    <p>
      <a id="dealLink" href="https://www.cheapshark.com/redirect?dealID=${deal[0].cheapestDealID}" target="_blank"> VIEW DEAL </a>
    </p>
    `;
    modalContainer.appendChild(modalBody);
    modal.classList.remove("d-none");
  } else {
    modalTitle.innerText = "SORRY THERE'S NO DEALS :(";
    modal.classList.remove("d-none");
  }
};

// This is a function called 'onLoad'
// It has 0 parameters
// It will load popular games into the cards on window load
// This function will also be called when clicking on the 'popular' tab
const onLoad = async () => {
  const data = await callRawgAPI("&metacritic=100");
  createCards(data);
};

window.onload = () => {
  onLoad();
};

//const deal = await callCheapSharkAPI(game.name);
