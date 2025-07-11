document.addEventListener('DOMContentLoaded', () => {
  const pdfInput = document.getElementById('pdfInput');
  const uploadBox = document.getElementById('uploadBox');

  pdfInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    // 파일 미리보기 URL 생성
    const fileURL = URL.createObjectURL(file);

    // 업로드 박스 초기화 (아이콘/텍스트 제거)
    uploadBox.innerHTML = '';

    // <embed> 엘리먼트 생성 및 설정
    const embed = document.createElement('embed');
    embed.src = fileURL;
    embed.type = 'application/pdf';
    embed.width = '100%';
    embed.height = '598px';
    embed.style.border = '1px solid #ccc';
    embed.style.borderRadius = '8px';

    // 박스에 embed 추가
    uploadBox.appendChild(embed);
  });
});
