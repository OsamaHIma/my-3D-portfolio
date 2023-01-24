import "./scss/style.scss";
import Experience from "./Experience/Experience.js";

const experience = new Experience(document.querySelector(".experience-canvas"));

const fileInput = document.getElementById("file");
const fileName = document.getElementById("file-name");
fileInput.addEventListener("change", (ev) => {
  fileName.textContent = ev.target.files[0].name;
})(
  // Validate inputs

  () => {
    "use strict";

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll(".needs-validation");

    // Loop over them and prevent submission
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
  }
)();
