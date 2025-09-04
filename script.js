const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const saveScoreBtn = document.getElementById("save-score-btn");
const playerNameInput = document.getElementById("player-name");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const timeSpan = document.getElementById("time");
const highscoreList = document.getElementById("highscoreList");

const questions = [
  { question: "Which keyword declares a constant in JS?", answers: ["let","const","var","static"], correct:"const" },
  { question: "What does DOM stand for?", answers:["Document Object Model","Data Object Management","Digital Ordinance Model","Desktop Oriented Mode"], correct:"Document Object Model" },
  { question: "Which operator checks strict equality in JS?", answers:["=","==","===","!="], correct:"===" },
  { question: "In SQL, which keyword sorts results?", answers:["SORT BY","ORDER BY","GROUP BY","ALIGN BY"], correct:"ORDER BY" },
  { question: "Which language runs in a browser?", answers:["Python","Java","C#","JavaScript"], correct:"JavaScript" },
  { question: "What is a closure in JS?", answers:["Function with preserved scope","Loop","Variable","Object"], correct:"Function with preserved scope" },
  { question: "Which is a CSS framework?", answers:["Laravel","Bootstrap","React","Node.js"], correct:"Bootstrap" },
  { question: "Which symbol selects an ID in CSS?", answers:[".","#","$","@"], correct:"#"},
  { question: "What does API stand for?", answers:["Application Programming Interface","Active Page Index","Application Page Info","All Programming Included"], correct:"Application Programming Interface"},
  { question: "Which HTML tag inserts a line break?", answers:["<br>","<lb>","<break>","<line>"], correct:"<br>"}
];

let score = 0;
let currentQuestionIndex = 0;
let timeLeft = 15;
let timer;

totalQuestionsSpan.textContent = questions.length;
maxScoreSpan.textContent = questions.length;

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", restartQuiz);
saveScoreBtn.addEventListener("click", saveHighscore);

let shuffledQuestions = [];

function startQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  scoreSpan.textContent = 0;

  // Ανακάτεμα των ερωτήσεων
  shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");
  playerNameInput.value = "";

  loadQuestion();
}
function loadQuestion(){
  if(currentQuestionIndex >= shuffledQuestions.length){
    endQuiz();
    return;
  }
  timeLeft = 15;
  timeSpan.textContent = timeLeft;
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);

  const q = shuffledQuestions[currentQuestionIndex];
  questionText.textContent = q.question;
  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  answersContainer.innerHTML = "";
  const shuffledAnswers = [...q.answers].sort(() => Math.random() - 0.5);

  shuffledAnswers.forEach(a => {
    const btn = document.createElement("button");
    btn.innerText = a;
    btn.onclick = () => checkAnswer(a);
    answersContainer.appendChild(btn);
  });
}

function updateTimer(){
  timeLeft--;
  timeSpan.textContent = timeLeft;
  if(timeLeft<=0){
    clearInterval(timer);
    nextQuestion();
  }
}

function checkAnswer(ans){
  let q = questions[currentQuestionIndex];
  clearInterval(timer);
  Array.from(answersContainer.children).forEach(btn=>{
    if(btn.innerText === q.correct) btn.classList.add("correct");
    if(btn.innerText === ans && ans!==q.correct) btn.classList.add("incorrect");
  });
  if(ans===q.correct) score++;
  scoreSpan.textContent = score;
  setTimeout(nextQuestion, 1000);
}

function nextQuestion(){
  currentQuestionIndex++;
  loadQuestion();
}

function endQuiz(){
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");
  finalScoreSpan.textContent = score;
  if(score===questions.length) resultMessage.textContent="Perfect! You're a genius!";
  else if(score>=8) resultMessage.textContent="Great job!";
  else if(score>=5) resultMessage.textContent="Good effort!";
  else resultMessage.textContent="Keep practicing!";
  showHighscores();
}

function restartQuiz(){
  resultScreen.classList.remove("active");
  startScreen.classList.add("active");
}

function saveHighscore(){
  const name = playerNameInput.value.trim() || "Anonymous";
  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];

  // Προσθήκη νέου σκορ
  highscores.push({ name: name, score: score });

  // Ταξινόμηση από το μεγαλύτερο στο μικρότερο
  highscores.sort((a,b) => b.score - a.score);

  // Κράτησε μόνο τα 5 πρώτα
  const topScores = highscores.slice(0,5);

  // Αποθήκευση πίσω στο localStorage
  localStorage.setItem("highscores", JSON.stringify(topScores));

  showHighscores();
}


function showHighscores(){
  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  highscoreList.innerHTML = "";

  highscores.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1}: ${entry.name} - ${entry.score} points`;
    highscoreList.appendChild(li);
  });
}


showHighscores();
