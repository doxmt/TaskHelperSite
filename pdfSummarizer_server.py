from flask import Flask, request
from flask_cors import CORS
import fitz
import os
from dotenv import load_dotenv
from openai import OpenAI

# 환경 변수 로드
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app)

@app.route('/convert', methods=['POST'])
def summarize_pdf():
    file = request.files.get('file')
    if not file:
        return "파일이 없습니다.", 400

    try:
        doc = fitz.open(stream=file.read(), filetype="pdf")
        full_text = ""
        for page in doc:
            full_text += page.get_text()

        if len(full_text.strip()) == 0:
            return "PDF에 텍스트가 없습니다.", 400

        # 너무 길면 문장 단위로 자르기
        max_chars = 5000
        if len(full_text) > max_chars:
            full_text = full_text[:full_text.rfind(". ", 0, max_chars) + 1]

        # 프롬프트
        prompt =f"""
다음은 PDF에서 추출된 학습 자료입니다. 내용을 [단원 번호 + 제목] 형식으로 구분해,
각 단원의 핵심 개념을 충분히 설명해줘.

요약은 다음 조건을 따르세요:
- 각 단원의 제목은 [번호 제목] 형태로 표시
- 각 단원은 5문단 분량으로 요약
- 주요 개념이나 용어는 부연 설명 추가 
- 불필요한 반복은 제거하되, **이해하기 쉽게 자세히 서술**
--- PDF 내용 ---
{full_text}
"""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=2000  # 더 길게 받아옴
        )

        summary = response.choices[0].message.content.strip()
        return summary

    except Exception as e:
        return f"요약 실패: {str(e)}", 500

if __name__ == '__main__':
    app.run(debug=True, port=5050)
