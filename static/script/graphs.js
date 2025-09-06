const chartConfigs = [
  { id: 'chart1', type: 'bar' },
  { id: 'chart2', type: 'line' },
  { id: 'chart3', type: 'pie' },
  { id: 'chart4', type: 'doughnut' },
  { id: 'chart5', type: 'bar', horizontal: true }, // ★ radar → 수평막대
  { id: 'chart6', type: 'polarArea' }
];

const labels = [];
const values = [];
const charts = {};

window.addEventListener('DOMContentLoaded', () => {
  chartConfigs.forEach(({ id, type, horizontal }) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    charts[id] = new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [{
          label: '입력 데이터',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(201, 203, 207, 0.6)',
            'rgba(255, 102, 255, 0.6)',
            'rgba(102, 255, 204, 0.6)',
            'rgba(255, 153, 102, 0.6)',
            'rgba(102, 102, 255, 0.6)',
            'rgba(255, 255, 102, 0.6)',
            'rgba(102, 255, 102, 0.6)',
            'rgba(255, 102, 102, 0.6)',
            'rgba(204, 153, 255, 0.6)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        indexAxis: horizontal ? 'y' : 'x',
        plugins: {
          legend: {
            display: !['chart1', 'chart2', 'chart5'].includes(id)  // ★ 특정 차트만 숨김
          }
        },
        scales: ['bar', 'line'].includes(type)
          ? { y: { beginAtZero: true } }
          : {}
      }
      
    });
  });
});

function addData() {
  const keyInput = document.getElementById('key');
  const valueInput = document.getElementById('value');

  const key = keyInput.value.trim();
  const value = parseFloat(valueInput.value);

  if (!key || isNaN(value)) {
    alert("올바른 key와 value를 입력해주세요.");
    return;
  }

  labels.push(key);
  values.push(value);

  Object.values(charts).forEach(chart => chart.update());

  keyInput.value = '';
  valueInput.value = '';
}

function downloadChartImage(chartId) {
  const canvas = document.getElementById(chartId);
  if (!canvas) {
    alert(`${chartId} 캔버스를 찾을 수 없습니다.`);
    return;
  }

  // 새 캔버스 생성 (배경 흰색용)
  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = canvas.width;
  tmpCanvas.height = canvas.height;
  const ctx = tmpCanvas.getContext('2d');

  // 흰 배경 그리기
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);

  // 원래 캔버스 내용을 덧붙이기
  ctx.drawImage(canvas, 0, 0);

  // 이미지 다운로드
  const link = document.createElement('a');
  link.href = tmpCanvas.toDataURL('image/png');
  link.download = `${chartId}.png`;
  link.click();
}
