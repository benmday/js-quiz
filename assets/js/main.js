const quizQuestions = [
  {
    question: "Which of the following is not a JavaScript data type?",
    choices: ["boolean", "count", "number", "string"],
    correctAnswer: "count",
  },
  {
    question: "How many '=' are required for two sides to be strictly equal to each other?",
    choices: ["1", "2", "3", "4"],
    correctAnswer: "3",
  },
  {
    question: "Which command will add an element to the end of an array?",
    choices: [".shift", ".unshift", ".pop", ".push"],
    correctAnswer: ".push",
  },
  {
    question: `True or false? Index 1 of the following array is Sunday: \n const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]`,
    choices: ["True", "False", "", ""],
    correctAnswer: "False",
},
{
    question: "What is the JavaScript command to select an HTML element by id?",
    choices: ["document.targetEl.id", "html.element.id", "document.getElementById", "html.getElementById"],
    correctAnswer: "document.getElementById",
},
];

let index = 0;
let choices = [];
let choicesDiv = [];
let question;

let leaderboard = [];

let checkAnswer;

let quizStart = false;

let timer = 50;
let score = 0;

const quiz = document.getElementById("quiz-card");
const timerEl = document.getElementById("time-left");

function startQuiz() {
    quiz.innerHTML = "";

    question = document.createElement("h2");
    question.setAttribute("class", "col-12");
    question.innerHTML = quizQuestions[index].question;
    quiz.appendChild(question);

    let choiceHolder = document.createElement("div");

    for(let i = 0; i < 4; i++){
        const eachChoice = document.createElement("button");
        const eachChoiceHolder = document.createElement("div");
        choices.push(eachChoice);
        choicesDiv.push(eachChoiceHolder);

        choices[i].textContent = quizQuestions[index].choices[i];
        choices[i].setAttribute('data-id', i);
        choices[i].setAttribute('class', 'btn col-3');
        choiceHolder.appendChild(choicesDiv[i]);
        choicesDiv[i].appendChild(choices[i]);
    }

    quiz.appendChild(choiceHolder);

    quiz.addEventListener("click", function(e){
        quizBtnHandler(e);
    });

    startTimer();

}

function startTimer(){
    quizStart = true;
    interval = setInterval(function(){
        if(quizStart == true){
            timer--;
            if(timer > 0){
                timerEl.innerHTML = timer;
            }else{
                timerEl.innerHTML = timer;
                clearInterval(interval);
                quizEnd("Time has run out!");
            }
        }
    }, 1000);
}

function quizEnd(condition){
    quiz.innerHTML = "";

    if(timer < 0){
        timer = 0;
        timerEl.innerHTML = timer;
    }

    let quizEndTitle = document.createElement("h2");
    if(condition == "time"){
        quizEndTitle.innerHTML = "Quiz ended, you ran out of time!";
    }else {
        quizEndTitle.innerHTML = "Quiz finished!";
    }
    quizEndTitle.setAttribute("class", "col-6");
    quiz.appendChild(quizEndTitle);

    let totalScore = (score * 10) + timer;

    let quizEndMessage = document.createElement("p");
    quizEndMessage.innerHTML = "You scored " + totalScore;
    quiz.appendChild(quizEndMessage);

    let scoreMessage = document.createElement("p");
    scoreMessage.innerHTML = "Enter your name on the leaderboard!";
    quiz.appendChild(scoreMessage);

    let finalScore = document.createElement("input");
    finalScore.setAttribute("type", "text");
    finalScore.setAttribute("id", "leaderboardInput");
    quiz.appendChild(finalScore);

    let saveScore = document.createElement("button");
    saveScore.innerHTML = "Save your score to the leaderboard!";
    saveScore.setAttribute("class", "btn btn-info");
    saveScore.setAttribute("onclick", "saveScoreHandler(event)");
    quiz.appendChild(saveScore);

    let retakeQuizDiv = document.createElement("div");
    retakeQuizDiv.setAttribute("class", "row justify-content-center");

    let retakeQuizBtn = document.createElement("button");
    retakeQuizBtn.innerHTML = "Retake Quiz";
    retakeQuizBtn.addEventListener("click", function(){
        location.reload();
    })
    retakeQuizBtn.setAttribute("class", "btn btn-info col-4");
    retakeQuizDiv.appendChild(retakeQuizBtn);
    quiz.appendChild(retakeQuizDiv);
    quiz.appendChild(checkAnswer);
}

function viewLeaderboard(){
    timerStarted = false;
    if(!document.getElementById("high-score-title")){
        quiz.innerHTML = "<h2 id='high-score-title'>Leaderboard:</h2>";

        getLeaderboard();

        leaderboard.sort((a,b)=>{
            if(a.scoreResult > b.scoreResult){
                return -1;
            } else {
                return 1;
            }
        });

        for(var i = 0; i < leaderboard.length; i++){
            var scoreDiv = document.createElement("div");
            scoreDiv.setAttribute("class", "row justify-content-center");
            var p = document.createElement("p");
            p.innerHTML = leaderboard[i].name + " | " + leaderboard[i].scoreResult;
            p.setAttribute("class", "highscore-text col-3");
            quiz.appendChild(scoreDiv);
            scoreDiv.appendChild(p);
        }

        var goBackDiv = document.createElement("div");
        goBackDiv.setAttribute("class", "row justify-content-center");

        var goBackBtn = document.createElement("button");
        goBackBtn.innerHTML = "Go Back";
        goBackBtn.addEventListener("click", function(){
            location.reload();
        });
        goBackBtn.setAttribute("class", "btn btn-info col-3");
        goBackDiv.appendChild(goBackBtn);
        quiz.appendChild(goBackDiv);
    }
}

function nextQuestion(correct){
    if(!checkAnswer){
        checkAnswer = document.createElement("div");
        checkAnswer.setAttribute("id", "ans-validate-div");
        checkAnswer.setAttribute("class", "col-6 justify-self-center");
        quiz.appendChild(checkAnswer);
    }
    
    if(correct == true){
        checkAnswer.innerHTML = "Your answer is correct!";

        index++;

        if(!quizQuestions[index]){
            quizEnd();
            clearInterval(interval);
            return;
        }

        for(let i = 0; i < 4; i++){
            let btn = document.querySelector("button[data-id='" + i + "']");
            btn.innerHTML = quizQuestions[index].choices[i];
    
            question.innerHTML = quizQuestions[index].question;
        }
    } else if(correct == false){
        checkAnswer.innerHTML = "Incorrect! The right answer was: " + quizQuestions[index].correctAnswer;
        timer = timer - 10;

        index++;
        
        if(!quizQuestions[index]){
            quizEnd();
            clearInterval(interval);
            return;
        }
        for(let i = 0; i < 4; i++){
            let btn = document.querySelector("button[data-id='" + i + "']");
            btn.innerHTML = quizQuestions[index].choices[i];
    
            question.innerHTML = quizQuestions[index].question;
        }
    }
}

function quizBtnHandler(event){
    let targetEl = event.target;

    if(targetEl.hasAttribute("data-id")){

        if(targetEl.innerHTML == quizQuestions[index].correctAnswer){
            score++;
            nextQuestion(true);
        }
        else if(targetEl.type === "submit"){
            nextQuestion(false);
        }
    }
}

function saveScoreHandler(e){
    let scoreInput = document.getElementById("leaderboardInput");
    e.target.innerHTML = "Get on the leaderboard! Please enter your name:"

    let scoreInputVal = scoreInput.value;

    let leaderboardEntry = {
        name: scoreInputVal,
        scoreResult: (score * 10) + timer        
    }

    getLeaderboard();

    leaderboard.push(leaderboardEntry);
    
    localStorage.setItem("leaderboardStorage", JSON.stringify(leaderboard));
    
    e.target.innerHTML = "Score saved";
    e.target.setAttribute("onclick", "");

    quiz.removeChild(document.getElementById("leaderboardInput"));
}

function getLeaderboard(){
    if(!leaderboard[0]){
        let savedScores = localStorage.getItem("leaderboardStorage");
        
        if(!savedScores){
            return false;
        }

        savedScores = JSON.parse(savedScores);

        for(let i = 0; i < savedScores.length; i++){
            leaderboard.push(savedScores[i]);
        }
    }
}

document.getElementById("start-button").addEventListener("click", startQuiz);