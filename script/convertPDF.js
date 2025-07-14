document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const convertBtn = document.getElementById("convertBtn");
  const explanation = document.getElementById("explanation");

  // ✅ 파일 선택 시 메시지 업데이트
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
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
      const res = await fetch("http://localhost:5050/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const blob = await res.blob();
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
      downloadLink.click();

    } catch (err) {
      alert("변환 실패: " + err.message);
    }
  });
});
