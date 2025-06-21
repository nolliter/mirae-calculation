document.addEventListener("DOMContentLoaded", () => {
  const sectionConfigs = {
    "assets": ["자산종류", "금액(원)", "예상 연수익률(%)"],
    "future-assets": ["자산종류", "금액(원)", "만기연월(YYYYMM)"],
    "income": ["수입종류", "금액(원)", "주기", "시작연월(YYYYMM)", "종료연월(YYYYMM)"]
  };

  document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => {
      const section = button.closest(".section");
      const type = section.dataset.section;
      const inputWrapper = section.querySelector(".input-wrapper");
      const config = sectionConfigs[type];
      const row = document.createElement("div");
      row.className = "input-row";

      // grid 설정
      row.style.display = "grid";
      row.style.gridTemplateColumns = `repeat(${config.length}, 1fr) 40px`;
      row.style.gap = "10px";
      row.style.alignItems = "center";
      row.style.width = "100%";
      row.style.boxSizing = "border-box";

      config.forEach(label => {
        let inputElement;

        // 금액(원)
        if (label === "금액(원)") {
          inputElement = document.createElement("input");
          inputElement.type = "text";
          inputElement.placeholder = label;
          inputElement.inputMode = "numeric";

          inputElement.addEventListener("input", e => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            if (raw) {
              e.target.dataset.raw = raw;
              e.target.value = Number(raw).toLocaleString() + "원";
            } else {
              e.target.value = "";
              delete e.target.dataset.raw;
            }
          });

          inputElement.addEventListener("focus", e => {
            const raw = e.target.dataset.raw;
            if (raw) e.target.value = Number(raw).toLocaleString();
          });

          inputElement.addEventListener("blur", e => {
            const raw = e.target.dataset.raw;
            if (raw) e.target.value = Number(raw).toLocaleString() + "원";
          });

        // 연수익률(%)
        } else if (label === "예상 연수익률(%)") {
          inputElement = document.createElement("input");
          inputElement.type = "number";
          inputElement.placeholder = label;
          inputElement.min = -100;
          inputElement.max = 200;

          inputElement.addEventListener("input", e => {
            const raw = e.target.value.replace(/[^0-9\-]/g, "");
            e.target.dataset.raw = raw;
          });

          inputElement.addEventListener("focus", e => {
            const raw = e.target.dataset.raw;
            if (raw) e.target.value = raw;
          });

          inputElement.addEventListener("blur", e => {
            const raw = e.target.dataset.raw;
            if (raw) e.target.value = raw + "%";
          });

        // 연월(YYYYMM) - use month picker
        } else if (label.includes("연월")) {
          inputElement = document.createElement("input");
          inputElement.type = "month";
          inputElement.placeholder = label;

          inputElement.addEventListener("change", e => {
            const value = e.target.value; // "2024-06"
            const [year, month] = value.split("-");
            if (!year || !month || Number(month) < 1 || Number(month) > 12) {
              alert("유효한 월(01~12)을 선택하세요.");
              e.target.value = "";
              delete e.target.dataset.raw;
            } else {
              e.target.dataset.raw = year + month;
            }
          });
        }

        // 주기 (월/연)
        else if (label === "주기") {
          inputElement = document.createElement("select");
          ["월", "연"].forEach(optionText => {
            const option = document.createElement("option");
            option.value = optionText;
            option.textContent = optionText;
            inputElement.appendChild(option);
          });

        // 기본 text input
        } else {
          inputElement = document.createElement("input");
          inputElement.type = "text";
          inputElement.placeholder = label;
        }

        row.appendChild(inputElement);
      });

      // 삭제 버튼
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => row.remove();
      row.appendChild(deleteBtn);

      inputWrapper.appendChild(row);
    });
  });
});
