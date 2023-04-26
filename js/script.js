//*-------------------------------------- Selecting the element from DOM --------------------
let searchBar = document.getElementById("search-bar");
let searchResults = document.getElementById("search-results");

// Adding eventListener to search bar
searchBar.addEventListener("input", () => searchHeros(searchBar.value));


async function searchHeros(textSearched) {

    let PUBLIC_KEY = "ad5e51c27bbb0a2dde347af8c006720f";
    let PRIVATE_KEY = "d964140bf3a5424ba8fc867be24a3413a4279e99";

    let ts = new Date().getTime();
    let hash = CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();
    console.log(`hash key = ${hash}`); //9dd1787d12a73b583bfacdfe70955001


    // API call to get the data 
    await fetch(`https://gateway.marvel.com/v1/public/characters?ts=1&apikey=${PUBLIC_KEY}&hash=9dd1787d12a73b583bfacdfe70955001&nameStartsWith=${textSearched}`)
        .then(res => res.json()) //Converting the data into JSON format
        .then(data => showSearchedResults(data.data.results)) //sending the searched results characters to show in HTML
}

// function to display the results/ superheros
function showSearchedResults(searchedHero) {
    // IDs of the character which are added in the favourites 
    // Used for displaying the appropriate button in search results i.e
    // if the id exist in this array then we display "Remove from favourites" button otherwise we display "Add to favourites button"
    // favouritesCharacterIDs is a map which contains id of character as key and true as value 
    let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
    if (favouritesCharacterIDs == null) {
        // If we did't got the favouritesCharacterIDs then we iniitalize it with empty map
        favouritesCharacterIDs = new Map();
    }
    else if (favouritesCharacterIDs != null) {
        // If the we got the favouritesCharacterIDs in localStorage then parsing it and converting it to map
        favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
    }

    searchResults.innerHTML = ``;
    // count is used to count the result displayed in DOM
    let count = 1;

    // iterating the searchedHero array using for loop
    for (const key in searchedHero) {
        // if count <= 5 then only we display it in dom other results are discarded
        if (count <= 5) {
            // getting the single hero 
            // hero is the object that we get from API
            let hero = searchedHero[key];
            // Appending the element into DOM
            searchResults.innerHTML +=
                `
              <li class="flex-row single-search-result">
                   <div class="flex-row img-info">
                        <img src="${hero.thumbnail.path + '/portrait_medium.' + hero.thumbnail.extension}" alt="">
                        <div class="hero-info">
                             <a class="character-info" href="./more-info.html">
                                  <span class="hero-name">${hero.name}</span>
                             </a>
                        </div>
                   </div>
                   <div class="flex-col buttons">
                        <!-- <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button> -->
                        <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${hero.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites" : "<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}
                   </div>
                   <div style="display:none;">
                        <span>${hero.name}</span>
                        <span>${hero.description}</span>
                        <span>${hero.comics.available}</span>
                        <span>${hero.series.available}</span>
                        <span>${hero.stories.available}</span>
                        <span>${hero.thumbnail.path + '/portrait_uncanny.' + hero.thumbnail.extension}</span>
                        <span>${hero.id}</span>
                        <span>${hero.thumbnail.path + '/landscape_incredible.' + hero.thumbnail.extension}</span>
                        <span>${hero.thumbnail.path + '/standard_fantastic.' + hero.thumbnail.extension}</span>
                   </div>
              </li>
              `
        }
        count++;
    }
    // Adding the appropritate events to the buttons after they are inserted in dom
    events();
}

// Function for attacthing eventListener to buttons
function events() {
    let favouriteButton = document.querySelectorAll(".add-to-fav-btn");
    favouriteButton.forEach((btn) => btn.addEventListener("click", addToFavourites));

    let characterInfo = document.querySelectorAll(".character-info");
    characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage))
}