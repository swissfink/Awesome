var main = {

}

var game = {

    RNGseed: 0,
    wordBank: ["Aberration", "Abreast", "Abstain", "Agog", "Alturism", "Apathy", "Audacious", "Blithe", "Burlesque", "Cacophony", "Confound", "Docile", "Doff", "Dote", "Endow", "Ephemeral", "Facetious", "Fallow", "Flail", "Forage", "Garner", "Gossamer", "Grovel", "Harangue", "Impetuous", "Inert", "Ingrate", "Insipid", "Lax", "Lurid", "Mirth", "Morose", "Oblique", "Opaque", "Overwrought", "Pertain", "Placate", "Plethora", "Pyre", "Reticence", "Ruminate", "Stigma", "Sublime", "Syncopation", "Tawdry", "Terse", "Torrid", "Transgression", "Vapid", "Vestige", "Waft", "Whittle", "Abasement", "Abate", "Apostle", "Apprise", "Bevy", "Boor", "Bucolic", "Capricious", "Chauvinism", "Coffer", "Condone", "Contrite", "Credulous", "Demur", "Deride", "Diatribe", "Discordant", "Divest", "Effigy", "Elucidate", "Esoteric", "Frenetic", "Gall", "Galvanize", "Goad", "Gossamer", "Grandiloquent", "Imbue", "Immutable", "Irascible", "Laconic", "Largesse", "Leery", "Malign", "Maudlin", "Mire", "Modish", "Nascent", "Normative", "Opine", "Pallid", "Panache", "Penchant", "Plethora", "Qualm", "Quell", "Quotidian", "Salient", "Savant", "Stigma", "Tout", "Whet"],

    wordRNG: function () {
        game.RNGseed = Math.floor(Math.random() * game.wordBank.length);
        return game.RNGseed
    },

    definitionMode: function () {

    },

    synonymMode: function () {

    },

    antonymMode: function () {

    }

}

var dictionaryAPI = {
    result: {},

    getDataDictionary: function (word) {
        $.ajax({
            url: "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=b4c85922-0be5-4246-8023-ee0594629f97",
            method: "GET"
        }).done(function (data) {
            dictionaryAPI.result = data;
            console.log(data)
            return dictionaryAPI.result[0].shortdef[0]

        });
    },

    getDataThesaurus: function (word) {
        $.ajax({
            url: "https://dictionaryapi.com/api/v3/references/thesaurus/json/" + word + "?key=202b8895-4b72-4bd2-8286-90efa368f523",
            method: "GET"
        }).done(function (data) {
            dictionaryAPI.result = data;
            console.log("thesaurus")
            console.log(data)
        });
    },
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
    $('.modal').modal();


    $("#modalTest").on("click", function () {
        console.log(1)

        giphyAPI.createRewardImage("#gameReward", "reward")
        var newP = $("<p>")
        dictionaryAPI.getDataThesaurus(game.wordBank[0])
        newP.text(dictionaryAPI.result[0].meta.syns[0]        );

        $("#gameReward").append(newP)

    })



    // var carouselElem = document.querySelector(".carousel")


    // giphyAPI.createRewardImage("#gameWindow", "words");
    // wordsAPI.test();

    dictionaryAPI.getDataThesaurus(game.wordBank[0])
    //will get definition
    // dictionaryAPI.result[0].shortdef[0]
    //Will get synonyms
    // dictionaryAPI.result[0].meta.syns[0]
    //Will get antonyms
    //dictionaryAPI.result[0].meta.ants[0]


    // autoplay()



})













