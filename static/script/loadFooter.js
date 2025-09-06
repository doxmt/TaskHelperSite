fetch("/static/html/components/footer.html")
  .then((res) => res.text())
  .then((html) => {
    footerPlaceholder.innerHTML = html;
  })
  .catch((err) => {
    console.error("Footer 로드 실패:", err);
  });
