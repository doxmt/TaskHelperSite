let timer;
  let milliseconds = 0;
  let isRunning = false;

  function updateTimerDisplay() {
    const min = String(Math.floor(milliseconds / 6000)).padStart(2, '0');         // 1분 = 60초 = 6000 * 10ms
    const sec = String(Math.floor((milliseconds % 6000) / 100)).padStart(2, '0'); // 1초 = 100 * 10ms
    const ms  = String(milliseconds % 100).padStart(2, '0');                       // 밀리초 = 1/100초 단위

    document.getElementById('timer').textContent = `${min}:${sec}:${ms}`;
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(() => {
      milliseconds++;
      updateTimerDisplay();
    }, 10); // 10ms 단위로 갱신
  }

  function pauseTimer() {
    isRunning = false;
    clearInterval(timer);
  }

  function resetTimer() {
    pauseTimer();
    milliseconds = 0;
    updateTimerDisplay();
  }

  window.onload = updateTimerDisplay;