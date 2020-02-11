// Global Constants

const searchBtn = $("#search-button")
const cityInfo = $("#city-info")
const fiveDayInfo = $("#five-day")
const cityInfoContainer = $("#city-info-container")
const searchHistoryContainer = $("#search-history-container")
const searchInput = $("#search-input")
const searchHistoryList = $("#search-history")

// Event Listeners

// Search Button Event Listeners
$(searchBtn).on("click", function () {
    cityInfo.empty()
    fiveDayInfo.empty()
    searchAPI($("#search-bar").val())
    createRecentSearchButtons()
})
// Event listener for the recent searche buttons
$(document).on("click", ".recent-search-button", function () {
    var searchTerm = $(this).text()
    if (searchTerm == "") {
        return
    }
    searchAPI(searchTerm)
    cityInfo.empty()
    fiveDayInfo.empty()
})

// Functions

function searchAPI(city) {

    // User input for the city search
    // Returns function if the search is blank 
    if (city === "") {
        return
    }
    cityInfoContainer.removeClass("hidden")

    // URL for the current weather forcast
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=c73695a3c7ea7fc65fb5229922066d32"
    // URL for the five day forcast call
    var fiveURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=c73695a3c7ea7fc65fb5229922066d32"
    // Call for the current forcast
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // Gets Lon and Lat because you cant get the UV index without them
        var lat = response.coord.lat
        var lon = response.coord.lon
        // Sets the UV index URL
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=c73695a3c7ea7fc65fb5229922066d32&lat=" + lat + "&lon=" + lon
        //Gets the time in mm/dd/yyyy format
        var time = response.dt

        // Unixtimestamp
        var unixtimestamp = time;

        // Months array
        var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Convert timestamp to milliseconds
        var date = new Date(unixtimestamp * 1000);

        // Year
        var year = date.getFullYear();

        // Month
        var month = months_arr[date.getMonth()];

        // Day
        var day = date.getDate();

        var timeElement = $("<h2>").addClass("date").text("(" + month + "/" + day + "/" + year + ")")

        // The city name and the current date
        var name = response.name
        var nameElement = $("<li>").attr("class", "city").text(name)
        // The temperature for the city
        var temperature = response.main.temp
        var temperatureElement = $("<li>").addClass("details").text("Temperature: " + temperature + " ℉")
        // The humidity for the city
        var humidity = response.main.humidity
        var humidityElement = $("<li>").addClass("details").text("Humidity: " + humidity + "%")
        // The current wind speed for the city
        var windSpeed = response.wind.speed
        var windSpeedElement = $("<li>").addClass("details").text("Wind Speed: " + windSpeed + " MPH")
        //Appends the city stats to the city info div
        timeElement.appendTo(nameElement)
        $(cityInfo).append(nameElement, temperatureElement, humidityElement, windSpeedElement)


        // Call for the UV index
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (uvResponse) {
            // Current UV index 
            var uvIndex = uvResponse.value
            var uvElement = $("<li>").text("UV Index: " + uvIndex)

            //UV index
            if (uvResponse.value <= 2) {
                $(uvElement).removeClass(`yellow`)
                $(uvElement).removeClass(`orange`)
                $(uvElement).removeClass(`red`)
                $(uvElement).addClass(`green`)
            } else if (uvResponse.value <= 5) {
                $(uvElement).removeClass(`green`)
                $(uvElement).removeClass(`orange`)
                $(uvElement).removeClass(`red`)
                $(uvElement).addClass(`yellow`)
            } else if (uvResponse.value <= 7) {
                $(uvElement).removeClass(`yellow`)
                $(uvElement).removeClass(`green`)
                $(uvElement).removeClass(`red`)
                $(uvElement).addClass(`orange`)
            } else {
                $(uvElement).removeClass(`yellow`)
                $(uvElement).removeClass(`orange`)
                $(uvElement).removeClass(`green`)
                $(uvElement).addClass(`red`)
            }

        // Appends the uvElement to the city info div
        $(cityInfo).append(uvElement)
    })
})


// call for the 5 day forcast
$.ajax({
    url: fiveURL,
    method: "GET"
}).then(function (response) {

    // Loops through the response.list array five times
    for (i = 0; i < 40; i += 8) {

        // Creates the card for the forcast stats
        var card = $("<div>").addClass("container")

        // Creates an unordered list
        var list = $("<ul>")

        // Stupid stupid time i hate it 
        var time = response.list[i].dt

        // Unixtimestamp
        var unixtimestamp = time;

        // Months array
        var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Convert timestamp to milliseconds
        var date = new Date(unixtimestamp * 1000);

        // Year
        var year = date.getFullYear();

        // Month
        var month = months_arr[date.getMonth()];

        // Day
        var day = date.getDate();

        var timeElement = $("<h2>").addClass("date").text("(" + month + "/" + day + "/" + year + ")")

        // Future temp for city
        var temp = response.list[i].main.temp
        var tempElement = $("<li>").text("Temperature: " + temp + " ℉").addClass("details")
        // Future humidity 
        var hum = response.list[i].main.humidity
        var humElement = $("<li>").text("Humidity: " + hum + "%").addClass("details")
        // Future wind for city
        var wind = response.list[i].wind.speed
        var windElement = $("<li>").text("Wind Speed: " + wind + " MPH").addClass("details")
        // Appends list items to the list
        list.append(timeElement, tempElement, humElement, windElement)
        // Appends the list to the card
        list.appendTo(card)
        // Appends card to the five-day div
        card.appendTo(fiveDayInfo)
    }
})
cityInfoContainer.removeClass("hidden")
searchHistoryContainer.removeClass("hidden")
}

function createRecentSearchButtons() {
    var userInput = $("#search-bar").val()
    if (userInput === "") {
        return
    }
    var recentSearches = []

    recentSearches.push(userInput)

    for (i = 0; i < recentSearches.length; i++) {
        var button = $("<button>").text(recentSearches[i]).addClass("recent-search-button")
        button.prependTo(searchHistoryList)
    }
}
