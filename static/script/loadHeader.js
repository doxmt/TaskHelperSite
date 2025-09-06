document.addEventListener("DOMContentLoaded", () => {
  fetch("/static/components/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;
    })
    .catch((err) => console.error("Header 로드 실패:", err));
});
