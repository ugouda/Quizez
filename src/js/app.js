let API = 'https://opentdb.com/api.php?amount=10&category=18&type=multiple';

let questions = document.querySelector('.question');
let questionIndex = document.querySelector('.questions h5 .index');
let data, completeOptions;
let i = 0;
let next = document.querySelector('.next');
let optionButtons = document.querySelectorAll('.options')
let corrAnsCount = 0, wrongAnsCount = 0;
let mainDiv = document.getElementById('mainDiv');
let scoreDiv = document.getElementById('score')
// btnClass = 'options btn btn-success w-100'
let scoreP = document.getElementById('scoreP');
let restartBtn = document.getElementById('restart');

const dispScore = () => {
  scoreP.innerHTML = `You have scored ${corrAnsCount} out of ${data.results.length}`
  localStorage.clear;
  localStorage.setItem('Total Questions', data.results.length)
  localStorage.setItem('Correct Marks', corrAnsCount)
  localStorage.setItem('Wrong Marks', wrongAnsCount)
}

const optionListGenerator = (wrongAnswers, correctAnswer) => {
  let r = Math.floor(Math.random() * 4)
  wrongAnswers.splice(r, 0, correctAnswer);
  return wrongAnswers;
}
const optionListValue = () => {
  let optionList = document.querySelectorAll('.opt')
  let wrongAnswers = data.results[i].incorrect_answers;
  let correctAnswer = data.results[i].correct_answer;
  completeOptions = optionListGenerator(wrongAnswers, correctAnswer);
  for (let i = 0; i < 4; i++) {
    optionList[i].innerHTML = completeOptions[i]
  }
}

const changeQuestion = () => {
  if (i + 1 > 10) {
    mainDiv.style.display = 'none'
    scoreDiv.style.display = 'block'
    dispScore();
  } else {
    questionIndex.textContent = `${i + 1}. `;
    questions.innerHTML = data.results[i].question;
    optionListValue();
  }
}

const questionLoad = async () => {
  var res = await fetch(API);
  data = await res.json();
  changeQuestion();
  optionListValue();
}

next.addEventListener('click', () => {
  i++;
  optionButtons.forEach((e) => {
    e.disabled = false;
    e.setAttribute('class', 'options btn btn-dark w-100')
  })
  changeQuestion();
})

const dis = () => {
  optionButtons.forEach(e => {
    e.disabled = true
  });
}

const corrAnsFinder = (i) => {
  optionButtons.forEach((e) => {
    if (e.lastElementChild.innerHTML === data.results[i].correct_answer) {
      e.setAttribute('class', 'options btn btn-success w-100')
    }
  });
}

optionButtons.forEach((e) => {
  // e.style.hover = 'none'
  e.addEventListener('click', () => {
    if (e.lastElementChild.innerHTML === data.results[i].correct_answer) {
      corrAnsCount++;
      e.setAttribute('class', 'options btn btn-success w-100')
    } else {
      wrongAnsCount++;
      e.setAttribute('class', 'options btn btn-danger w-100')
      corrAnsFinder(i);
    }
    dis();
  })
});
restartBtn.addEventListener('click', () => {
  i = 0;
  corrAnsCount = 0;
  wrongAnsCount = 0;

  mainDiv.style.display = 'block'
  scoreDiv.style.display = 'none'

  questionLoad();
})
window.addEventListener('load', questionLoad());