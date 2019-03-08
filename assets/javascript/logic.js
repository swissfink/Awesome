var main = {

}

var game = {

}

var dictionaryAPI = {
    getData: function (word) {
        $.ajax({
            url: "https://www.dictionaryapi.com/api/v3/references/collegiate/json/"+word+"?key=b4c85922-0be5-4246-8023-ee0594629f97",
            method: "GET"
        }).done(function (data) {
            console.log("words test")
            console.log(data)
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
    dictionaryAPI.getData("code")
    // wordsAPI.test();

    // autoplay()



})







