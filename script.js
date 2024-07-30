//global variables
const startBtn = document.getElementById("startBtn");
const chosenLevel = document.getElementById("chosenLevel");
const chosenTime = document.getElementById("chosenTime");
const mistakes = document.getElementById("mistakes");
const quoteContainer = document.querySelector("#quoteContainer");
const textarea = document.querySelector("textarea");
const stopBtn = document.getElementById("stopBtn");
const restartBtn = document.getElementById("restartBtn");
const result = document.getElementById("result");
const audio = new Audio("voices/click.wav");
//disable 3min for level hard
let testLevelBeforeStart = document.getElementById("testLevel");
testLevelBeforeStart.addEventListener("change", () => {
  if (testLevelBeforeStart.value == "hard") {
    //disabled 3min
    document
      .getElementById("disabledForHard")
      .setAttribute("disabled", "disabled");
  } else {
    document
      .getElementById("disabledForHard")
      .removeAttribute("disabled", "disabled");
  }
});
//start game
startBtn.addEventListener("click", function () {
  //the click sound
  audio.play();
  //get the testTime and level after click on startBtn
  const testTime = document.getElementById("testTime").value;
  const testLevel = document.getElementById("testLevel").value;
  //make the time and level showed in the sentence on top
  chosenLevel.textContent = testLevel;
  chosenTime.textContent = testTime;
  //make the quoteContainer empty
  quoteContainer.innerText = "";
  //somme text area controls
  textarea.removeAttribute("disabled");
  textarea.value = "";
  textarea.focus();
  backspaceControl(testLevel);
  //hidden the startBtn
  this.classList.add("hidden");
  //show the stopBtn
  stopBtn.classList.remove("hidden");
  //disable the select inputs
  document
    .querySelectorAll("select")
    .forEach((e) => e.setAttribute("disabled", "disabled"));
  document.querySelectorAll("select").forEach((e) => (e.style.cursor = "auto"));
  //call the principalFunction
  principalFunction(testTime, testLevel);
});
//backspace disabled on hard level
let textareaFirst; //this is for stocking the value before backspace
function backspaceControl(testLevel) {
  textarea.addEventListener("input", (e) => {
    if (testLevel == "hard") {
      //that is help when type the backspace at the first
      if (textarea.value[0] == undefined) {
        textarea.value = "" + textareaFirst;
      } else if (e.data != null) {
        textareaFirst = textarea.value;
      } else {
        textarea.value = textareaFirst;
      }
    }
  });
}

function principalFunction(testTime, testLevel) {
  let quoteLength = colorQuotes(testLevel);
  let time = document.getElementById("timing");
  time.innerText = testTime * 60;
  //increase the counter
  let timeController = setInterval(() => {
    if (time.innerText != 0) {
      time.innerText -= 1;
      //to get another quotes if time hasn't finished yet
      if (textarea.value.length >= quoteLength) {
        quoteLength += colorQuotes(testLevel);
        quoteContainer.scrollTo(0, 9999);
      }
      //to stop the game before time ends
      stopBtn.addEventListener("click", function () {
        //the click sound
        audio.play();
        clearInterval(timeController);

        textarea.setAttribute("disabled", "disabled");

        restartBtn.classList.remove("hidden");

        this.classList.add("hidden");
      });
      //reload the page to start again
      restartBtn.addEventListener("click", () => {
        window.location.reload();
      });
    } else {
      result.classList.remove("hidden");
      result.addEventListener("click", () => {
        //the click sound
        audio.play();
        results();
      });

      textarea.setAttribute("disabled", "disabled");

      stopBtn.classList.add("hidden");

      restartBtn.classList.remove("hidden");

      clearInterval(timeController);
    }
  }, 1000);
}
// this function get the quote and append it in quoteContainer
function randomQuotes(testLevel) {
  let quoteLetters =
    quotes[`${testLevel}`][
      Math.floor(Math.random() * quotes[`${testLevel}`].length)
    ].split("");
  quoteLetters.forEach((element) => {
    const span = document.createElement("span");
    span.innerText = element;
    quoteContainer.append(span);
  });
  return quoteLetters.length;
}
//this function makes the quote letters colorized ,calculate mistakes and show em in mistakes place
function colorQuotes(testLevel) {
  let quoteLength = randomQuotes(testLevel);
  textarea.addEventListener("input", function () {
    let spanQuoteCharters = quoteContainer.children; //list of span
    let textareaValue = textarea.value.split(""); //list of litters
    Array.from(spanQuoteCharters).forEach(function (element, index) {
      let charter = textareaValue[index]; //character from textarea that equals the quote litter
      if (charter == null) {
        element.classList.remove("true");
        element.classList.remove("false");
      } else if (element.innerText == charter) {
        element.classList.add("true");
        element.classList.remove("false");
      } else {
        element.classList.add("false");
        element.classList.remove("true");
      }
      mistakes.innerText = document.querySelectorAll(".false").length;
    });
  });
  return quoteLength;
}
//this function is for All types of results
function results() {
  let spanCorrectLetters = document.querySelector("#correct-letters");
  let correctLetters = document.querySelectorAll(".true").length;
  spanCorrectLetters.innerText = correctLetters;

  let spanIncorrectLetters = document.getElementById("incorrect-letters");
  let incorrectLetters = document.querySelectorAll(".false").length;
  spanIncorrectLetters.innerText = incorrectLetters;

  let spanLetters = document.getElementById("letters");
  let sommeLetters = correctLetters + incorrectLetters;
  spanLetters.innerText = sommeLetters;

  let quoteSpans = Array.from(quoteContainer.children);
  let wroteLetters = quoteSpans.filter(
    (e) => e.classList == "true" || e.classList == "false"
  );
  let wpm = document.getElementById("wpm");
  if (wroteLetters.length == 0) {
    wpm.innerText = "0";
  } else {
    let words = Array.from(wroteLetters)
      .map((e) => e.textContent)
      .join("")
      .split(" ");

    wpm.innerText = words.length / testTime.value;
  }

  let percentage = Math.floor((correctLetters / sommeLetters) * 100);
  let progressBar = document.getElementById("progressbar");
  progressBar.style.width = `${percentage}%`;
  progressBar.setAttribute("aria-valuenow", percentage);
  progressBar.innerText = `${percentage}%`;

  if (sommeLetters == 0) {
    let progress = document.querySelector(".progress");
    progress.classList.add("hidden");
  } else if (percentage <= 25) {
    progressBar.classList.add("bg-danger");
  } else if (percentage <= 50) {
    progressBar.classList.add("bg-warning");
  } else if (percentage <= 75) {
    progressBar.classList.add("bg-primary");
  } else {
    progressBar.classList.add("bg-success");
  }
}
let closBtn = document.getElementById("closeBtn");
closBtn.addEventListener("click", () => {
  window.location.reload();
  //the click sound
  audio.play();
});