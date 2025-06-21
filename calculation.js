// 계산 트리거
const calculateBtn = document.querySelector(".calculate-btn");
calculateBtn.addEventListener("click", calculate);

function parseRaw(input) {
  const raw = input.dataset.raw;
  return raw ? Number(raw) : 0;
}

function calculate() {
  const startYear = parseInt(document.querySelector("input[placeholder='연도']").value);
  const startAge = parseInt(document.querySelector("input[placeholder='나이']").value);
  const inflationInput = document.querySelector("input[placeholder='소비자물가상승률(%)']");
  const baseExpense = parseRaw(document.querySelector("input[placeholder='월 생활비(원)']"));
  const inflationRate = parseFloat(inflationInput.dataset.raw || 3) / 100;

  // 현재 자산 수집 및 연 수익 계산 (복리)
  const assets = document.querySelectorAll(".section[data-section='assets'] .input-row");
  let initialAssets = 0;
  const assetList = [];
  assets.forEach(row => {
    const [_, amountInput, rateInput] = row.querySelectorAll("input");
    const amount = parseRaw(amountInput);
    const rate = parseFloat(rateInput.dataset.raw || 0) / 100;
    assetList.push({ principal: amount, rate });
    initialAssets += amount;
  });

  // 미래 자산 수집
  const futureAssets = document.querySelectorAll(".section[data-section='future-assets'] .input-row");
  const futureMap = new Map();
  futureAssets.forEach(row => {
    const [_, amountInput, dateInput] = row.querySelectorAll("input");
    const year = dateInput.dataset.raw?.slice(0, 4);
    const amount = parseRaw(amountInput);
    if (year) {
      futureMap.set(Number(year), (futureMap.get(Number(year)) || 0) + amount);
    }
  });

  // 정기 수입 수집
  const incomes = document.querySelectorAll(".section[data-section='income'] .input-row");
  const incomeList = [];
  incomes.forEach(row => {
    const [_, amountInput, startInput, endInput] = row.querySelectorAll("input");
    const amount = parseRaw(amountInput);
    const cycle = cycleSelect.value;
    const start = startInput.dataset.raw;
    const end = endInput.dataset.raw;
    if (start && end) {
      incomeList.push({ amount, start, end });
    }
  });

  // 계산 시작
  const result = [];
  let year = startYear;
  let age = startAge;
  let balance = initialAssets;
  let currentExpense = baseExpense;

  while (age <= 100) {
    // 수입 계산
    let totalIncome = 0;
    incomeList.forEach(({ amount, start, end }) => {
      const startYear = parseInt(start.slice(0, 4));
      const startMonth = parseInt(start.slice(4, 6));
      const endYear = parseInt(end.slice(0, 4));
      const endMonth = parseInt(end.slice(4, 6));
      let months = 0;
      if (year > startYear && year < endYear) {
        months = 12;
      } else if (year === startYear && year === endYear) {
        months = endMonth - startMonth + 1;
      } else if (year === startYear) {
        months = 12 - startMonth + 1;
      } else if (year === endYear) {
        months = endMonth;
      }
      totalIncome += months * amount;
    });

    // 자산 복리 계산
    let assetProfit = 0;
    assetList.forEach(asset => {
      asset.principal *= (1 + asset.rate);
      assetProfit += asset.principal - (asset.principal / (1 + asset.rate));
    });

    // 미래 자산 반영
    const maturity = futureMap.get(year) || 0;

    // 잔액 계산
    const annualExpense = Math.floor(currentExpense * 12);
    balance = balance + totalIncome + assetProfit + maturity - annualExpense;

    result.push({
      year,
      age,
      avgMonthlyIncome: Math.floor(totalIncome / 12),
      annualIncome: Math.floor(totalIncome),
      monthlyExpense: Math.floor(currentExpense),
      annualExpense: Math.floor(annualExpense),
      yearEndBalance: Math.floor(balance),
    });

    if (balance < 0) break;
    year++;
    age++;
    currentExpense *= (1 + inflationRate);
  }

  renderResult(result);
}

function renderResult(rows) {
  const container = document.createElement("div");
  container.className = "result-table";
  container.innerHTML = `
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
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>${r.year}</td>
            <td>${r.age}</td>
            <td>${r.avgMonthlyIncome.toLocaleString()}원</td>
            <td>${r.annualIncome.toLocaleString()}원</td>
            <td>${r.monthlyExpense.toLocaleString()}원</td>
            <td>${r.annualExpense.toLocaleString()}원</td>
            <td>${r.yearEndBalance.toLocaleString()}원</td>
          </tr>`).join("")}
      </tbody>
    </table>
  `;

  // 기존 테이블 제거 후 추가
  const prev = document.querySelector(".result-table");
  if (prev) prev.remove();
  document.querySelector(".container").appendChild(container);
}
