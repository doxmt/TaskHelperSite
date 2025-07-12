document.addEventListener('DOMContentLoaded', () => {
  const pdfInput = document.getElementById('pdfInput');
  const uploadBox = document.getElementById('uploadBox');
  const summaryBtn = document.querySelector('.submit-btn');
  const summaryResultArea = document.getElementById('summaryResultArea');

  let uploadedFile = null; // 전역에 저장

  // 1. PDF 업로드 시 미리보기
  pdfInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    uploadedFile = file;

    const fileURL = URL.createObjectURL(file);
    uploadBox.innerHTML = '';

    const embed = document.createElement('embed');
    embed.src = fileURL;
    embed.type = 'application/pdf';
    embed.width = '100%';
    embed.height = '598px';
    embed.style.border = '1px solid #ccc';
    embed.style.borderRadius = '8px';

    uploadBox.appendChild(embed);
  });

  // 2. 요약하기 버튼 클릭 시 서버로 전송
  summaryBtn.addEventListener('click', async () => {
    if (!uploadedFile) {
      alert("먼저 PDF 파일을 업로드하세요.");
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadedFile);

    summaryResultArea.innerText = '요약 중...';

    try {
      const res = await fetch('http://localhost:5050/convert', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const error = await res.text();
        summaryResultArea.innerText = `요약 실패: ${error}`;
        return;
      }

      const resultText = await res.text();
      summaryResultArea.innerText = resultText;
    } catch (err) {
      summaryResultArea.innerText = '요약 중 오류 발생';
      console.error(err);
    }
  });
});
