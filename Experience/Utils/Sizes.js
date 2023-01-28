import { EventEmitter } from "events";

export default class Sizes extends EventEmitter {
  constructor() {
    super();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.frustrum = 5;
    this.scrollDownIcon = document.querySelector(".mouse-wrapper");

    if (this.width < 968) {
      this.device = "mobile";
      this.scrollDownIcon.innerHTML = `
                  <i class="fa fa-chevron-down"></i>          
                   `;
    } else {
      this.device = "desktop";
      this.scrollDownIcon.innerHTML = `<span class="mouse-outline">
                                        <span class="mouse-btn"></span>
                                       </span>`;
    }

    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.aspect = this.width / this.height;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.emit("resize");

      if (this.width < 968 && this.device !== "mobile") {
        this.device = "mobile";
        this.scrollDownIcon.innerHTML = `
                  <i class="fa fa-chevron-down"></i>          
                   `;
        this.emit("switchDevice", this.device);
      } else if (this.width >= 968 && this.device !== "desktop") {
        this.device = "desktop";
        this.scrollDownIcon.innerHTML = `<span class="mouse-outline">
                                        <span class="mouse-btn"></span>
                                       </span>`;
        this.emit("switchDevice", this.device);
      }
    });
    console.log(this.device);
  }
}
