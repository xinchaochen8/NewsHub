var BusinessIndex = 0, EntertainmentIndex = 0, GeneralIndex = 0, ScienceIndex = 0, HealthIndex = 0, SportsIndex = 0;
var TechnologyIndex = 0, PoliticsIndex = 0, EducationIndex = 0, BookmarksIndex = 0, WorldIndex = 0, StockIndex = 0;
//var apiUrl = 'https://newsapi.org/v2/top-headlines?country=us&category=';
//var apiKey = '&apiKey=fe86b57e90694506a1b39b9a8ab260d1';
var apiUrl = "";
var apiKey = "";

$(document).ready(function () {
    let totalJSON = null;

    var BusinessJson, EntertainmentJson, GeneralJson, ScienceJson, HealthJson, SportsJson, TechnologyJson, PoliticsJson, EducationJson, WorldJson;
    var quoteJSON, stockJSON, nasaJSON, weatherJSON;


    function build(callback) {
        var query = "/build/all";
        $.get(query, function (data) {
            if (data.status === 'ok') {
                callback(data);
            } else {
                return({
                    "status": "error",
                    "message": data
                });
            }
        }).fail(function () {
            return({
                "status": "error",
                "message": "query fail"
            });
        });
    }
    
    // building contents using an array of articles from the JSON file
    function updateContent(category) {
        var target, index, sectionID;

        switch (category) {
            case "business":
                target = BusinessJson;
                index = BusinessIndex;
                sectionID = "#BusinessNews";
                break;
            case "entertainment":
                target = EntertainmentJson;
                index = EntertainmentIndex;
                sectionID = "#EntertainmentNews";
                break;
            case "general":
                target = GeneralJson;
                index = GeneralIndex;
                sectionID = "#GeneralNews";
                break;
            case "science":
                target = ScienceJson;
                index = ScienceIndex;
                sectionID = "#ScienceNews";
                break;
            case "health":
                target = HealthJson;
                index = HealthIndex;
                sectionID = "#HealthNews";
                break;
            case "sports":
                target = SportsJson;
                index = SportsIndex;
                sectionID = "#SportsNews";
                break;
            case "technology":
                target = TechnologyJson;
                index = TechnologyIndex;
                sectionID = "#TechnologyNews";
                break;
            case "politics":
                target = PoliticsJson;
                index = PoliticsIndex;
                sectionID = "#PoliticsNews";
                break;
            case "education":
                target = EducationJson;
                index = EducationIndex;
                sectionID = "#EducationNews";
                break;
            case "world":
                target = WorldJson;
                index = WorldIndex;
                sectionID = "#WorldNews";
                break;
            case "stock":
                target = stockJSON;
                index = StockIndex;
                sectionID = '#StockNews';
                break;
            default:
                // unexpected category
                console.log(`Error: Unexpected category - ${category}`);
        }

        var newHTMLContent = ""; // Initialize as an empty array

        // check if target is defined and if it is not empty
        if (target && target.length) {
            // show 5 articles at once

            for (var i = index; i < index + 5 && i < target.length; i++) {
                var imageURL = target[i]["urlToImage"] != null ? target[i]["urlToImage"] : "./src/No_Preview_image.png";
                var articleURL = target[i]["url"];
                var title = target[i]["title"];
                var description = target[i]["description"] != null ? target[i]["description"] : "No Description Available";
                newHTMLContent +=
                    `<section class="${category} ${category}News${i} newsItem">
                        <h3 class="Title">${title}</h3>
                        <a href="${articleURL}">
                            <img class="Img" src="${imageURL}" alt="article image">
                        </a>
                        <p class="Description">${description}</p>
                    </section>`;
        

            }

            switch (category) {
                case "business":
                    BusinessIndex = (BusinessIndex >= 25) ? 0 : BusinessIndex + 5;
                    break;
                case "entertainment":
                    EntertainmentIndex = (EntertainmentIndex >= 25) ? 0 : EntertainmentIndex + 5;
                    break;
                case "general":
                    GeneralIndex = (GeneralIndex >= 25) ? 0 : GeneralIndex + 5;
                    break;
                case "science":
                    ScienceIndex = (ScienceIndex >= 25) ? 0 : ScienceIndex + 5;
                    break;
                case "health":
                    HealthIndex = (HealthIndex >= 25) ? 0 : HealthIndex + 5;
                    break;
                case "sports":
                    SportsIndex = (SportsIndex >= 25) ? 0 : SportsIndex + 5;
                    break;
                case "technology":
                    TechnologyIndex = (TechnologyIndex >= 25) ? 0 : TechnologyIndex + 5;
                    break;
                case "politics":
                    PoliticsIndex = (PoliticsIndex >= 25) ? 0 : TechnologyIndex + 5;
                    break;
                case "education":
                    EducationIndex = (EducationIndex >= 25) ? 0 : TechnologyIndex + 5;
                    break;
                case "world":
                    WorldIndex = (WorldIndex >= 25) ? 0 : WorldIndex + 5;
                    break;
                case "stock":
                    StockIndex = (StockIndex >= 25) ? 0 : StockIndex + 5;
                    break;
                default:
                    // unexpected category
                    console.log(`Error: Unexpected category - ${category}`);
            }

            // Update the HTML content of the news section
            $(`${sectionID}`).html(newHTMLContent);

        } else {
            console.log(`Error: Target is undefined or does not have 'length' property for category ${category}`);
        }
    }

    function saveToLocalStorage(category, index) {
        var targetJson;

        switch (category) {
            case "business":
                targetJson = BusinessJson;
                break;
            case "entertainment":
                targetJson = EntertainmentJson;
                break;
            case "general":
                targetJson = GeneralJson;
                break;
            case "science":
                targetJson = ScienceJson;
                break;
            case "health":
                targetJson = HealthJson;
                break;
            case "sports":
                targetJson = SportsJson;
                break;
            case "technology":
                targetJson = TechnologyJson;
                break;
            case "politics":
                targetJson = PoliticsJson;
                break;
            case "education":
                targetJson = EducationJson;
                break;
            case "world":
                targetJson = WorldJson;
                break;
            case "stock":
                targetJson = stockJSON;
                break;
            default:
                // unexpected category
                console.log(`Error: Unexpected category - ${category}`);
                return;
        }

        if (targetJson && targetJson.length > index) {
            var clickedArticle = targetJson[index];
            var jsonString = JSON.stringify(clickedArticle);
            var localStorageKey = `${category}_article_${index}`;

            localStorage.setItem(localStorageKey, jsonString);
            console.log(`Article saved to local storage: ${localStorageKey}`);
        }
    }

    

    function updateBookmarksSection() {
        var bookmarksHTML = "";

        // same logic as updating normal contents
        // but local storage specific
        for (var i = BookmarksIndex; i < BookmarksIndex + 5 && i < localStorage.length; i++) {
            var key = localStorage.key(i);

            var category = key.split("_")[0] != null ? key.split("_")[0]: "World";
            var index = parseInt(key.split("_")[2]);

            var savedArticle = JSON.parse(localStorage.getItem(key));

            // building contents for html
            var imageURL = savedArticle["urlToImage"] != null ? savedArticle["urlToImage"] : "./src/No_Preview_image.png";
            if (savedArticle["image_url"] != null) {
                imageURL = savedArticle["image_url"];
            }
            var articleURL = savedArticle["url"];
            var title = savedArticle["title"];
            var description = savedArticle["description"] != null ? savedArticle["description"] : "No Description Available";

            bookmarksHTML +=
                `<section class="${category}News${index} newsItem">
                <h3 class="Title">${title}</h3>
                <a href="${articleURL}">
                    <img class="Img" src="${imageURL}" alt="article image">
                </a>
                <p class="Description">${description}</p>
                </section>`;

        }

        BookmarksIndex = (BookmarksIndex >= localStorage.length - 5) ? 0 : BookmarksIndex + 5;

        // update contents for html
        $("#BookmarksNews").html(bookmarksHTML);
    }

    // fetch json files
    const categories = ['business', 'entertainment', 'general', 'science', 'health', 'sports', 'technology', 'politics', 'education', 'world','stock'];

    // update totalJSON with actual json
    build (function (data) {
        totalJSON = data;
        if (totalJSON.news.status === "ok") {
            BusinessJson = totalJSON.news.articles.business;
            EntertainmentJson = totalJSON.news.articles.entertainment;
            GeneralJson = totalJSON.news.articles.general;
            ScienceJson = totalJSON.news.articles.science;
            HealthJson = totalJSON.news.articles.health;
            SportsJson = totalJSON.news.articles.sports;
            TechnologyJson = totalJSON.news.articles.technology;
            PoliticsJson = totalJSON.news.articles.politics;
            EducationJson = totalJSON.news.articles.education;
            WorldJson = totalJSON.news.articles.world;
        } else {
            alert(totalJSON.news.message);
        }

        if (totalJSON.weather.status === "ok") {
            weatherJSON = totalJSON.weather;

        } else {
            alert(totalJSON.weather.message);
        }

        if (totalJSON.stock.status === "ok") {
            stockJSON = totalJSON.stock.stocks;

        } else {
            alert(totalJSON.stock.message);
        }

        if (totalJSON.quote.status === "ok") {
            quoteJSON = totalJSON.quote;

        } else {
            alert(totalJSON.quote.message);
        }

        if (totalJSON.nasa.status === "ok") {
            nasaJSON = totalJSON.nasa;

        } else {
            alert(totalJSON.nasa.message);
        }

        categories.forEach(category => {
            updateContent(category);
            setInterval(function () {
                updateContent(category);
            }, 10000); 
    
        });    

        // building banner
        $("#banner").css("background-image",  'url(' + nasaJSON.hdurl + ')');
        console.log(nasaJSON.hdurl);
        $("#quote").html(quoteJSON.quote);
        $("#author").html(quoteJSON.author);

        $("#Current_Temperature").html(weatherJSON.current_temp);
        $("#Highest_Temperature").html(weatherJSON.highest_temp);
        $("#Lowest_Temperature").html(weatherJSON.lowest_temp);
        $("#Humidity").html(weatherJSON.humidity);
        $("#WindSpeed").html(weatherJSON.windspeed);
        $("#Weather").html(weatherJSON.weather);
        let link = "https://openweathermap.org/img/wn/";
        document.getElementById("WeatherImg").src = link + weatherJSON.icon + "@2x.png";
  
    });


    

    updateBookmarksSection();
    setInterval(function () {
        updateBookmarksSection();
    }, 5000); // 1000 milliseconds = 1 second


    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    let latitude = 42.73055451364849, longitude = 73.67831622699917;

    function success(pos) {
        const cord = pos.coords;

        latitude = cord.latitude;
        longitude = cord.longitude;
    }

    function error(err) {
        console.warn(`Kira (<ゝω・)☆～绮罗星 : ${err.message} \n
                    Using Default Location`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);



    $(document).on("click", ".Title", function () {
        var categoryClass = $(this).closest('section').attr('class');
        var category = categoryClass.split(' ')[0];
        var index = parseInt(categoryClass.match(/\d+/)[0]);

        console.log(category);
        console.log(index);
        // Save clicked article to local storage
        saveToLocalStorage(category, index);

        // Update the "BookmarksNews" section
        updateBookmarksSection();
    });

    let counter = 0, actionCetegory = null;

    $(document).on("click", ".number_selection", function() {
        counter = parseInt($(this).text());
        alert(`Current Number is ${counter}`);
    });

    $(document).on("click", ".category_selection", function() {
        actionCetegory = ($(this).text());
        alert(`Current Category is ${actionCetegory}`);
    });

    $("#action0").click(function() {
        var query = `/news`;

        $.ajax({
            url: query,
            type: 'PUT',
            success: function(data) {
                if (data.status === "ok") {
                    alert(`${data.message}`);
                } else {
                    alert(`Error: Try Again: ${data.message}`);
                }
            },
            error: function() {
                // Handle AJAX request failure
                console.log("Error: Try Again");
                // Load local JSON file as a fallback
            }
        });
    });

    $("#action1").click(function() {
        var query = `/news/${actionCetegory}`;

        if (actionCetegory != null) {
            $.get(query, function (data) {
                if (data.status === "ok") {
                    alert(`${data.message} for ${actionCetegory} \n ${data.articles}`);
                } else {
                    alert(`Error: Try Again: ${data.message}`);
                }
            }).fail(function () {
                console.log("Error: Try Again");
            });
        } else {
            alert("Please Pick a Catrgory");
        }
    });

    $("#action2").click(function() {
        var query = `/news/${actionCetegory}/${counter}`;
        if (actionCetegory != null) {
            $.ajax({
                url: query,
                type: 'PUT',
                success: function(data) {
                    if (data.status === "ok") {
                        alert(`${data.message}`);
                    } else {
                        alert(`Error: Try Again: ${data.message}`);
                    }
                },
                error: function() {
                    console.log("Error: Try Again");
                }
            });
        } else {
            alert("Please Pick a Category");
        }
    });

    $("#action3").click(function() {
        var query = `/news/${actionCetegory}/${counter}`;
        if (actionCetegory != null) {
            $.ajax({
                url: query,
                type: 'DELETE',
                success: function(data) {
                    if (data.status === "ok") {
                        alert(`${data.message}`);
                    } else {
                        alert(`Error: Try Again: ${data.message}`);
                    }
                },
                error: function() {
                    console.log("Error: Try Again");
                }
            });
        } else {
            alert("Please Pick a Category");
        }
    });
    
    $('#requestForm').submit(function (event) {
        // prevent default submission
        event.preventDefault();

        const method = $('#method').val();
        const url = $('#url').val();

        // You can perform your HTTP request using 'method' and 'url'
        // Example using fetch API:
        fetch(url, { method: method })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error(error));
    });
    
});

