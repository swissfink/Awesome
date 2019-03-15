
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBY5Uu1qg5YPy0YR_9JnJtzYPMTZJFicug",
    authDomain: "awesomewordgame.firebaseapp.com",
    databaseURL: "https://awesomewordgame.firebaseio.com",
    projectId: "awesomewordgame",
    storageBucket: "",
    messagingSenderId: "673494931637"
};

firebase.initializeApp(config);
var database = firebase.database();

// Updating highscores table for each mode
database.ref("/defscores").limitToLast(1).on("child_added", function (snapshot) {
    //Updating top 5 high scores for definition

    $("#defHighScores").empty();
    database.ref("/defscores").orderByChild("score").limitToLast(5).once("value").then(function (snapshot) {

        snapshot.forEach(function (childSnapshot) {
            var newRow = $("<tr>");
            var usernameCol = $("<td>");
            var scoreCol = $("<td>");

            usernameCol.text(childSnapshot.val().username);
            scoreCol.text(childSnapshot.val().score);

            newRow.append(usernameCol, scoreCol);

            $("#defHighScores").prepend(newRow);
        })
    })
})

database.ref("/synscores").limitToLast(1).on("child_added", function (snapshot) {
    //Updating top 5 high scores for synonym

    $("#synHighScores").empty();
    database.ref("/synscores").orderByChild("score").limitToLast(5).once("value").then(function (snapshot) {

        snapshot.forEach(function (childSnapshot) {
            var newRow = $("<tr>");
            var usernameCol = $("<td>");
            var scoreCol = $("<td>");

            usernameCol.text(childSnapshot.val().username);
            scoreCol.text(childSnapshot.val().score);

            newRow.append(usernameCol, scoreCol);

            $("#synHighScores").prepend(newRow);
        })
    })
})

database.ref("/antscores").limitToLast(1).on("child_added", function (snapshot) {
    //Updating top 5 high scores for antonym

    $("#antHighScores").empty();
    database.ref("/antscores").orderByChild("score").limitToLast(5).once("value").then(function (snapshot) {

        snapshot.forEach(function (childSnapshot) {
            var newRow = $("<tr>");
            var usernameCol = $("<td>");
            var scoreCol = $("<td>");

            usernameCol.text(childSnapshot.val().username);
            scoreCol.text(childSnapshot.val().score);

            newRow.append(usernameCol, scoreCol);

            $("#antHighScores").prepend(newRow);
        })
    })
})





var game = {
    //global variables for the game
    correctChoice: "",
    RNGseed: 0,
    correctSeed: 0,
    questionWord: "",
    scorePath: "/defscores",
    score: 0,
    life: 3,

    challengeMode: false,
    //the word bank currently GRE words
    wordBank: ["Aberration", "Abreast", "Abstain", "Agog", "Alturism", "Apathy", "Audacious", "Blithe", "Burlesque", "Cacophony", "Confound", "Docile", "Doff", "Dote", "Endow", "Ephemeral", "Facetious", "Fallow", "Flail", "Forage", "Garner", "Gossamer", "Grovel", "Harangue", "Impetuous", "Inert", "Ingrate", "Insipid", "Lax", "Lurid", "Mirth", "Morose", "Oblique", "Opaque", "Overwrought", "Pertain", "Placate", "Plethora", "Pyre", "Reticence", "Ruminate", "Stigma", "Sublime", "Syncopation", "Tawdry", "Terse", "Torrid", "Transgression", "Vapid", "Vestige", "Waft", "Whittle", "Abasement", "Abate", "Apostle", "Apprise", "Bevy", "Boor", "Bucolic", "Capricious", "Chauvinism", "Coffer", "Condone", "Contrite", "Credulous", "Demur", "Deride", "Diatribe", "Discordant", "Divest", "Effigy", "Elucidate", "Esoteric", "Frenetic", "Gall", "Galvanize", "Goad", "Gossamer", "Grandiloquent", "Imbue", "Immutable", "Irascible", "Laconic", "Largesse", "Leery", "Malign", "Maudlin", "Mire", "Modish", "Nascent", "Normative", "Opine", "Pallid", "Panache", "Penchant", "Plethora", "Qualm", "Quell", "Quotidian", "Salient", "Savant", "Stigma", "Tout", "Whet"],
    // random wrong choices to fill in the choice table
    choices: [0, 0, 0, 0],

    makeRandWord: function () {
        //Generate a random number to choose word from word bank
        var RNGseed = Math.floor(Math.random() * game.wordBank.length);
        game.correctSeed = RNGseed;
        game.questionWord = game.wordBank[game.correctSeed];

        //fill in the choices table
        var arr = [];
        while (arr.length < 4) {
            var r = Math.floor(Math.random() * game.wordBank.length)
            if (arr.indexOf(r) === -1 && r !== game.correctSeed) { arr.push(r) };
        }
        game.choices = arr;

    },

    correctChoiceSelect: function () {
        //correct choice is the choice id that is the correct answer
        game.correctChoice = "answer" + parseInt(1 + Math.floor(Math.random() * 4));
    },

    definitionMode: function () {
        console.log("gamemode definition")
        game.makeRandWord()
        dictionaryAPI.getDataDefinition(game.questionWord)
    },

    synonymMode: function () {
        console.log("gamemode synonym")
        game.makeRandWord()
        $("#question").text(game.questionWord)
        dictionaryAPI.getDataSynonym(game.questionWord);
    },

    antonymMode: function () {
        console.log("gamemode antonym")
        game.makeRandWord()
        $("#question").text(game.questionWord)
        dictionaryAPI.getDataAntonym(game.questionWord);
    },



    statsReset: function () {
        game.score = 0;
        game.life = 3;
    },

    createNextButton: function (gamemode) {
        var nextQuestionButton = $("<button>").text("Next Question")
        nextQuestionButton.addClass("nextQuestionButton")
        $("#gameWindow").append(nextQuestionButton)
        $(".nextQuestionButton").on("click", function () {
            console.log("next")
            gamemode();
            $(this).remove();
            $(".choiceBtn").attr("disabled", false)

        })
    },

    submitScore: function (userName, score, gamemodePath) {
        //gamemodePath take string in form "/gamemode"+"scores" example: "/defscores"
        database.ref(gamemodePath).push({
            "username": userName,
            "score": score
        })
    }
}

var dictionaryAPI = {
    result: {},
    definition: [],
    Qsynonym: "",
    Qantonym: "",
    synonyms: [],
    antonyms: [],

    getDataDefinition: function (word) {
        $.ajax({
            url: "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=b4c85922-0be5-4246-8023-ee0594629f97",
            method: "GET"
        }).done(function (data) {
            dictionaryAPI.result = data;
            console.log(data)
            console.log("definition")
            //Question as definition
            $("#question").text(dictionaryAPI.result[0].shortdef[0])
            $(".choiceBtn").off()
            // creating choice table
            for (var i = 0; i < 4; i++) {
                $("#answer" + (parseInt(i) + parseInt(1))).text(game.wordBank[game.choices[i]]);
                $("#answer" + (parseInt(i) + parseInt(1))).on("click", function () {
                    $(".choiceBtn").attr("disabled", true)

                    console.log("wrong")
                    $("#startBtn").show();
                    $("#gameResult").empty();
                    var newP = $("<p>").text("You are Incorrect!").text("The answer was " + game.questionWord);
                    $("#gameResult").append(newP);
                    giphyAPI.createRewardImage("#gameResult", "fail", giphyAPI.offsetRNG(10));


                    if (game.challengeMode) {
                        game.life--;
                        $("#life").text(game.life)
                        if (game.life == 0) {
                            $("#gameoverDisplay").show()
                            game.scorePath = "/defscores"

                        } else {
                            game.createNextButton(game.definitionMode);

                        }
                    } else {
                        game.createNextButton(game.definitionMode);

                    }
                })
            }

            game.correctChoiceSelect();

            $("#" + game.correctChoice).text(game.questionWord);
            $("#" + game.correctChoice).off();
            $("#" + game.correctChoice).on("click", function () {
                $(".choiceBtn").attr("disabled", true)

                console.log("correct")
                $("#startBtn").show();
                $("#gameResult").empty();

                var newP = $("<p>").text("You are Correct!");
                $("#gameResult").append(newP);
                giphyAPI.createRewardImage("#gameResult", "reward", giphyAPI.offsetRNG(10));

                game.createNextButton(game.definitionMode);

                if (game.challengeMode) {
                    game.score++;
                    $("#score").text(game.score);
                }
            })

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
            // dictionaryAPI.result = data;

            //Check if synonym exists
            // dictionaryAPI.synonyms = dictionaryAPI.result[0].meta.syns[0];
            // console.log(data[0].meta.syns[0])
            if (data.length > 5) {
                game.synonymMode();
            } else {
                $(".choiceBtn").off()
                dictionaryAPI.synonyms = data[0].meta.syns[0];
                dictionaryAPI.Qsynonym = dictionaryAPI.synonyms[Math.floor(Math.random() * dictionaryAPI.synonyms.length)];

                // creating choice table

                for (var i = 0; i < 4; i++) {

                    $("#answer" + (parseInt(i) + parseInt(1))).text(game.wordBank[game.choices[i]]);
                    $("#answer" + (parseInt(i) + parseInt(1))).on("click", function () {
                        $(".choiceBtn").attr("disabled", true)

                        console.log("wrong")
                        $("#startBtn").show();
                        $("#gameResult").empty();
                        var newP = $("<p>").text("You are Incorrect! The answer was " + dictionaryAPI.Qsynonym)
                        $("#gameResult").append(newP)
                        giphyAPI.createRewardImage("#gameResult", "fail", giphyAPI.offsetRNG(10))

                        if (game.challengeMode) {
                            game.life--;
                            $("#life").text(game.life)

                            if (game.life == 0) {
                                $("#gameoverDisplay").show()
                                game.scorePath = "/synscores"


                            } else {
                                game.createNextButton(game.synonymMode);

                            }

                        } else {
                            game.createNextButton(game.synonymMode);

                        }
                    })

                }
                //creating correct choice
                // if (dictionaryAPI.synonyms.length > 1) {
                //     dictionaryAPI.Qsynonym = dictionaryAPI.synonyms[0][Math.floor(Math.random() * dictionaryAPI.synonyms.length)];
                //     game.correctChoiceSelect()
                //     $("#" + game.correctChoice).text(dictionaryAPI.Qsynonym);

                //     $("#" + game.correctChoice).off();
                //     $("#" + game.correctChoice).on("click", function () {
                //         console.log("correct")
                //         $("#startBtn").show();
                //         $("#gameResult").empty();

                //         var newP = $("<p>").text("You are Correct!")
                //         $("#gameResult").append(newP)
                //         giphyAPI.createRewardImage("#gameResult", "reward")

                //         game.createNextButton(game.synonymMode);

                //         if (game.challengeMode) {
                //             game.score++;
                //         }
                //     })
                // } else {
                game.correctChoiceSelect()
                $("#" + game.correctChoice).text(dictionaryAPI.Qsynonym);

                $("#" + game.correctChoice).off();
                $("#" + game.correctChoice).on("click", function () {
                    $(".choiceBtn").attr("disabled", true)

                    console.log("correct")
                    $("#startBtn").show();
                    $("#gameResult").empty();

                    var newP = $("<p>").text("You are Correct!")
                    $("#gameResult").append(newP)
                    giphyAPI.createRewardImage("#gameResult", "reward", giphyAPI.offsetRNG(10))
                    game.createNextButton(game.synonymMode);

                    if (game.challengeMode) {
                        game.score++;
                        $("#score").text(game.score)

                    }
                })
                // }
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

            if (data.length > 5) {
                game.antonymMode();
            } else {
                dictionaryAPI.antonyms = data[0].meta.ants[0];
                dictionaryAPI.Qantonym = dictionaryAPI.antonyms[Math.floor(Math.random() * dictionaryAPI.synonyms.length)];

                $(".choiceBtn").off()
                for (var i = 0; i < 4; i++) {
                    $("#answer" + (parseInt(i) + parseInt(1))).text(game.wordBank[game.choices[i]]);
                    $("#answer" + (parseInt(i) + parseInt(1))).on("click", function () {
                        $(".choiceBtn").attr("disabled", true)
                        console.log("wrong")
                        $("#startBtn").show();
                        $("#gameResult").empty();
                        var newP = $("<p>").text("You are Incorrect! The answer was " + dictionaryAPI.Qantonym)
                        $("#gameResult").append(newP)
                        giphyAPI.createRewardImage("#gameResult", "fail", giphyAPI.offsetRNG(10))
                        if (game.challengeMode) {
                            game.life--;
                            $("#life").text(game.life)

                            if (game.life == 0) {
                                $("#gameoverDisplay").show()
                                game.scorePath = "/antscores"


                            } else {
                                game.createNextButton(game.antonymMode);
                            }
                        } else {
                            game.createNextButton(game.antonymMode);
                        }


                    })

                }

                // if (dictionaryAPI.antonyms.length > 1) {
                //     dictionaryAPI.Qantonym = dictionaryAPI.antonyms[0][Math.floor(Math.random() * dictionaryAPI.synonyms.length)];
                //     game.correctChoiceSelect()
                //     $("#" + game.correctChoice).text(dictionaryAPI.Qantonym);
                //     $("#" + game.correctChoice).on("click", function () {
                //         console.log("correct")
                //         $("#startBtn").show();
                //         $("#gameResult").empty();


                //         var newP = $("<p>").text("You are Correct!")
                //         $("#gameResult").append(newP)
                //         giphyAPI.createRewardImage("#gameResult", "reward")

                //         game.createNextButton(game.antonymMode);

                //         if (game.challengeMode) {
                //             game.score++;
                //         }
                //     })
                // } 
                // else 
                // {

                game.correctChoiceSelect()
                $("#" + game.correctChoice).text(dictionaryAPI.Qantonym);
                $("#" + game.correctChoice).off();
                $("#" + game.correctChoice).on("click", function () {
                    console.log("correct")
                    $("#startBtn").show();
                    $("#gameResult").empty();
                    var newP = $("<p>").text("You are Correct!")
                    $("#gameResult").append(newP)
                    giphyAPI.createRewardImage("#gameResult", "reward", giphyAPI.offsetRNG(10))

                    game.createNextButton(game.antonymMode);

                    if (game.challengeMode) {
                        game.score++;
                        $("#score").text(game.score)
                    }
                })
                // }
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

    createRewardImage: function (appendLocation, topic, offset) {
        $.ajax({
            url: giphyAPI.makeQueryURL(giphyAPI.api_key, topic, "1", "", offset),
            method: "GET"
        }).then(function (response) {
            var newImage = $("<img>");
            newImage.attr("src", response.data[0].images.fixed_height.url);
            $(appendLocation).append(newImage)

        });
    },

    offsetRNG: function (limit) {
        var offsetSeed = Math.floor(Math.random() * limit)
        return offsetSeed
    }

}

$(document).ready(function () {
    $('.tap-target').tapTarget();
});


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

    //materialize initialization
    $("#gameMode").carousel()
    $('#demo-carousel').carousel();
    $('.modal').modal();
    $('.tabs').tabs();
    M.updateTextFields();





    $("#defModePractice").on("click", function () {
        game.definitionMode();
        game.challengeMode = false;
        $("#modeInstructions").hide();
        $("#gameDisplay").show();
        $("#gameMode").hide();
        $("#challengeStats").hide();


    })

    $("#synModePractice").on("click", function () {
        game.synonymMode();
        game.challengeMode = false;

        $("#modeInstructions").hide();
        $("#gameDisplay").show();
        $("#gameMode").hide();
        $("#challengeStats").hide();


    })


    $("#antModePractice").on("click", function () {
        game.antonymMode();
        game.challengeMode = false;

        $("#modeInstructions").hide();
        $("#gameDisplay").show();
        $("#gameMode").hide();
        $("#challengeStats").hide();


    })

    $("#defModeChallenge").on("click", function () {
        game.definitionMode();
        game.challengeMode = true;

        $("#modeInstructions").hide();
        $("#gameDisplay").show();
        $("#gameMode").hide();
        $("#challengeStats").show();


    })

    $("#synModeChallenge").on("click", function () {
        game.synonymMode();
        game.challengeMode = true;

        $("#modeInstructions").hide();
        $("#gameDisplay").show();
        $("#gameMode").hide();
        $("#challengeStats").show();
    })


    $("#antModeChallenge").on("click", function () {
        game.antonymMode();
        game.challengeMode = true;
        $("#modeInstructions").hide();
        $("#gameDisplay").show();
        $("#gameMode").hide();
        $("#challengeStats").show();

    })

    // Stuff Richard Added

    // Restart Button 
    $("#restartGame").on("click", function () {
        $("#scoreEnter").attr("disabled", false)
        $("#modeInstructions").show();
        $("#gameDisplay").hide();
        $("#gameMode").show();
        $(".nextQuestionButton").remove();
        $(".choiceBtn").attr("disabled", false);
        $("#gameoverDisplay").hide();
        $("#scoreEnter").attr("disabled", false);
        $("#scoreEnter").text("Submit Your Score");

        game.statsReset();

    })

    // Triggers the modal to submit high score
    $("#scoreEnter").on("click", function () {
        $("#userScore").text(game.score)
        $("#scoreSubmit").attr("disabled", false)

        // var textOne = $("<div>");
        // textOne.text("Ok. You gave it the good ole college try.");
        // var textTwo = $("<div>");
        // textTwo.text("How about you give it another go?")
        // var textThree = $("<div>");
        // textThree.text("Let's see if you can get a high score.");
        // var textFour = $("<div>");
        // textFour.text("C'mon. We know you can do it!");
        // var textFive = $("<div>")
        // textFive.text("Your Final Score is: "+game.score)

        // var scoreForm = $("<form>")


        // $("#scoreForm").append(textOne,textTwo,textThree,textFour,textFive,scoreForm).addClass("lowScore");
    })


    //Submiting highscore
 



    $("#scoreSubmit").on("click", function (event) {
        event.preventDefault();

        var username = $("#usernameInput").val().trim();

        if (username !== "") {
            game.submitScore(username, game.score, game.scorePath)
            $("#scoreEnter").attr("disabled", true)
            $(this).attr("disabled", true)
            $("#scoreEnter").text("Score Entered")
            $("#inputError").text("")
            $("#usernameInput").val("")
        } else {
            $("#inputError").text("Please Enter a Username.")
        }
    })


    //Creating Full highscore table

    $("#defHSFullLink").on("click", function () {

        $("#defHighScoresFull").empty();

        database.ref("/defscores").orderByChild("score").once("value").then(function (snapshot) {

            snapshot.forEach(function (childSnapshot) {
                var newRow = $("<tr>");
                var usernameCol = $("<td>");
                var scoreCol = $("<td>");

                usernameCol.text(childSnapshot.val().username);
                scoreCol.text(childSnapshot.val().score);

                newRow.append(usernameCol, scoreCol);

                $("#defHighScoresFull").prepend(newRow);
            })
        })


    })

    $("#synHSFullLink").on("click", function () {

        $("#synHighScoresFull").empty();

        database.ref("/synscores").orderByChild("score").once("value").then(function (snapshot) {

            snapshot.forEach(function (childSnapshot) {
                var newRow = $("<tr>");
                var usernameCol = $("<td>");
                var scoreCol = $("<td>");

                usernameCol.text(childSnapshot.val().username);
                scoreCol.text(childSnapshot.val().score);

                newRow.append(usernameCol, scoreCol);

                $("#synHighScoresFull").prepend(newRow);
            })
        })


    })

    $("#antHSFullLink").on("click", function () {

        $("#antHighScoresFull").empty();

        database.ref("/antscores").orderByChild("score").once("value").then(function (snapshot) {

            snapshot.forEach(function (childSnapshot) {
                var newRow = $("<tr>");
                var usernameCol = $("<td>");
                var scoreCol = $("<td>");

                usernameCol.text(childSnapshot.val().username);
                scoreCol.text(childSnapshot.val().score);

                newRow.append(usernameCol, scoreCol);

                $("#antHighScoresFull").prepend(newRow);
            })
        })


    })



    // Instruction FeatureDiscovery Function


    //Antonym Mode


    $("#pic1").click(function () {
        $(".antText").show();

    });

    $("#pic1").click(function () {
        $(".synText").hide();
    });

    $("#pic1").click(function () {
        $(".defText").hide();
    });

    //Synonym Mode
    $("#pic2").click(function () {
        $(".antText").hide();
    });

    $("#pic2").click(function () {
        $(".synText").show();
    });

    $("#pic2").click(function () {
        $(".defText").hide();
    });

    //Defnition Mode
    $("#pic3").click(function () {
        $(".antText").hide();
    });

    $("#pic3").click(function () {
        $(".synText").hide();
    });

    $("#pic3").click(function () {
        $(".defText").show();
    });

})





