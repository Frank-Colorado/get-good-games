// API VARIABLES
const apiKey = "a29e01702f3d4aa2a58af885563c92b7";
const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4`;
// SEARCH BAR VARIABLES
const searchInput = document.getElementById("search_input");
const suggestionsList = document.getElementById("suggestions");
// MAIN CONTENT VARIABLES
const cardsDiv = document.getElementById("gameCards");

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

// game.name, game.background_image, game.esrb_rating.name, game.genres[0].name,

// This is a function called 'createCards'
const createCards = (data) => {
  cardsDiv.innerHTML = "";
  data.forEach((game) => {
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
    `;
    cardsDiv.appendChild(gameCard);
  });
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
    newSuggestion.id = suggestion.name;
    newSuggestion.innerHTML = suggestion.name;
    newSuggestion.className = "suggestionItem";
    suggestionsList.appendChild(newSuggestion);
  });
};

// This is an asynchronous function that is called when an input event happens to 'searchInput'
searchInput.addEventListener("input", async () => {
  const query = `&search=${searchInput.value}`;
  const data = await callRawgAPI(query);
  createSuggestionsDisplay(data.results);
});

// This is a function that is called when an element with the class 'suggestionItem' is clicked on
document.addEventListener("click", async (e) => {
  if ((target = e.target.closest(".suggestionItem"))) {
    const query = `&search=${target.id}`;
    const data = await callRawgAPI(query);
    console.log(data);
  } else if ((target = e.target.closest(".genreTab"))) {
    const query = `&genres=${target.id}`;
    const data = await callRawgAPI(query);
    createCards(data);
  } else {
    console.log("nothing clicked");
  }
});

// This is a function called 'onLoad'
// It has 0 parameters
// It will load popular games into the cards on window load
// This function will also be called when clicking on the 'popular' tab
const onLoad = async () => {
  const data = await callRawgAPI("&metacritic=100");
  createCards(data);
};

window.load(onLoad());
