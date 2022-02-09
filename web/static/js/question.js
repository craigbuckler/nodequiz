// question handler
import { clear } from './utils.js';

const
  qNum = document.getElementById('qnum'),
  question = document.getElementById('question'),
  answers = document.getElementById('answers');

let currentQuestion;

// answer event handlers
answers.addEventListener('click', questionAnswered);
window.addEventListener('keydown', questionAnswered);


// show next question
export function show( q ) {

  currentQuestion = q;
  currentQuestion.answered = false;

  clear(question);
  clear(answers);

  qNum.textContent = q.num;
  question.innerHTML = q.text;

  q.answer.forEach((ans, idx) => {
    const button = document.createElement('button');
    button.value = idx;
    button.textContent = `${ idx+1 }: ${ ans }`;
    answers.appendChild(button);
  });

}


// user answers a question
function questionAnswered(e) {

  // already answered
  if (currentQuestion.answered) return;

  let ans = null;
  if (e.type == 'click') {

    // button click
    ans = e.target && e.target.nodeName === 'BUTTON' ? parseInt(e.target.value, 10) : null;
    if (ans > currentQuestion.answer.length) ans = null;

  }
  else {

    // keypress
    ans = e.key >= '1' && e.key <= String(currentQuestion.answer.length) ? parseInt(e.key, 10) - 1 : null;

  }

  if (ans === null) return;

  // valid answer given
  currentQuestion.answered = true;

  console.log(ans);

}
