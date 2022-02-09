// 5-second timer
const
  timerNode = document.getElementById('timer'),
  startClass = 'countdown',
  countdown = 5000;

let timer;

export function startTimer() {

  if (timer) {
    stopTimer();
    clearTimeout(timer);
  }

  timerNode.classList.add(startClass);
  setTimeout(stopTimer, countdown);

}

function stopTimer() {
  timerNode.classList.remove(startClass);
}
