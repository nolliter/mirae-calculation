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

      // Grid 설정
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
          inputElement.inputMode = "numeric";
          inputElement.placeholder = label;

          inputElement.addEventListener("input", e => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            if (raw) {
              e.target.dataset.raw = raw;
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

        // 연수익률(%) - type=text + inputMode=numeric
        } else if (label === "예상 연수익률(%)") {
          inputElement = document.createElement("input");
          inputElement.type = "text";
          inputElement.inputMode = "numeric";
          inputElement.placeholder = label;

          inputElement.addEventListener("input", e => {
            const raw = e.target.value.replace(/[^0-9\-]/g, "");
            e.target.dataset.raw = raw;
            e.target.value = raw;
          });

          inputElement.addEventListener("blur", e => {
            const raw = e.target.dataset.raw;
            if (raw !== undefined) {
              e.target.value = raw + "%";
            }
          });

          inputElement.addEventListener("focus", e => {
            const raw = e.target.dataset.raw;
            if (raw !== undefined) {
              e.target.value = raw;
            }
          });

        // 연월(YYYYMM)
        } else if (label.includes("연월")) {
          inputElement = document.createElement("input");
          inputElement.type = "text";
          inputElement.inputMode = "numeric";
          inputElement.maxLength = 7;
          inputElement.placeholder = label;

          inputElement.addEventListener("input", e => {
            const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
            if (raw.length === 6) {
              const month = Number(raw.slice(4, 6));
              if (month >= 1 && month <= 12) {
                e.target.dataset.raw = raw;
                e.target.value = raw.slice(0, 4) + "-" + raw.slice(4, 6);
              } else {
                alert("월은 01에서 12 사이여야 합니다.");
                e.target.value = "";
                delete e.target.dataset.raw;
              }
            } else {
              e.target.value = raw;
              delete e.target.dataset.raw;
            }
          });

          inputElement.addEventListener("focus", e => {
            const raw = e.target.dataset.raw;
            if (raw) e.target.value = raw;
          });

          inputElement.addEventListener("blur", e => {
            const raw = e.target.dataset.raw;
            if (raw && raw.length === 6) {
              e.target.value = raw.slice(0, 4) + "-" + raw.slice(4, 6);
            }
          });

        // 주기 (select)
        } else if (label === "주기") {
          inputElement = document.createElement("select");
          inputElement.className = "custom-select";
        
          const placeholderOption = document.createElement("option");
          placeholderOption.value = "";
          placeholderOption.textContent = "주기";
          placeholderOption.disabled = true;
          placeholderOption.selected = true;
          inputElement.appendChild(placeholderOption);
        
          ["매월", "매년"].forEach(optionText => {
            const option = document.createElement("option");
            option.value = optionText;
            option.textContent = optionText;
            inputElement.appendChild(option);
          });
        // 기본 입력
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
