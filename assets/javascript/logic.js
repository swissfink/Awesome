var main = {

}

var game = {
    //global variables for the game
    correctChoice: "",
    RNGseed: 0,
    correctSeed: 0,
    questionWord: "",
    //the word bank currently GRE words
    wordBank: ["Aberration", "Abreast", "Abstain", "Agog", "Alturism", "Apathy", "Audacious", "Blithe", "Burlesque", "Cacophony", "Confound", "Docile", "Doff", "Dote", "Endow", "Ephemeral", "Facetious", "Fallow", "Flail", "Forage", "Garner", "Gossamer", "Grovel", "Harangue", "Impetuous", "Inert", "Ingrate", "Insipid", "Lax", "Lurid", "Mirth", "Morose", "Oblique", "Opaque", "Overwrought", "Pertain", "Placate", "Plethora", "Pyre", "Reticence", "Ruminate", "Stigma", "Sublime", "Syncopation", "Tawdry", "Terse", "Torrid", "Transgression", "Vapid", "Vestige", "Waft", "Whittle", "Abasement", "Abate", "Apostle", "Apprise", "Bevy", "Boor", "Bucolic", "Capricious", "Chauvinism", "Coffer", "Condone", "Contrite", "Credulous", "Demur", "Deride", "Diatribe", "Discordant", "Divest", "Effigy", "Elucidate", "Esoteric", "Frenetic", "Gall", "Galvanize", "Goad", "Gossamer", "Grandiloquent", "Imbue", "Immutable", "Irascible", "Laconic", "Largesse", "Leery", "Malign", "Maudlin", "Mire", "Modish", "Nascent", "Normative", "Opine", "Pallid", "Panache", "Penchant", "Plethora", "Qualm", "Quell", "Quotidian", "Salient", "Savant", "Stigma", "Tout", "Whet"],
    choices: [0, 0, 0, 0],

    makeRandWord: function () {
        //Generate a random number to choose word from word bank
        var RNGseed = Math.floor(Math.random() * game.wordBank.length);
        game.correctSeed = RNGseed;
        game.questionWord = game.wordBank[game.correctSeed];

        var arr = [];
        while (arr.length < 4) {
            var r = Math.floor(Math.random() * game.wordBank.length)
            if (arr.indexOf(r) === -1 && r !== game.correctSeed) arr.push(r);
        }
        game.choices = arr;

    },




    correctChoiceSelect: function () {
        //correct choice is the choice id that is the correct answer
        game.correctChoice = "answer" + parseInt(1 + Math.floor(Math.random() * 4));
    },

    definitionMode: function () {

    },

    synonymMode: function () {
        console.log("gamemode synonym")
        game.makeRandWord()
        $("#question").text(game.questionWord)

        dictionaryAPI.getDataSynonym(game.questionWord);


    },

    antonymMode: function () {
        game.makeRandWord()
        $("#question").text(game.questionWord)

        dictionaryAPI.getDataAntonym(game.questionWord);
    }

}

var dictionaryAPI = {
    result: {},
    definition: [],
    Qsynonym: "",
    Qantonym: "",
    synonyms: [],
    antonyms: [],

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

    getDataSynonym: function (word) {

        // fail case Salient
        $.ajax({
            url: "https://dictionaryapi.com/api/v3/references/thesaurus/json/" + word + "?key=202b8895-4b72-4bd2-8286-90efa368f523",
            method: "GET"
        }).done(function (data) {
            console.log("Synonym")
            console.log(data)
            // API result
            dictionaryAPI.result = data;

            //Check if synonym exists
            dictionaryAPI.synonyms = dictionaryAPI.result[0].meta.syns[0];
            if (dictionaryAPI.synonyms === undefined || dictionaryAPI.synonyms.length === 0) {
                game.synonymMode();
            } else {
                // creating choice table
                for (var i = 0; i < 4; i++) {
                    $("#answer" + (parseInt(i) + parseInt(1))).text(game.wordBank[game.choices[i]]);
                    $("#answer" + (parseInt(i) + parseInt(1))).on("click",function(){
                        console.log("wrong")
                        
                    })
                
                }
                //creating correct choice
                dictionaryAPI.Qsynonym = dictionaryAPI.synonyms[Math.floor(Math.random() * dictionaryAPI.synonyms.length)];
                game.correctChoiceSelect()
                $("#" + game.correctChoice).text(dictionaryAPI.Qsynonym);

                $("#"+game.correctChoice).off();
                $("#" + game.correctChoice).on("click", function () {
                    console.log("correct")

                })

            }
        });
    },

    getDataAntonym: function (word) {
        $.ajax({
            url: "https://dictionaryapi.com/api/v3/references/thesaurus/json/" + word + "?key=202b8895-4b72-4bd2-8286-90efa368f523",
            method: "GET"
        }).done(function (data) {
            console.log("Antonym")
            console.log(data)

            dictionaryAPI.result = data;
            dictionaryAPI.antonyms = dictionaryAPI.result[0].meta.ants[0];
            if (dictionaryAPI.antonyms === undefined || dictionaryAPI.antonyms.length === 0) {
                game.antonymMode();
            } else {
                for (var i = 0; i < 4; i++) {
                    $("#answer" + (parseInt(i) + parseInt(1))).text(game.wordBank[game.choices[i]]);
                }

                dictionaryAPI.Qantonym = dictionaryAPI.synonyms[Math.floor(Math.random() * dictionaryAPI.synonyms.length)];
                game.correctChoiceSelect()
                $("#" + game.correctChoice).text(dictionaryAPI.Qantonym);


            }
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

    //     <button data-target="modal1" class="btn modal-trigger" id="modalTest">Modal</button>



    $("#modalTest").on("click", function () {
        giphyAPI.createRewardImage("#gameReward", "reward")

    })


    $("#startBtn").on("click", function () {
        //begin game on select of game mode
        $("#gameDisplay").show();
        // $("#startBtn").hide();
        game.synonymMode();


    })



    // var carouselElem = document.querySelector(".carousel")


    // giphyAPI.createRewardImage("#gameWindow", "words");
    // wordsAPI.test();

    // dictionaryAPI.getDataThesaurus(game.wordBank[0])
    //will get definition
    // dictionaryAPI.result[0].shortdef[0]
    //Will get synonyms
    // dictionaryAPI.result[0].meta.syns[0]
    //Will get antonyms
    //dictionaryAPI.result[0].meta.ants[0]


    // autoplay()



})













