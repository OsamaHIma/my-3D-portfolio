import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.room = this.experience.world.room.room;

    this.room.children.forEach((child) => {
      if (child.type === "RectAreaLight") {
        this.rectLight = child;
      }
    });

    // this.setSmoothScroll();
    this.circleFirst = this.experience.world.floor.circleFirst;
    this.circleSecond = this.experience.world.floor.circleSecond;
    this.circleThird = this.experience.world.floor.circleThird;
    this.circleFourth = this.experience.world.floor.circleFourth;

    GSAP.registerPlugin(ScrollTrigger);

    document.querySelector(".page").style.overflow = "visible";
    document.body.style.overflowY = "visible";

    if (
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.setSmoothScroll();
    }
    this.setScrollTrigger();
  }

  setupASScroll() {
    // SRC: https://github.com/ashthornton/asscroll
    const asscroll = new ASScroll({
      disableRaf: true,
    });

    GSAP.ticker.add(asscroll.update);

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement,
    });

    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        if (arguments.length) {
          asscroll.currentPos = value;
          return;
        }
        return asscroll.currentPos;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      fixedMarkers: true,
    });

    asscroll.on("update", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", asscroll.resize);

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll(
          ".gsap-marker-start, .gsap-marker-end, [asscroll]"
        ),
      });
    });
    return asscroll;
  }

  setSmoothScroll() {
    this.asscroll = this.setUpASScroll;
  }

  setScrollTrigger() {
    ScrollTrigger.matchMedia({
      // Desktop
      "(min-width: 969px)": () => {
        // Reset --------------------------------
        this.room.scale.set(0.13, 0.13, 0.13);
        this.rectLight.width = 0.3;
        this.rectLight.height = 0.3;
        this.camera.orthographicCamera.position.set(0, 6.5, 10);
        this.room.position.set(0, 0, 0);
        // First section -----------------------------------------

        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".first-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // markers: true,
            invalidateOnRefresh: true,
          },
        });

        this.firstMoveTimeline.fromTo(
          this.room.position,
          { x: 0, y: 0, z: 0 },
          {
            x: () => {
              return this.sizes.width * 0.0014;
            },
          }
        );

        // second section --------------------------
        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // markers: true,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.position,
            {
              x: () => {
                return -4;
              },
              z: () => {
                return this.sizes.height * 0.0022;
              },
            },
            "same"
          )
          .to(
            this.room.scale,
            {
              x: 0.6,
              y: 0.6,
              z: 0.6,
            },
            "same"
          )
          
        // third section -----------------------------------------

        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.scale,
            {
              x: 0.8,
              y: 0.8,
              z: 0.8,
            },
            "same"
          )
          .to(
            this.room.position,
            {
              x: () => {
                return 8;
              },
              z: () => {
                return this.sizes.height * 0.0032;
              },
            },
            "same"
          )
          .to(
            this.camera.orthographicCamera.position,
            {
              y: () => {
                return 7.1;
              },
              x: () => {
                return 8.1;
              },
              z: () => {
                return 10.1;
              },
            },
            "same"
          )
          .to(
            this.rectLight,
            {
              width: 0.3 * 4,
              height: 0.4 * 2,
            },
            "same"
          );

        // fourth section -----------------------------------------
        this.fourthMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".fourth-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.position,
            {
              x: () => {
                return -3;
              },
              z: () => {
                return this.sizes.height * 0.0032;
              },
            },
            "same"
          )
          .to(
            this.room.scale,
            {
              x: 0.6,
              y: 0.6,
              z: 0.6,
            },
            "same"
          )
          .to(
            this.camera.orthographicCamera.position,
            {
              y: 1.5,
              x: -4.1,
            },
            "same"
          );
      },

      // Mobile
      "(max-width: 968px)": () => {
        // console.log("fired mobile");
        // Resets
        this.room.scale.set(0.1, 0.1, 0.1);
        this.room.position.set(0, 0, 0);
        this.rectLight.width = 0.1;
        this.rectLight.height = 0.2;
        this.camera.orthographicCamera.position.set(0, 6.5, 10);

        // First section -----------------------------------------
        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".first-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // invalidateOnRefresh: true,
          },
        }).to(this.room.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
        });

        // Second section -----------------------------------------
        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.scale,
            {
              x: 0.3,
              y: 0.3,
              z: 0.3,
            },
            "same"
          )
          .to(
            this.rectLight,
            {
              width: 0.3 * 1.5,
              height: 0.4 * 1.5,
            },
            "same"
          )
          .to(
            this.room.position,
            {
              x: -1.1,
            },
            "same"
          );
        // Third section
        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.position,
            {
              x: 1.7,
            },
            "same"
          )
          .to(
            this.room.scale,
            {
              x: 0.5,
              y: 0.5,
              z: 0.5,
            },
            "same"
          );

        // fourth section -----------------------------------------
        this.fourthMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".fourth-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }).to(this.room.position, {
          z: -4.5,
        });
      },

      // all
      all: () => {
        // Progress pars animations -------------------------------------------

        this.sections = document.querySelectorAll(".section");
        this.sections.forEach((section) => {
          this.progressWrapper = section.querySelector(".progress-wrapper");
          this.progressBar = section.querySelector(".progress-bar");

          if (section.classList.contains("right")) {
            GSAP.to(section, {
              borderTopLeftRadius: 20,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
              },
            });
            GSAP.to(section, {
              borderBottomLeftRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: "bottom bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          } else {
            GSAP.to(section, {
              borderTopRightRadius: 20,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
              },
            });
            GSAP.to(section, {
              borderBottomRightRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: "bottom bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }
          GSAP.from(this.progressBar, {
            scaleY: 0,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
              pin: this.progressWrapper,
              pinSpacing: false,
            },
          });
        });

        // Circle animations -------------------------------------------------

        // First Circle -------------------------
        this.circleFirst = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".first-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // invalidateOnRefresh: true,
          },
        }).to(this.circleFirst.scale, {
          x: 5,
          y: 5,
          z: 5,
        });

        // Second Circle -------------------------
        this.circleSecond = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // invalidateOnRefresh: true,
          },
        })
          .to(
            this.circleSecond.scale,
            {
              x: 5,
              y: 5,
              z: 5,
            },
            "same"
          )
          .to(
            this.room.position,
            {
              y: 0.5,
            },
            "same"
          );

        // Third Circle --------------------------
        this.circleThird = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // invalidateOnRefresh: true,
          },
        }).to(this.circleThird.scale, {
          x: 5,
          y: 5,
          z: 5,
        });

        // Fourth Circle --------------------------
        this.circleFourth = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".fourth-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // invalidateOnRefresh: true,
          },
        }).to(this.circleFourth.scale, {
          x: 5,
          y: 5,
          z: 5,
        });

        // Gym floor animations----------------------------------------
        this.secondPartTimeLine = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".fourth-move",
            start: "center center",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        this.room.children.forEach((child) => {
          if (child.name === "Gym_floor") {
            this.gymFloor = GSAP.to(child.position, {
              x: -2.98974,
              z: 7.05587,
              duration: 0.8,
            });
          }
          if (child.name === "Pullup_par") {
            this.pullUpPar = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.6,
            });
          }
          if (child.name === "Dumble") {
            this.dumble = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.6,
            });
          }
          if (child.name === "floor_stuff") {
            this.floorStuff = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.6,
            });
          }
          if (child.name === "Desk_stuff") {
            this.deskStuff = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.6,
            });
          }
          if (child.name === "flags") {
            this.flages = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.6,
            });
          }
          if (child.name === "Desk") {
            this.desk = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.6,
            });
          }
          if (child.name === "rifle") {
            this.shelfStuff = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.6,
            });
          }
          if (child.name === "Boxing_bag__full") {
            this.boxingBag = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.6,
            });
          }
          if (child.name === "floor1") {
            this.floor1 = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.6,
            });
          }
          if (child.name === "floor2") {
            this.floor2 = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.6,
            });
          }

          if (child.name === "mail_box") {
            this.mailBox = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.6,
            });
          }
        });
        this.secondPartTimeLine.add(this.gymFloor);
        this.secondPartTimeLine.add(this.floor1);
        this.secondPartTimeLine.add(this.floor2);
        this.secondPartTimeLine.add(this.boxingBag);
        this.secondPartTimeLine.add(this.pullUpPar);
        this.secondPartTimeLine.add(this.dumble);
        this.secondPartTimeLine.add(this.mailBox);
      },
    });
  }

  resize() {}

  update() {}
}
