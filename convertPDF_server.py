from flask import Flask, request, send_file
from flask_cors import CORS
import os
import tempfile
import subprocess

app = Flask(__name__)
CORS(app)

@app.route('/convert', methods=['POST'])
def convert_office_to_pdf():
    uploaded_file = request.files.get('file')
    if not uploaded_file:
        return "파일이 없습니다.", 400

    with tempfile.TemporaryDirectory() as tmpdir:
        input_path = os.path.join(tmpdir, uploaded_file.filename)
        uploaded_file.save(input_path)

        # LibreOffice 변환 명령 실행 (headless: GUI 없이)
        try:
            subprocess.run([
                "soffice", "--headless", "--convert-to", "pdf", "--outdir", tmpdir, input_path
            ], check=True)
        except subprocess.CalledProcessError as e:
            return f"변환 실패: {str(e)}", 500

        output_pdf = os.path.splitext(input_path)[0] + ".pdf"
        if not os.path.exists(output_pdf):
            return "PDF 변환 실패", 500

        return send_file(
            output_pdf,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='converted.pdf'
        )

if __name__ == '__main__':
    app.run(port=5059)
