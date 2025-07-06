document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.querySelector(".pdf-converter");
  const fileInput = document.getElementById("fileInput");
  const convertBtn = document.getElementById("convertBtn");
  const result = document.getElementById("resultMessage");
  const explanation = document.getElementById("explanation");

  // 클릭으로 파일 선택창 열기
  dropZone.addEventListener("click", () => {
    fileInput.click();
  });

  // 파일 선택 시 문구 및 색상 변경
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      explanation.textContent = `선택된 파일: ${file.name}`;
      explanation.style.color = "white"; // ✅ 글자색 흰색으로 변경
    } else {
      explanation.textContent = "파일을 드롭하거나 선택하세요.";
      explanation.style.color = "black"; // ✅ 기본 색상으로 복원
    }
  });

  // 변환 버튼 클릭 시 처리
  convertBtn.addEventListener("click", () => {
    const file = fileInput.files[0];

    if (!file) {
      window.alert("파일을 먼저 선택하세요.");
      return;
    }

    window.alert(`${file.name} 파일이 PDF로 변환되었습니다.`)
  
  });
});
