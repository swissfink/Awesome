var main = {

}

var game = {

}

var wordsAPI = {

    test: function () {
        unirest.get("https://wordsapiv1.p.mashape.com/words/soliloquy")
            .header("X-Mashape-Key", "58a7fd97f6msh94523ee61afca0cp1bee0ajsn5a6d8be811cc")
            .header("Accept", "application/json")
            .end(function (result) {
                console.log("wordsAPI test")
                console.log(result.status, result.headers, result.body);
            });

    }
}

var giphyAPI = {

    api_key: "m1zLhrSg5oQZ4XsPia3CzlHfX6ruOQ43",    //apikey for queryURL

    makeQueryURL: function (api_key, topic, limit, rating, offset) {
        //function to generate query URL, intakes apikey(required), topic for q param(required), limit for number of image searches, rating for image, and offset.
        var queryURL = "https://api.giphy.com/v1/gifs/search?";
        var queryParam = {};
        queryParam.api_key = api_key;   //required
        queryParam.q = topic;           //required
        queryParam.limit = limit;
        queryParam.rating = rating;
        queryParam.offset = offset;
        return queryURL + $.param(queryParam);
    },

    createRewardImage(appendLocation, topic) {
        $.ajax({
            url: giphyAPI.makeQueryURL(giphyAPI.api_key, topic, "1", "", ""),
            method: "GET"
        }).then(function (response) {
            var newImage = $("<img>");
            newImage.attr("src", response.data[0].images.fixed_height.url);
            $(appendLocation).append(newImage)

        });
    }

}

// function autoplay() {
//     $('.carousel').carousel('next');
//     setTimeout(autoplay, 4500);
// }


$(document).ready(function () {

    $('.sidenav').sidenav();  //initializes sidebar with instructions

    $('.collapsible').collapsible(); //initializes collapsible instructions in sidebar
  


    $.ajax({
        url: "https://wordsapiv1.p.mashape.com/words/test?X-Mashape-Key=58a7fd97f6msh94523ee61afca0cp1bee0ajsn5a6d8be811cc",
        method: "GET"
    }).then(function (response) {

            console.log(response)
    });

    // after document is ready
    // initialize materialize
    // M.AutoInit();
    // initiate materialize carousel
    // $(".carousel").carousel({
    //     numVisible: 5,
    //     duration: 200,
    //     dist: 0,
    //     fullWidth: false,
    // })
    $("#gameMode").carousel()
    $('#demo-carousel').carousel();

    // var carouselElem = document.querySelector(".carousel")


    giphyAPI.createRewardImage("#gameWindow", "words");
    // wordsAPI.test();

    // autoplay()



})







