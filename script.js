document.addEventListener("DOMContentLoaded", () => {
  const sectionConfigs = {
    "year-age": ["연도", "나이"],
    "assets": ["자산종류", "금액", "예상 연수익률(%)"]
  };

  document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => {
      const section = button.closest(".section");
      const type = section.dataset.section;
      const inputWrapper = section.querySelector(".input-wrapper");

      const row = document.createElement("div");
      row.className = "input-row";

      sectionConfigs[type].forEach(placeholder => {
        const input = document.createElement("input");
        input.placeholder = placeholder;
        row.appendChild(input);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => row.remove();
      row.appendChild(deleteBtn);

      inputWrapper.appendChild(row);
    });
  });
});
