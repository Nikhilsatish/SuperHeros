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
    .then(data => console.log(data.data.results)) 
}