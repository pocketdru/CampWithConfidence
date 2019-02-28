$(document).ready(function () {
    console.log("js connected")

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDlQErx3yjw52qOl6u6d2Tcbej_jXbFKSY",
        authDomain: "team-7-57df4.firebaseapp.com",
        databaseURL: "https://team-7-57df4.firebaseio.com",
        projectId: "team-7-57df4",
        storageBucket: "team-7-57df4.appspot.com",
        messagingSenderId: "84323974010"
    };
    firebase.initializeApp(config);
    // Create a variable to reference the database.
    var database = firebase.database();
    



    function currentWeatherAjax() {

        var url = "https://api.openweathermap.org/data/2.5/weather?"
        var queryParams = {
            "appid": "25f1d41384ca0a12c21a0c9237a9d2cb"
        };
        queryParams.q = $("#name").val();
        console.log(queryParams.q);

        var queryURL = url + $.param(queryParams);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
        });
    }


    function getCampsites(response, parkLocationStr) {

        $(".info").empty();
        var parkSelection = $("#name").val();
        firstLetter = parkSelection.charAt(0).toUpperCase();
        var capParkSelection = firstLetter + parkSelection.slice(1)
        $(".info").html("<h4>" + "Campsites in " + capParkSelection + " National Park" + "</h4>");


        for (var j = 0; response.data.length - 1; j++) {

            console.log(response.data[j].latLong)
            var locationStr = response.data[j].latLong;

            if (!!locationStr) {

                var newOption = $("<option>");
                var newOption = $("<option>").attr("data-location", locationStr);
                newOption.attr("data-description", response.data[j].description);
                newOption.attr("data-name", response.data[j].name);
                newOption.attr("data-locationValue", true);
                newOption.attr("class", "campsites");
                newOption.text(response.data[j].name);
                $(".info").append(newOption);
            } else {

                var newOption = $("<option>");
                var newOption = $("<option>").attr("data-location", parkLocationStr);
                newOption.attr("data-description", response.data[j].description);
                newOption.attr("data-name", response.data[j].name);
                newOption.attr("data-locationValue", false);
                newOption.attr("class", "campsites");
                newOption.text(response.data[j].name);
                $(".info").append(newOption);
            }
        }
    }


    function dayOfWeek(timeStamp) {

        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var dayNum = new Date(timeStamp * 1000).getDay();
        var result = days[dayNum];
        return result;
    }


    function renderDescription(description, siteName) {

        $(".camp-name").text(siteName);
        $(".camp-descript").text(description);
    }

    function parksAjax() {

        //ajax call to get park lat and long===================
        var urlPark = "https://developer.nps.gov/api/v1/parks?"
        var queryParamsPark = {
            "api_key": "KPU9fBN1jvn0aF6OMVUOJ3fFcxjhAPpNuBCQhcrO"
        };
        queryParamsPark.q = $("#name").val();;
        var queryURLPark = urlPark + $.param(queryParamsPark);

        $.ajax({
            url: queryURLPark,
            method: "GET"
        }).then(function (response) {
            console.log(response.data[0].latLong);
            parkLocationStr = response.data[0].latLong;

            //ajax call for campsites===============================
            var url = "https://developer.nps.gov/api/v1/campgrounds?"
            var queryParams = {
                "api_key": "KPU9fBN1jvn0aF6OMVUOJ3fFcxjhAPpNuBCQhcrO"
            };
            queryParams.q = $("#name").val();
            var queryURL = url + $.param(queryParams);

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {

                console.log(response)
                getCampsites(response, parkLocationStr);
            });

        });
    }


    function forecastAjax(location) {

        var url = "https://api.openweathermap.org/data/2.5/forecast?"
        var queryParams = {
            "appid": "25f1d41384ca0a12c21a0c9237a9d2cb"
        };

        queryParams.lat = location.lat;
        queryParams.lon = location.long;
        queryParams.units = "imperial"

        var queryURL = url + $.param(queryParams);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            forecastLoop(response);
            recommendations(response);
        });
    }


    function forecastLoop(response) {
        $(".forecast-view").empty();

        var newTittle = $("<tr>").append(
            $("<th>").text("Day"),
            $("<th>").text("Temp"),
            $("<th>").text("weather"),
            $("<th>").text("Wind")
        )
        $(".forecast-view").append(newTittle);

        for (i = 0; i < response.list.length; i = i + 8) {
            console.log(response.list[i]);
            var days = response.list[i];
            var weekDay = dayOfWeek(days.dt);

            var newRow = $("<tr>").append(
                $("<td>").text(weekDay),
                $("<td>").text(Math.round(days.main.temp) + "°F"),
                $("<td>").text(days.weather[0].main),
                // $("<td>").text(days.weather[0].description),
                $("<td>").text(days.wind.speed)
            )
            $(".forecast-view").append(newRow);
        }
    }


    function recommendations(response) {

        $(".clothingRecommendations").empty();

        var temp = [];
        var weather = [];
        var wind = [];
        for (i = 0; i < response.list.length; i = i + 8) {
            var days = response.list[i];

            temp.push(Math.round(days.main.temp));
            weather.push(days.weather[0].main);
            wind.push(days.wind.speed);

        }
        console.log(temp);
        console.log(weather);
        console.log(wind);

        for (i = 0; i < temp.length; i++) {
            //clear and calm
            if (temp[i] <= 0) {
                console.log()
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><p>Camping not recommended at sub-zero temperatures!</p>")
            }
            else if (temp[i] > 0 && temp[i] < 30 && wind[i] <= 5 && weather[i] === "Clear") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Heavy Jacket</li><li>Cold Weather Sleeping Bag</li><li>Wool Socks</li><li>Wool Hat or Earmuffs</li><li>Space Blanket</li><li>Gloves<li>Sunscreen</li></ul>")
            }
            else if (temp[i] >= 30 && temp[i] < 60 && wind[i] <= 5 && weather[i] === "Clear") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Light Jacket</li><li>Cold Weather Sleeping Bag</li><li>Sleeping Socks</li><li>Sunscreen</li><li>Long Sleeve Shirts</li></ul>")
            }
            else if (temp[i] >= 60 && temp[i] < 85 && wind[i] <= 5 && weather[i] === "Clear") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Long Sleeve Shirts</li><li>T-shirts</li><li>Sleeping Bag</li><li>Sunscreen</li><li>Shorts or Pants</li></ul>")
            }
            else if (temp[i] >= 85 && wind[i] <= 5 && weather[i] === "Clear") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>UV Blocking T-shirts</li><li>Light Sleeping Bag or Hammock</li><li>Sunscreen</li><li>Shorts</li><li>Plenty of Water</li><li>Battery-powered Fan</li></ul>")
            }
            //clear and windy
            else if (temp[i] > 0 && temp[i] < 30 && wind[i] > 5 && weather[i] === "Clear") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Heavy Jacket</li><li>Wind Breaker</li><li>Cold Weather Sleeping Bag</li><li>Wool Socks</li><li>Wool Hat or Earmuffs</li><li>Balaclava</li><li>Space Blanket</li><li>Gloves<li>Sunscreen</li></ul>")
            }
            else if (temp[i] >= 30 && temp[i] < 60 && wind[i] > 5 && weather[i] === "Clear") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Light Jacket</li><li>Wind Breaker</li><li>Cold Weather Sleeping Bag</li><li>Sleeping Socks</li><li>Sunscreen</li><li>Long Sleeve Shirts</li></ul>")
            }
            else if (temp[i] >= 60 && temp[i] < 85 && wind[i] > 5 && weather[i] === "Clear") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Long Sleeve Shirts</li><li>T-shirts</li><li>Sleeping Bag</li><li>Wind Breaker</li><li>Sunscreen</li><li>Shorts or Pants</li></ul>")
            }
            else if (temp[i] >= 85 && wind[i] > 5 && weather[i] === "Clear") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>UV Blocking T-shirts</li><li>Light Sleeping Bag or Hammock</li><li>Sunscreen</li><li>Shorts</li><li>Plenty of Water</li></ul>")
            }
            
            //cloudy and calm
            else if (temp[i] > 0 && temp[i] < 30 && wind[i] <= 5 && weather[i] === "Clouds") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Heavy Jacket</li><li>Cold Weather Sleeping Bag</li><li>Wool Socks</li><li>Wool Hat or Earmuffs</li><li>Space Blanket</li><li>Gloves<li>Sunscreen</li></ul>")
            }
            else if (temp[i] >= 30 && temp[i] < 60 && wind[i] <= 5 && weather[i] === "Clouds") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Light Jacket</li><li>Cold Weather Sleeping Bag</li><li>Sleeping Socks</li><li>Sunscreen</li><li>Long Sleeve Shirts</li></ul>")
            }
            else if (temp[i] >= 60 && temp[i] < 85 && wind[i] <= 5 && weather[i] === "Clouds") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Long Sleeve Shirts</li><li>T-shirts</li><li>Sleeping Bag</li><li>Sunscreen</li><li>Shorts or Pants</li></ul>")
            }
            else if (temp[i] >= 85 && wind[i] <= 5 && weather[i] === "Clouds") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>UV Blocking T-shirts</li><li>Light Sleeping Bag or Hammock</li><li>Sunscreen</li><li>Shorts</li><li>Plenty of Water</li><li>Battery-powered Fan</li></ul>")
            }

            //cloudy and windy
            else if (temp[i] > 0 && temp[i] < 30 && wind[i] > 5 && weather[i] === "Clouds") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Heavy Jacket</li><li>Wind Breaker</li><li>Cold Weather Sleeping Bag</li><li>Wool Socks</li><li>Wool Hat or Earmuffs</li><li>Balaclava</li><li>Space Blanket</li><li>Gloves<li>Sunscreen</li></ul>")
            }
            else if (temp[i] >= 30 && temp[i] < 60 && wind[i] > 5 && weather[i] === "Clouds") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Light Jacket</li><li>Wind Breaker</li><li>Cold Weather Sleeping Bag</li><li>Sleeping Socks</li><li>Sunscreen</li><li>Long Sleeve Shirts</li></ul>")
            }
            else if (temp[i] >= 60 && temp[i] < 85 && wind[i] > 5 && weather[i] === "Clouds") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Long Sleeve Shirts</li><li>T-shirts</li><li>Sleeping Bag</li><li>Wind Breaker</li><li>Sunscreen</li><li>Shorts or Pants</li></ul>")
            }
            else if (temp[i] >= 85 && wind[i] > 5 && weather[i] === "Clouds") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>UV Blocking T-shirts</li><li>Light Sleeping Bag or Hammock</li><li>Sunscreen</li><li>Shorts</li><li>Plenty of Water</li></ul>")
            }
            
            //snowy and calm

            else if (temp[i] > 0 && temp[i] < 30 && wind[i] <= 5 && weather[i] === "Snow") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Heavy Snow Jacket</li><li>Cold Weather Sleeping Bag</li><li>Groundtarp for Tent</li><li>Wool Socks</li><li>Wool Hat or Earmuffs</li><li>Space Blanket</li><li>Gloves</li><li>Snow Boots</li><li>Sunscreen</li></ul>")
            }
            else if (temp[i] >= 30 && temp[i] < 60 && wind[i] <= 5 && weather[i] === "Snow") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Light Snow Jacket</li><li>Cold Weather Sleeping Bag</li><li>Sleeping Socks</li><li>Groundtarp for Tent</li><li>Long Sleeve Shirts</li><li>Snow Boots</li></ul>")
            }
        //snowy and windy

            else if (temp[i] > 0 && temp[i] < 30 && wind[i] > 5 && weather[i] === "Snow") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Heavy Snow Jacket</li><li>Cold Weather Sleeping Bag</li><li>Groundtarp for Tent</li><li>Windbreaker</li><li>Wool Socks</li><li>Wool Hat or Earmuffs</li><li>Space Blanket</li><li>Gloves</li><li>Snow Boots</li><li>Sunscreen</li></ul>")
            }
            else if (temp[i] >= 30 && temp[i] < 60 && wind[i] > 5 && weather[i] === "Snow") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Light Snow Jacket</li><li>Cold Weather Sleeping Bag</li><li>Sleeping Socks</li><li>Windbreaker</li><<li>Groundtarp for Tent</li><li>Long Sleeve Shirts</li><li>Snow Boots</li></ul>")
            }
            //rainy and calm

            else if (temp[i] > 0 && temp[i] < 30 && wind[i] <= 5 && weather[i] === "Rain") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Heavy Rain Jacket</li><li>Cold Weather Sleeping Bag</li><li>Groundtarp for Tent</li><li>Rain Fly</li><li>Wool Socks</li><li>Wool Hat or Earmuffs</li><li>Space Blanket</li><li>Gloves</li><li>Waterproof Boots</li><li>Sunscreen</li></ul>")
            }
            else if (temp[i] >= 30 && temp[i] < 60 && wind[i] <= 5 && weather[i] === "Rain") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Light Snow Jacket</li><li>Cold Weather Sleeping Bag</li><li>Sleeping Socks</li><li>Groundtarp for Tent</li><li>Rain Fly</li><li>Long Sleeve Shirts</li><li>Waterproof Boots</li></ul>")
            }
            else if (temp[i] >= 60 && temp[i] < 95 && wind[i] <= 5 && weather[i] === "Rain") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Light  Jacket</li><li>Sleeping Bag</li><li>Sleeping Socks</li><li>Groundtarp for Tent</li><li>Rain Fly</li><li>Long Sleeve Shirts</li><li>Waterproof Boots</li></ul>")
            }
        //rainy and windy

            else if (temp[i] > 0 && temp[i] < 30 && wind[i] > 5 && weather[i] === "Rain") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Heavy Snow Jacket</li><li>Cold Weather Sleeping Bag</li><li>Groundtarp for Tent</li><li>Windbreaker</li><li>Rain Fly</li><li>Wool Socks</li><li>Wool Hat or Earmuffs</li><li>Space Blanket</li><li>Gloves</li><li>Snow Boots</li><li>Sunscreen</li></ul>")
            }
            else if (temp[i] >= 30 && temp[i] < 60 && wind[i] > 5 && weather[i] === "Rain") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Light Snow Jacket</li><li>Cold Weather Sleeping Bag</li><li>Sleeping Socks</li><li>Windbreaker</li><<li>Groundtarp for Tent</li><li>Rain Fly</li><li>Long Sleeve Shirts</li><li>Snow Boots</li></ul>")
            }
            else if (temp[i] >= 60 && temp[i] < 95 && wind[i] > 5 && weather[i] === "Rain") {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Light Jacket</li><li>Sleeping Bag</li><li>Sleeping Socks</li><li>Groundtarp for Tent</li><li>Rain Fly</li><li>Long Sleeve Shirts or T-shirts</li><li>Waterproof Boots</li></ul>")
            }
            else {
                $(".clothingRecommendations").html(
                    "<h5>Clothing Recommendations</h5><ul><li>Cannot retreive clothing recommendations</li></ul>")
            }
        }

    }


    function renderMap(lat, long) {
        console.log("map running")

        $(".map-container").empty();

        var newMap = $("<div>").attr("id", "mapid");
        $(".map-container").append(newMap);

        var mymap = L.map('mapid').setView([lat, long], 15);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYXdpbGV5IiwiYSI6ImNqcDBrbXU0eDAwMmkzd21qN2U3ZmFvb2UifQ.pK9CRHLF-HjgBL0Z8Dmr2w', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'your.mapbox.access.token'
        }).addTo(mymap);
    }

    $("#submit-btn").on("click", function (event) {
        console.log("click")
        event.preventDefault();
        $(".forecast-view").empty();
        parksAjax()
    })


    // make it so page doesnt reload if you press enter
    $(document).keypress(function (e) {
        var key = e.which;
        if(key == 13)  // the enter key code
         {
            event.preventDefault();
            $(".forecast-view").empty();
            parksAjax()
        //    $(document).click();
           return false;  
         }
       }); 


    $(document).on("click", ".user-feedback", function () {
        event.preventDefault();
console.log("click")

        // Initial Values
        var name = $("#personName").val().trim();
        var comment = $("#personComment").val().trim();


        var newFeedback = {
            name: name,
            comment: comment,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        };
        //uploads feedback to firebase
        database.ref().push(newFeedback);
        //clears elements before adding new text
        $("#personName").val("");
        $("#personComment").val("");
    }); //end of onclick

    // Firebase watcher .on("child_added"
    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());
        // storing the snapshot.val() in a variable for convenience
        var name = childSnapshot.val().name;
        var comment = childSnapshot.val().comment;

        // Console.loging the last user's data
        console.log(name);
        console.log(comment);

        var newDiv = $("<div></div>")
        console.log("newdiv created")

        // Change the HTML to reflect
        $(newDiv).append("<p>" + name + "<br>" + comment + "</p>");
        $(".comments").append(newDiv)

    })


    $(document).on("click", ".campsites", function () {

        // this could be its own function
        var description = $(this).attr("data-description");
        var siteName = $(this).attr("data-name");
        var locationStr = $(this).attr("data-location");
        var locationValue = $(this).attr("data-locationValue");
        var cleanLatLong = locationStr.slice(1, -1).split(',');

        if (locationValue === "true") {

            var latitude = cleanLatLong[0].substr(4);
            var longitude = cleanLatLong[1].substr(5);
        } else if (locationValue === "false") {

            var latitude = cleanLatLong[0].substr(3);
            var longitude = cleanLatLong[1].substr(6);
        }

        var location = {
            lat: latitude,
            long: longitude
        }
        forecastAjax(location);
        renderDescription(description, siteName);
        renderMap(location.lat, location.long);
    })


    renderMap("44.4605", "-110.8281")

});

console.log(moment().format("DD/MM/YY hh:mm A"));