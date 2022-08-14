var searchBtnEl = document.querySelector("#search-btn");

function searchCityWeather(event){
    event.preventDefault();

    var cityName = document.querySelector('#search-input').value;
    if (!cityName) {
        console.log("You need a city name!");
        return;
    }
    
    var queryString = './search-result.html?q=' + cityName;

    location.assign(queryString);
}

searchBtnEl.addEventListener('click', searchCityWeather);