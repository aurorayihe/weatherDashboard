var key = '5960d9f090a8d1defe99ab125f2e8571';
var searchBtnEl = document.querySelector("#search-btn");
var searchHistoryEl = document.querySelector("#search-history");
var currentDate = moment().format("M/D/YYYY");
var currentWeatherEl = document.querySelector("#current-weather");
var futureWeatherEl = document.querySelector("#future-weather");
var futureWeatherTitleEl = document.querySelector("#forecast");


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
            let lon = queryResult.coord.lon;
            let lat = queryResult.coord.lat;
            checkContent();
            printCurrent(queryResult, lon, lat);
            printFuture(lon, lat);
            addHistory(queryResult);
            renderSearchHistory(queryResult);
        })
}

// Print current city weather information to the page
function printCurrent(resultObj, lon, lat) {
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

    // Get UV index
    let uvQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=" + key +"&lat="+ lat+ "&lon=" + lon;
    fetch(uvQueryUrl)
        .then(function(response) {
            if (!response.ok) {
                 throw response.json();
            }
            return response.json();
        })
        .then(function(queryResult) {
            var cityUVContainer = document.createElement('li');
            var cityUVEl = document.createElement('p');
            cityUVEl.textContent = "UV Index: ";
            var cityIndexEl = document.createElement('span');
            cityIndexEl.textContent = queryResult.value;
            if (queryResult.value < 5) {
                cityIndexEl.setAttribute("class", "favorable");
            } else if (queryResult.value > 8) {
                cityIndexEl.setAttribute("class", "severe");
            } else {
                cityIndexEl.setAttribute("class", "moderate");
            }
            cityUVEl.appendChild(cityIndexEl);
            cityUVContainer.appendChild(cityUVEl);
            cityDataEl.appendChild(cityUVContainer);
            currentWeatherCard.appendChild(cityDataEl);
            currentWeatherEl.appendChild(currentWeatherCard);
        })
}

// Print future 5-day forecast
function printFuture(lon, lat) {
    let cityQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat +"&lon=" + lon + "&appid=" + key + "&units=imperial";
    fetch(cityQueryUrl)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function(queryResult) {
            futureWeatherTitleEl.textContent = "5-Day ForeCast: ";
            for (let i = 0; i < 5; i++){
                var futureWeather = queryResult.list[i];

                var futureWeatherCard = document.createElement('div');
                futureWeatherCard.classList.add('futureWeather', 'col-md-2');
                
                var cityTitleEl = document.createElement('h3');
                futureDate = moment().subtract(0-i, "days").format("M/D/YYYY");
                cityTitleEl.textContent = futureDate;
            
                var futureWeatherCondition = document.createElement('img');
                var iconUrl = "http://openweathermap.org/img/wn/"+ futureWeather.weather[0].icon+ "@2x.png";
                futureWeatherCondition.src = iconUrl;
            
                var cityDataEl = document.createElement('ul');
                var cityTempEl = document.createElement('li');
                var cityWindEl = document.createElement('li');
                var cityHumidityEl = document.createElement('li');
            
                cityTempEl.textContent = "Temp: " + futureWeather.main.temp + "°F";
                cityWindEl.textContent = "Wind: " + futureWeather.wind.speed + " MPH";
                cityHumidityEl.textContent = "Humidity: " + futureWeather.main.humidity + " %";
            
                cityDataEl.appendChild(cityTitleEl);
                cityDataEl.appendChild( futureWeatherCondition);
                cityDataEl.appendChild(cityTempEl);
                cityDataEl.appendChild(cityWindEl);
                cityDataEl.appendChild(cityHumidityEl);
                futureWeatherCard.appendChild(cityDataEl);
                futureWeatherEl.appendChild(futureWeatherCard);
            }
        })
}

// Clear the current existing content
function checkContent(){
    var checkpoint = document.querySelectorAll(".currentWeather");
    if (checkpoint.length == 0){
        return;
    } else {
        checkpoint[0].parentNode.removeChild(checkpoint[0]);
    }
    var checkpoint2 = document.querySelectorAll(".futureWeather");
    if (checkpoint2.length == 0){
        return;
    } else {
        for (let j = 0; j < 5; j++) {
            checkpoint2[j].parentNode.removeChild(checkpoint2[j]);
        }
    }
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

// Render search history
var searchHistory = [];
function addHistory(queryResult){
    var name = queryResult.name;
    searchHistory.push(name);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function renderSearchHistory() {
    searchHistoryEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        var history = searchHistory[i];
        var cityNameEl = document.createElement('button');
        cityNameEl.textContent = history;
        cityNameEl.classList.add('historyBtn', 'col-12');
        searchHistoryEl.appendChild(cityNameEl);
       // cityNameEl.addEventListener('click', searchCityWeather);
    }
}

searchBtnEl.addEventListener('click', searchCityWeather);

getParams();