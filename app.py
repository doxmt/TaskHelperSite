from flask import Flask, request, send_file, render_template
from flask_cors import CORS
import os, io, tempfile
import fitz  # PyMuPDF
from rembg import remove
from PIL import Image
from dotenv import load_dotenv
from openai import OpenAI

# 환경변수 로드
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Flask 설정 (templates/, static/ 기본 폴더 사용)
app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

# -------------------------
# 📌 HTML 페이지 라우트
# -------------------------
@app.route("/")
def home():
    return render_template("main.html")   # 홈페이지

@app.route("/convert-pdf")
def convert_pdf_page():
    return render_template("convertPDF.html")

@app.route("/summarize-pdf")
def summarize_pdf_page():
    return render_template("pdfSummarizer.html")

@app.route("/remove-bg-page")
def remove_bg_page():
    return render_template("removeBackground.html")

@app.route("/timer")
def timer_page():
    return render_template("timer.html")

@app.route("/graphs")
def graphs_page():
    return render_template("graphs.html")

# -------------------------
# 📌 API 엔드포인트
# -------------------------

# 1. Office → PDF 변환 (Render 환경에서는 비활성화)
@app.route('/convert-office', methods=['POST'])
def convert_office_to_pdf():
    return "현재 Render 환경에서는 Office → PDF 변환을 지원하지 않습니다.", 501

# 2. PDF 요약
@app.route('/summarize', methods=['POST'])
def summarize_pdf():
    file = request.files.get('file')
    if not file:
        return "파일이 없습니다.", 400
    try:
        doc = fitz.open(stream=file.read(), filetype="pdf")
        full_text = "".join(page.get_text() for page in doc)

        if not full_text.strip():
            return "PDF에 텍스트가 없습니다.", 400

        max_chars = 5000
        if len(full_text) > max_chars:
            full_text = full_text[:full_text.rfind(". ", 0, max_chars) + 1]

        prompt = f"""
다음은 PDF 학습 자료입니다. [단원 번호 + 제목] 형태로 나누고,
각 단원별 핵심 개념을 5문단 분량으로 자세히 요약해줘.
--- PDF 내용 ---
{full_text}
"""
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=2000
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"요약 실패: {str(e)}", 500

# 3. 이미지 배경 제거
@app.route('/remove-bg', methods=['POST'])
def remove_bg_api():
    if 'image' not in request.files:
        return {'error': 'No image provided'}, 400
    file = request.files['image']
    output_bytes = remove(file.read())
    return send_file(io.BytesIO(output_bytes),
                     mimetype='image/png',
                     as_attachment=True,
                     download_name='no-bg.png')

# -------------------------
# 📌 실행
# -------------------------
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Render가 제공한 PORT 환경 변수 우선 사용
    app.run(host='0.0.0.0', port=port)
