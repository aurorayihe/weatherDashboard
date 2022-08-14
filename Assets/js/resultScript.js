var key = '29b085faf28fb60a90c2f948b7355273';
var searchBtnEl = document.querySelector("#search-btn");
var searchHistoryEl = document.querySelector("#search-history");
var currentDate = moment().format("M/D/YYYY");
var currentWeatherEl = document.querySelector("#current-weather");
var pastCiities = [];


// Get needed parameter from the location url
function getParams() {
    // Get the city name out of the URL
    var searchParamsArr = document.location.search.split('=');

    // Get the query value
    var queryCity = searchParamsArr[1];

    searchApi(queryCity);
}

// Fetch weather information from OpenWeather API
function searchApi(city) {
    let cityQueryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&appid=" + key + "&units=imperial";

    fetch(cityQueryUrl)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function(queryResult) {
            console.log(queryResult);
            let lon = queryResult.coord.lon;
            let lat = queryResult.coord.lat;
            printResults(queryResult, lon, lat);
        })
}

// Print city weather information to the page
function printResults(resultObj, lon, lat) {

    // set up '<div>' to hold current weather result
    var currentWeatherCard = document.createElement('div');
    currentWeatherCard.classList.add('currentWeather');
    
    var cityTitleEl = document.createElement('h3');
    cityTitleEl.textContent = resultObj.name +"  (" + currentDate + ")";

    var currentWeatherCondition = document.createElement('img');
    var iconUrl = "http://openweathermap.org/img/wn/"+ resultObj.weather[0].icon+ "@2x.png";
    currentWeatherCondition.src = iconUrl;

    var cityDataEl = document.createElement('ul');
    var cityTempEl = document.createElement('li');
    var cityWindEl = document.createElement('li');
    var cityHumidityEl = document.createElement('li');

    cityTempEl.textContent = "Temp: " + resultObj.main.temp + "°F";
    cityWindEl.textContent = "Wind: " + resultObj.wind.speed + " MPH";
    cityHumidityEl.textContent = "Humidity: " + resultObj.main.humidity + " %";

    cityDataEl.appendChild(cityTitleEl);
    cityDataEl.appendChild(currentWeatherCondition);
    cityDataEl.appendChild(cityTempEl);
    cityDataEl.appendChild(cityWindEl);
    cityDataEl.appendChild(cityHumidityEl);
    currentWeatherCard.appendChild(cityDataEl);
    currentWeatherEl.appendChild(currentWeatherCard);


    console.log(lat);
    console.log(lon);
    let cityQueryUrl = "https://api.openweathermap.org/data/3.0/onecall?lat="+lat+"&lon="+lon +"&appid=5960d9f090a8d1defe99ab125f2e8571"; 
    console.log(cityQueryUrl);
    fetch(cityQueryUrl)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
                console.log("Wrong!");
            }
            return response.json();
            console.log("correct");
        })
        .then(function(queryResult) {
            console.log(queryResult);
        })
    cityUVEl.textContent = "UV Index: ";
        var cityUVEl = document.createElement('li');
    var cityIndexEl = document.createElement('span');


}

// Search the city weather 
function searchCityWeather(event) {
    event.preventDefault();

    var cityName = document.querySelector('#search-input').value;
    if (!cityName) {
        console.log("You need a city name!");
        return;
    }
    searchApi(cityName);
}

searchBtnEl.addEventListener('click', searchCityWeather);

getParams();