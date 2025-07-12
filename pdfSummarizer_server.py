from flask import Flask, request
from flask_cors import CORS
import fitz  # PyMuPDF

app = Flask(__name__)
CORS(app)

@app.route('/convert', methods=['POST'])
def summarize_pdf():
    file = request.files['file']
    if not file:
        return "파일이 없습니다.", 400

    try:
        # PDF 읽기
        doc = fitz.open(stream=file.read(), filetype="pdf")
        full_text = ""
        for page in doc:
            full_text += page.get_text()

        # 아주 간단한 요약 (앞 500자만 자르기)
        summary = full_text.strip().replace('\n', ' ')[:500] + "..."

        return summary
    except Exception as e:
        return f"요약 실패: {str(e)}", 500
if __name__ == '__main__':
    app.run(debug=True, port=5050)
