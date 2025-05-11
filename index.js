/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from "./games.js";

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
  for (let game of games) {
    const gameCard = document.createElement("div");
    gameCard.classList.add("game-card");
    gameCard.innerHTML = `
            <img src="${game.img}" class="game-img" alt="${game.name}" />
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <p>Pledged: $${game.pledged.toLocaleString()}</p>
            <p>Goal: $${game.goal.toLocaleString()}</p>
            <p>Backers: ${game.backers.toLocaleString()}</p>
        `;
    gamesContainer.appendChild(gameCard);
  }
}

// call the function with GAMES_JSON to add all games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce(
  (acc, game) => acc + game.backers,
  0
);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

// use reduce() to sum the pledged amounts
const totalRaised = GAMES_JSON.reduce((acc, game) => acc + game.pledged, 0);

// set inner HTML using a template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `${GAMES_JSON.length}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have not yet met their goal
  const unfundedGames = GAMES_JSON.filter((game) => game.pledged < game.goal);

  // use the function we previously created to add the unfunded games to the DOM
  addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have met or exceeded their goal
  const fundedGames = GAMES_JSON.filter((game) => game.pledged >= game.goal);

  // use the function we previously created to add funded games to the DOM
  addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
  deleteChildElements(gamesContainer);

  // add all games from the JSON data to the DOM
  addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter to count the number of unfunded games
const unfundedCount = GAMES_JSON.filter(
  (game) => game.pledged < game.goal
).length;

// create a string that explains the number of unfunded games using the ternary operator
const descriptionString = `Sea Monster Crowdfunding has raised $${totalRaised.toLocaleString()} for ${
  GAMES_JSON.length
} games, with ${unfundedCount} ${
  unfundedCount === 1 ? "game" : "games"
} still needing funding.`;

// create a new DOM element containing the template string and append it to the description container
const descriptionParagraph = document.createElement("p");
descriptionParagraph.innerHTML = descriptionString;
descriptionContainer.appendChild(descriptionParagraph);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
  return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [topGame, secondGame, ...restGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const topGameElement = document.createElement("p");
topGameElement.textContent = topGame.name;
firstGameContainer.appendChild(topGameElement);

// do the same for the runner up item
const secondGameElement = document.createElement("p");
secondGameElement.textContent = secondGame.name;
secondGameContainer.appendChild(secondGameElement);

// Bonus Feature: Search bar
const searchInput = document.getElementById("search-input");

function filterBySearch() {
  deleteChildElements(gamesContainer);
  const query = searchInput.value.toLowerCase();
  const filteredGames = GAMES_JSON.filter((game) =>
    game.name.toLowerCase().includes(query)
  );
  addGamesToPage(filteredGames);
}

searchInput.addEventListener("input", filterBySearch);
