// disclaimer: movies are from soap2day.is
const apiUrl = 'movielibrary.json';
//const apiUrl = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1';
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const ALLOWED_LONG = '121.0302064';
const ALLOWED_LAT = '14.344605099999999';
const NO_ACCESS_MESSAGE = 'Too far away from RYAN_PISOWIFI.';
var allowAccess = false;


// geolocation checking
getLocation();
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(calculatePosition);
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
  }

function calculatePosition(position){

    var long = position.coords.longitude;
    var lat = position.coords.latitude;

    if(distance(long, lat, ALLOWED_LONG, ALLOWED_LAT) < 100){
        allowAccess = true;
    };
    startWebPage();
}


// Calling the api.
function startWebPage(){
    if (allowAccess){
        showMovies(apiUrl);
    } else {
        showErrorLocation();
    }
}

// shows error location message
function showErrorLocation(){
    const main = document.getElementById('main');
    const h2 = document.createElement('h2');
    h2.innerHTML = NO_ACCESS_MESSAGE;
    h2.className = "error";
    main.appendChild(h2);
}


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
    
    if(allowAccess){
        if (searchTerm) {
            searchMovies(apiUrl,searchTerm);
        } else {
            showMovies(apiUrl);
        }
    } else {
        showErrorLocation();
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

// https://stackoverflow.com/questions/13840516/how-to-find-my-distance-to-a-known-location-in-javascript


function distance(lat1, lon1, lat2, lon2) {
    //Radius of the earth in:  1.609344 miles,  6371 km  | var R = (6371 / 1.609344);
    var R = 3958.7558657440545; // Radius of earth in Miles 
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}
  


