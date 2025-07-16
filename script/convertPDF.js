document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const convertBtn = document.getElementById("convertBtn");
  const explanation = document.getElementById("explanation");
  const dropZone = document.querySelector(".pdf-converter");

  // ✅ 파일 선택 시 메시지 업데이트
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      explanation.textContent = `${file.name} 선택됨`;
      explanation.style.color = "white";
    }
  });

  // ✅ 드래그 앤 드롭 핸들러 추가
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "white";
    dropZone.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "gray";
    dropZone.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "gray";
    dropZone.style.backgroundColor = "rgba(0, 0, 0, 0.3)";

    const file = e.dataTransfer.files[0];
    if (file) {
      fileInput.files = e.dataTransfer.files; // ⬅️ input에도 넣어줌
      explanation.textContent = `${file.name} 선택됨`;
      explanation.style.color = "white";
    }
  });

  convertBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
      alert("파일을 먼저 선택하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      convertBtn.disabled = true;
      convertBtn.textContent = "변환 중...";

      const res = await fetch("http://localhost:5050/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
      downloadLink.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("변환 실패: " + err.message);
    } finally {
      convertBtn.disabled = false;
      convertBtn.textContent = "PDF로 변환";
    }
  });
});
