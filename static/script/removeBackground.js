const imageInput = document.getElementById("imageInput");
const removeBtn = document.getElementById("removeBtn");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");

const dropZone = document.getElementById("dropZone");
const fileNameText = document.getElementById("fileName");

let uploadedPreviewImg = null;
let imageBlob = null;

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    imageBlob = file;

    // 텍스트 숨기기
    fileNameText.style.display = "none";

    // 기존 이미지 제거
    if (uploadedPreviewImg) {
      uploadedPreviewImg.remove();
    }

    // 이미지 생성해서 꽉 채우기
    uploadedPreviewImg = document.createElement("img");
    uploadedPreviewImg.src = URL.createObjectURL(file);
    uploadedPreviewImg.alt = "업로드된 이미지 미리보기";

    // ✅ 핵심 스타일
    uploadedPreviewImg.style.position = "absolute";
    uploadedPreviewImg.style.top = 0;
    uploadedPreviewImg.style.left = 0;
    uploadedPreviewImg.style.width = "100%";
    uploadedPreviewImg.style.height = "100%";
    uploadedPreviewImg.style.objectFit = "cover";
    uploadedPreviewImg.style.borderRadius = "10px";
    uploadedPreviewImg.style.zIndex = "0";

    dropZone.appendChild(uploadedPreviewImg);
  }
});

removeBtn.addEventListener("click", async () => {
  if (!imageBlob) return alert("이미지를 먼저 업로드하세요!");

  const formData = new FormData();
  formData.append("image", imageBlob);

  const res = await fetch("/remove-bg", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) return alert("배경 제거 실패");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  resultImage.src = url;
  resultImage.style.display = "block";

  downloadBtn.onclick = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "removed-background.png";
    a.click();
  };
});
