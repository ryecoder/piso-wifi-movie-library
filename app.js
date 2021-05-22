// disclaimer: movies are from soap2day.is
const apiUrl = 'movielibrary.json';
//const apiUrl = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1';
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

// Calling the api.
showMovies(apiUrl);
// Fetching data from the api then looping over each item to create html elements that store our movies.
function showMovies(url){
    fetch(url).then(res => res.json())
    .then(function(data){
        data.results.forEach(element => {
            // Creating elements for each movie.
            createElement(element);
        }); 
    });
}

// Searching for movies using a search api by calling the showMovies function.
form.addEventListener("submit", (e) => {
    e.preventDefault();
    main.innerHTML = '';
     
    const searchTerm = search.value;
    
    if (searchTerm) {
        searchMovies(apiUrl,searchTerm);
    } else {
        showMovies(apiUrl);
    }
});

// function to search movies in the static page itself.
// will only show movies available in my list
function searchMovies(url,searchTerm){
    fetch(url).then(res => res.json())
    .then(function(data){

        // add to seperate object
        var relatedMovies = [];
        data.results.forEach(element => {

            lowerCaseTitle = element.title.toLowerCase();
            lowerCaseSearchTerm = searchTerm.toLowerCase();

            if(lowerCaseTitle.indexOf(lowerCaseSearchTerm) > -1){
                relatedMovies.push(element)
            }
        });

        // create element for all the item in the separate obj
        relatedMovies.forEach(element => {
            // Creating elements for each movie.
            createElement(element);
        })
        
    });
}

function createElement(element){
// Creating elements for each movie.
        const el = document.createElement('div');
        const image = document.createElement('img');
        const a = document.createElement('a');
        const text = document.createElement('h2');
        text.innerHTML = element.title;
        image.src = IMGPATH + element.poster_path;
        a.href = element.movie_link;
        a.target = "_blank"
        // Appending childs.
        a.appendChild(image);
        // el.appendChild(image);
        el.appendChild(a);
        el.appendChild(text);
        main.appendChild(el);
}

