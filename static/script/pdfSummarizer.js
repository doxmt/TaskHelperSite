document.addEventListener("DOMContentLoaded", () => {
  const pdfInput = document.getElementById("pdfInput");
  const uploadBox = document.getElementById("uploadBox");
  const summaryBtn = document.querySelector(".submit-btn");
  const summaryResultArea = document.getElementById("summaryResultArea");

  let uploadedFile = null;

  // ✅ 공통 함수: 파일 미리보기 렌더링
  function renderPDF(file) {
    uploadedFile = file;
    const fileURL = URL.createObjectURL(file);
    uploadBox.innerHTML = "";

    const embed = document.createElement("embed");
    embed.src = fileURL;
    embed.type = "application/pdf";
    embed.width = "100%";
    embed.height = "598px";
    embed.style.border = "1px solid #ccc";
    embed.style.borderRadius = "8px";

    uploadBox.appendChild(embed);
  }

  // ✅ 클릭해서 업로드
  pdfInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
    renderPDF(file);
  });

  // ✅ 드래그 앤 드롭 업로드
  uploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadBox.style.border = "2px dashed #888";
    uploadBox.style.backgroundColor = "#f0f0f0";
  });

  uploadBox.addEventListener("dragleave", () => {
    uploadBox.style.border = "none";
    uploadBox.style.backgroundColor = "transparent";
  });

  uploadBox.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadBox.style.border = "none";
    uploadBox.style.backgroundColor = "transparent";

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      renderPDF(file);
    } else {
      alert("PDF 파일만 업로드 가능합니다.");
    }
  });

  // ✅ 요약 요청
  summaryBtn.addEventListener("click", async () => {
    if (!uploadedFile) {
      alert("먼저 PDF 파일을 업로드하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);

    summaryResultArea.innerText = "요약 중...";

    try {
      const res = await fetch("/summarize", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.text();
        summaryResultArea.innerText = `요약 실패: ${error}`;
        return;
      }

      const resultText = await res.text();
      summaryResultArea.innerText = resultText;
    } catch (err) {
      summaryResultArea.innerText = "요약 중 오류 발생";
      console.error(err);
    }
  });
});
