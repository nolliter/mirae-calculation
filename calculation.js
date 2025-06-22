document.querySelector(".calculate-btn").addEventListener("click", () => {
  const resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = "";

  const startYear = parseInt(document.querySelector("input[placeholder='연도']").value);
  const startAge = parseInt(document.querySelector("input[placeholder='나이']").value);

  const assetInputs = document.querySelectorAll(".section[data-section='assets'] .input-row");
  const assets = [];
  assetInputs.forEach(row => {
    const inputs = row.querySelectorAll("input");
    if (inputs.length < 3) return;
    const amount = parseRaw(inputs[1]);
    const rate = parseFloat(inputs[2].dataset.raw || "0");
    assets.push({ amount, rate });
  });

  const futureInputs = document.querySelectorAll(".section[data-section='future-assets'] .input-row");
  const futureAssets = [];
  futureInputs.forEach(row => {
    const inputs = row.querySelectorAll("input");
    if (inputs.length < 3) return;
    const amount = parseRaw(inputs[1]);
    const yyyymm = inputs[2].dataset.raw;
    if (yyyymm) {
      const year = parseInt(yyyymm.slice(0, 4));
      futureAssets.push({ amount, year });
    }
  });

  const incomeInputs = document.querySelectorAll(".section[data-section='income'] .input-row");
  const incomeList = [];
  incomeInputs.forEach(row => {
    const inputs = row.querySelectorAll("input");
    if (inputs.length < 4) return;
    const amount = parseRaw(inputs[1]);
    const start = inputs[2].dataset.raw;
    const end = inputs[3].dataset.raw;
    if (start && end) {
      incomeList.push({ amount, start, end });
    }
  });

  const livingCostInput = document.querySelector("input[placeholder='월 생활비(원)']");
  const initialLivingCost = parseRaw(livingCostInput);

  const inflationInput = document.querySelector("input[placeholder='소비자물가상승률(%)']");
  const inflation = parseFloat(inflationInput.dataset.raw || "0") / 100;

  const table = document.createElement("div");
  table.className = "result-table";
  table.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>연도</th>
          <th>나이</th>
          <th title="당해 총 수입/12">월 평균 수입</th>
          <th>연 수입</th>
          <th title="물가 상승 고려">월 지출</th>
          <th>연 지출</th>
          <th>당해 말 잔액</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;
  resultContainer.appendChild(table);


// 저장하기 버튼 생성
const saveBtn = document.createElement("button");
saveBtn.textContent = "저장하기";
saveBtn.className = "save-btn";
saveBtn.style.marginTop = "24px";
saveBtn.style.display = "block";
saveBtn.style.marginLeft = "auto";
saveBtn.style.marginRight = "auto";
saveBtn.onclick = () => {
  const captureArea = document.querySelector(".container");
  html2canvas(captureArea, {
    backgroundColor: null,
    scrollX: 0,
    scrollY: -window.scrollY
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "result.png";
    link.href = canvas.toDataURL();
    link.click();
  });
};
resultContainer.appendChild(saveBtn);