var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var playerPattern = [];

var isGameRunning = false;
var isPlayersTurn = true;

// On button click of all four color buttons
$(".btn").on("click", function () {
  // Only lets button be pressed it is the players turn
  if (!isPlayersTurn) return;

  var pressedButton = $(this);
  var pressedButtonColor = pressedButton.attr("id");

  // Makes the button blink and play a sound
  pressedButton.addClass("pressed");

  setTimeout(() => {
    pressedButton.removeClass("pressed");
  }, 50);

  var audio = new Audio("sounds/" + pressedButtonColor + ".mp3");
  audio.play();

  // Only checks if the game is running (So the player is able to play around with the buttons before the game starts)
  if (!isGameRunning) return;
  playerPattern.push(pressedButtonColor);
  checkIfCorrect();
});

/**
 * Adds the next color of the game pattern and previews it
 */
function nextSequence() {
  // Turns off the player controls
  isPlayersTurn = false;

  $("#level-title").text("Simon says:");

  // Chooses the next color in pattern
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];

  gamePattern.push(randomChosenColour);

  // Previews the next color with a blink and a sound, then, after 500 milliseconds, lets the player play.
  setTimeout(() => {
    $("." + randomChosenColour)
      .fadeOut(100)
      .fadeIn(100);

    var audio = new Audio("sounds/" + randomChosenColour + ".mp3");
    audio.play();

    setTimeout(() => {
      startPlayersTurn();
    }, 500);
  }, 500);
}

/**
 * Starts the player's turn
 */
function startPlayersTurn() {
  $("#level-title").text("Your turn:");

  // Resets the player's pattern
  playerPattern = [];

  // Lets the player play
  isPlayersTurn = true;
}

/**
 * Checks if the player's pattern is correct agains the current game pattern, if not, then it's game over buddy.
 */
function checkIfCorrect() {
  // Gets the current "turn" by subtracting the player's pattern length by 1, so it can be used to check the position of both patterns
  var currentTurn = playerPattern.length - 1;

  // If the player button presses are correct until both patterns are the exact same, the game moves on to the next sequence in 1 second, else, it's game over buddy.
  if (playerPattern[currentTurn] !== gamePattern[currentTurn]) {
    gameOver();
  } else if (playerPattern.length === gamePattern.length) {
    setTimeout(() => {
      nextSequence();
    }, 1000);
  }
}

/**
 * Handles the "game over" state of the game.
 */
function gameOver() {
  var audio = new Audio("sounds/wrong.mp3");
  audio.play();

  // Resets all patterns and disables the player's controls.
  gamePattern = [];
  playerPattern = [];
  isPlayersTurn = false;

  $("#level-title").text("You lose!");

  // After 2 seconds, lets the player start again if they wish to do so.
  setTimeout(() => {
    $("#level-title").text("Press any key to try again!");
    isGameRunning = false;
    isPlayersTurn = true;
  }, 2000);
}

// If any key is pressed, the game will start in 2 seconds so the player can get a bit of leway before it gets going.
$(document).on("keypress", function () {
  if (isGameRunning === true) return;

  $("#level-title").text("Starting game!");

  isGameRunning = true;
  setTimeout(() => {
    nextSequence();
  }, 2000);
});
