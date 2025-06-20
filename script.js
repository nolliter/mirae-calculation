document.addEventListener("DOMContentLoaded", () => {
  // 항목별 input placeholder 정의
  const sectionConfigs = {
    "assets": ["자산종류", "금액(원)", "예상 연수익률(%)"],
    "future-assets": ["자산종류", "금액(원)", "만기연월(YYYYMM)"],
    "income": ["수입종류", "금액(원)", "주기", "시작연월(YYYYMM)", "종료연월(YYYYMM)"]
  };

  // 모든 '추가' 버튼에 이벤트 바인딩
  document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => {
      const section = button.closest(".section");
      const type = section.dataset.section;
      const inputWrapper = section.querySelector(".input-wrapper");

      // 새 input row 생성
      const row = document.createElement("div");
      row.className = "input-row";

      const inputCount = sectionConfigs[type].length;

      // grid 컬럼 수 동적으로 설정
      row.style.display = "grid";
      row.style.gridTemplateColumns = `repeat(${inputCount}, 1fr) 40px`;
      row.style.gap = "10px";
      row.style.alignItems = "center";

      // input 필드 추가
      sectionConfigs[type].forEach(placeholder => {
        const input = document.createElement("input");
        input.placeholder = placeholder;
        row.appendChild(input);
      });

      // 삭제 버튼 추가
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => row.remove();
      row.appendChild(deleteBtn);

      inputWrapper.appendChild(row);
    });
  });
});
