import "./scss/style.scss";
import Experience from "./Experience/Experience.js";

const experience = new Experience(document.querySelector(".experience-canvas"));

const fileInput = document.getElementById("file");
const fileName = document.getElementById("file-name");
fileInput.addEventListener("change", (ev) => {
  fileName.textContent = ev.target.files[0].name;
});

const validatedInputs = [];
const inputs = Array.from(document.querySelectorAll(".form-control"));
inputs.forEach((input) => {
  input.addEventListener("change", () => {
    input.value ? validatedInputs.push(input) : validatedInputs.pop(input);
    const currentProgress = validatedInputs.length * (100 / inputs.length);
    const progressBar = document.getElementById("FormProgressBar");
    progressBar.style.width = `${currentProgress}%`;
  });
});

// Validate inputs

(() => {
  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
 
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
