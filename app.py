from flask import Flask, request, send_file
from flask_cors import CORS
import os, io, tempfile, subprocess
import fitz  # PyMuPDF
from rembg import remove
from PIL import Image
from dotenv import load_dotenv
from openai import OpenAI

# 환경변수 로드
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app)

# 1. Office → PDF 변환
@app.route('/convert-office', methods=['POST'])
def convert_office_to_pdf():
    uploaded_file = request.files.get('file')
    if not uploaded_file:
        return "파일이 없습니다.", 400

    with tempfile.TemporaryDirectory() as tmpdir:
        input_path = os.path.join(tmpdir, uploaded_file.filename)
        uploaded_file.save(input_path)

        try:
            subprocess.run([
                "soffice", "--headless", "--convert-to", "pdf",
                "--outdir", tmpdir, input_path
            ], check=True)
        except Exception as e:
            return f"변환 실패: {str(e)}", 500

        output_pdf = os.path.splitext(input_path)[0] + ".pdf"
        if not os.path.exists(output_pdf):
            return "PDF 변환 실패", 500

        return send_file(output_pdf, mimetype='application/pdf',
                         as_attachment=True, download_name='converted.pdf')

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
def remove_bg():
    if 'image' not in request.files:
        return {'error': 'No image provided'}, 400
    file = request.files['image']
    output_bytes = remove(file.read())
    return send_file(io.BytesIO(output_bytes),
                     mimetype='image/png',
                     as_attachment=True,
                     download_name='no-bg.png')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
