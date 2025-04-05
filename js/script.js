// We are using jQuery - References used in the creation of this script are at the top of index.html


// This loads our menu and footer templates into the main pages to avoid duplication
// Added menu highlight for the current page, but had to nest the load delay function for .nav-link
// Added aria-current attribute to the menu for the current page for accessibility
$(document).ready(function () {
    $('#header').load('/header.html');
    $('#menu').load('/menu.html', function() {
        $('.nav-link').each(function () {
            if (this.href === window.location.href) {
              $(this).addClass('active');
              $(this).attr('aria-current', 'page');
            }
          });
    });
    $('#footer').load('/footer.html');
});



// Logic to call api: api.postcodes.io/postcodes/ and lookup a UK postcode input
async function findPostcode() {
    const postcode = $("#postcode").val();
    const url = "https://api.postcodes.io/postcodes/?q=" + postcode;

    const cityElement = $("#city");
    const countryElement = $("#country");

    try {
        const response = await $.getJSON(url);
        if (response.result && response.result.length > 0) {
            const result = response.result[0];
            const city = result.nuts;
            const country = result.country;

            cityElement.val(city).css({ color: "green" });
            countryElement.val(country).css({ color: "green", fontWeight: "bold" });
        } else {
            cityElement.val("No UK results found for this postcode.")
                .css({ color: "red"});
            countryElement.val("Elsewhere").css({ color: "green", fontWeight: "bold" });
        }
    } catch (error) {
        cityElement.val("Error fetching postcode data.")
            .css({ color: "red", fontWeight: "bold" });
        console.error(error);
    }
}


// Quiz Functionality Section

// Initiates the currentQuestion and quizData variables
//let quizData = [];
//let currentQuestion = {};

// Get and display a random question
function displayRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * quizData.length);
    currentQuestion = quizData[randomIndex];
    $("#questionLabel").text(currentQuestion.question);
    // Clear any old input or answers
    $("#userAnswer").val("");
    $("#answerLabel").css({ color: "black", fontWeight: "normal" });
    $("#answerLabel").text("Click 'Submit' to see if you are correct");
}

// Check the users answer and format the resulting text accordingly
function checkAnswer() {
    if ($("#userAnswer").val() == currentQuestion.answer) {
        $("#answerLabel").css({ color: "green", fontWeight: "bold" });
        $("#answerLabel").text("Nicely done! You are correct!");
    }
    else {
        $("#answerLabel").css({ color: "red", fontWeight: "bold" });
        $("#answerLabel").text("You are incorrect, the answer is " + currentQuestion.answer + ". Try another question.");
    }
}

// This loads the quizdata from a JSON file and presents a random question on page initiation
$(document).ready(function () {
    $.getJSON("data/quizdata.json", function (data) {
        quizData = data;
        if (quizData.length > 0) {
            displayRandomQuestion();
        }
    });
});