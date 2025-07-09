from flask import Flask, request, send_file
from rembg import remove
from PIL import Image
import io
from flask_cors import CORS



app = Flask(__name__)
CORS(app)

@app.route('/remove-bg', methods=['POST'])
def remove_bg():
    if 'image' not in request.files:
        return {'error': 'No image provided'}, 400

    file = request.files['image']
    input_bytes = file.read()

    # 배경 제거
    output_bytes = remove(input_bytes)

    # 메모리에서 바로 전송
    return send_file(
        io.BytesIO(output_bytes),
        mimetype='image/png',
        as_attachment=True,
        download_name='no-bg.png'
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050)
