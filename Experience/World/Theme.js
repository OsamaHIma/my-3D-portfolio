import { EventEmitter } from "events";

export default class Theme extends EventEmitter {
  constructor() {
    super();
    this.theme = "light";
    this.toggleBtn = document.querySelector(".toggle-btn");
    this.toggleCircle = document.querySelector(".toggle-circle");
    this.setEventListenr();
  }
  setEventListenr() {
    this.toggleBtn.addEventListener("click", () => {
      this.theme = this.theme === "light" ? "dark" : "light";
      document.body.classList.toggle("dark-theme");
      document.body.classList.toggle("light-theme");
      this.toggleCircle.classList.toggle("slide");
      this.emit("switch", this.theme);
    });
  }
}
