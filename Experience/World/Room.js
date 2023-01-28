import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
// import { GUI } from "dat.gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.fullRoom = this.resources.items.room;
    this.room = this.fullRoom.scene;
    this.roomChildren = {};
    // this.gui = new GUI();
    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };

    this.setModel();
    this.setAnimation();
    this.onMouseMove();
  }

  setModel() {
    this.room.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.name === "PC") {
        child.children.forEach((kid) => {
          if (kid.name === "Cube037") {
            kid.material = new THREE.MeshBasicMaterial({
              map: this.resources.items.screen,
            });
          }
        });
      }

      if (child.name === "Gym_floor") {
        child.position.x = 0.155376;
        child.position.z = 4.39773;
      }
      child.scale.set(0, 0, 0);

      if (child.name === "small_cube") {
        child.scale.set(1, 1, 1);
      }

      if (child instanceof THREE.Group) {
        child.children.forEach((groupChild) => {
          groupChild.castShadow = true;
          groupChild.receiveShadow = true;
        });
      }

      this.roomChildren[child.name.toLowerCase()] = child;
    });
    const width = 0.5;
    const height = 0.3;
    const intensity = 3;
    this.rectLight = new THREE.RectAreaLight(
      0xffffff,
      intensity,
      width,
      height
    );

    this.rectLight.position.set(-4.8, 1.65, -1.1);
    this.rectLight.rotation.set(1.6, 9.4, 0.7);
    this.room.add(this.rectLight);
    this.rectLightHelper = new RectAreaLightHelper(this.rectLight);
    this.rectLight.add(this.rectLightHelper);
    this.roomChildren["rectLight"] = this.rectLight;


    // this.cubeFolder3 = this.gui.addFolder("Light rotation");
    // this.cubeFolder3.add(this.rectLight2.rotation, "x", -20, 20);
    // this.cubeFolder3.add(this.rectLight2.rotation, "y", -20, 20);
    // this.cubeFolder3.add(this.rectLight2.rotation, "z", -20, 20);
    // this.cubeFolder3 = this.gui.addFolder("Light position");
    // this.cubeFolder3.add(this.rectLight2.position, "x", -20, 20);
    // this.cubeFolder3.add(this.rectLight2.position, "y", -20, 20);
    // this.cubeFolder3.add(this.rectLight2.position, "z", -20, 20);
    // this.cubeFolder3.open();
    // this.room.position.y = -0.8;
    this.scene.add(this.room);
    this.room.scale.set(0.12, 0.12, 0.12);
  }

  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.room);
    this.moveBody = this.mixer.clipAction(this.fullRoom.animations[44]);
    this.moveBody.play();
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.rotation =
        ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
      this.lerp.target = this.rotation * 0.05;
    });
  }

  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    this.room.rotation.y = this.lerp.current;

    this.mixer.update(this.time.delta * 0.0009);
  }
}
