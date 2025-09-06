const todayDiv = document.getElementById("today");
const timeDiv = document.getElementById("time");
const milliToggleBtn = document.getElementById("milliToggleBtn"); // ← 요거 중요

let showMili = false;
let timerInterval = null;

milliToggleBtn.addEventListener('click', () => {
  showMili = !showMili;
  milliToggleBtn.textContent = showMili ? "밀리초 숨기기" : "밀리초 보기";
  restartClock(); // 10ms <-> 1000ms 자동 조정
});

function getTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  const mili = String(now.getMilliseconds()).padStart(3, "0");

  timeDiv.style.color = parseInt(minute) >= 59 ? "red" : "black";
  todayDiv.textContent = `${year}년 ${month}월 ${date}일`;

  timeDiv.textContent = showMili
    ? `${hour}시 ${minute}분 ${second}초 ${mili}`
    : `${hour}시 ${minute}분 ${second}초`;
}

function restartClock() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(getTime, showMili ? 10 : 100);
}

restartClock();
