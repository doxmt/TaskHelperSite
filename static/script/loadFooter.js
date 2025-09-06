document.addEventListener("DOMContentLoaded", () => {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    fetch("/static/components/footer.html") // ✅ 경로 수정
      .then((res) => res.text())
      .then((html) => {
        footerPlaceholder.innerHTML = html;
      })
      .catch((err) => console.error("Footer 로드 실패:", err));
  }
});
