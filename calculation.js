document.querySelector(".calculate-btn").addEventListener("click", () => {
  const resultContainer = document.querySelector(".result-table");
  if (resultContainer) resultContainer.remove();

  const startYear = parseInt(document.querySelector("input[placeholder='연도']").value);
  const startAge = parseInt(document.querySelector("input[placeholder='나이']").value);

  // 현재 자산 수집
  const assetInputs = document.querySelectorAll(".section[data-section='assets'] .input-row");
  const assets = [];
  assetInputs.forEach(row => {
    const inputs = row.querySelectorAll("input");
    if (inputs.length < 3) return;
    const amount = parseRaw(inputs[1]);
    const rate = parseFloat(inputs[2].dataset.raw || "0");
    assets.push({ amount, rate });
  });

  // 미래 자산 수집
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

  // 정기 수입 수집
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

  // 희망 월 생활비
  const livingCostInput = document.querySelector("input[placeholder='월 생활비(원)']");
  const initialLivingCost = parseRaw(livingCostInput);

  // 인플레이션
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
  document.body.appendChild(table);
  const tbody = table.querySelector("tbody");

  let balance = 0;
  let year = startYear;
  let age = startAge;
  let livingCost = initialLivingCost;
  const maxAge = 100;

  while (age <= maxAge) {
    // 연 수입 계산
    let annualIncome = 0;
    incomeList.forEach(inc => {
      const start = parseInt(inc.start.slice(0, 6));
      const end = parseInt(inc.end.slice(0, 6));
      const current = parseInt(`${year}01`);
      const currentEnd = parseInt(`${year}12`);
      if (start <= currentEnd && end >= current) {
        let months = 12;
        if (year === parseInt(inc.start.slice(0, 4))) {
          months -= parseInt(inc.start.slice(4, 6)) - 1;
        }
        if (year === parseInt(inc.end.slice(0, 4))) {
          months = Math.min(months, parseInt(inc.end.slice(4, 6)));
        }
        annualIncome += inc.amount * months;
      }
    });

    // 연 지출 계산
    const annualExpense = Math.floor(livingCost * 12);

    // 자산 복리 수익 적용
    let assetGrowth = 0;
    if (year === startYear) {
      assetGrowth = assets.reduce((sum, a) => sum + a.amount, 0);
    } else {
      assetGrowth = assets.reduce((sum, a) => {
        const rate = a.rate / 100;
        return sum + a.amount * Math.pow(1 + rate, year - startYear);
      }, 0);
    }

    // 미래 자산 합산
    const maturedAssets = futureAssets
      .filter(f => f.year === year)
      .reduce((sum, f) => sum + f.amount, 0);

    const totalBalance = Math.floor(assetGrowth + maturedAssets + balance + annualIncome - annualExpense);
    if (totalBalance < 0) break;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${year}</td>
      <td>${age}</td>
      <td>${Math.floor(annualIncome / 12).toLocaleString()}</td>
      <td>${annualIncome.toLocaleString()}</td>
      <td>${Math.floor(livingCost).toLocaleString()}</td>
      <td>${annualExpense.toLocaleString()}</td>
      <td>${totalBalance.toLocaleString()}</td>
    `;
    tbody.appendChild(row);

    balance = totalBalance;
    year += 1;
    age += 1;
    livingCost *= (1 + inflation);
  }
});

function parseRaw(input) {
  const raw = input.dataset.raw;
  return raw ? parseFloat(raw.replace(/,/g, "")) : 0;
}