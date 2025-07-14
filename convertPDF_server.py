from flask import Flask, request, send_file
from flask_cors import CORS
from docx2pdf import convert
import os
import tempfile
import shutil

app = Flask(__name__)
CORS(app)

@app.route('/convert', methods=['POST'])
def convert_docx_to_pdf():
    uploaded_file = request.files.get('file')
    if not uploaded_file:
        return "파일이 없습니다.", 400

    # 임시 디렉토리 생성
    with tempfile.TemporaryDirectory() as tmpdir:
        # 원본 파일 저장
        input_path = os.path.join(tmpdir, uploaded_file.filename)
        uploaded_file.save(input_path)

        # PDF 변환
        convert(input_path, tmpdir)

        # 변환된 PDF 경로
        pdf_path = os.path.splitext(input_path)[0] + ".pdf"

        # PDF를 메모리로 읽어 전송
        return send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='converted.pdf'
        )

if __name__ == '__main__':
    app.run(port=5050)
