from flask import Flask, request, send_file, url_for
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app) 
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/convert', methods=['POST'])
def upload_pdf():
    file = request.files.get('file')
    if not file:
        return "No file uploaded", 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # 클라이언트에 직접 보기용 URL 반환
    return request.host_url.rstrip('/') + url_for('view_pdf', filename=file.filename)

@app.route('/view/<filename>')
def view_pdf(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    return send_file(filepath, mimetype='application/pdf', as_attachment=False)

if __name__ == '__main__':
    app.run(port=5050, debug=True)