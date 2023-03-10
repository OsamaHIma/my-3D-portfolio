import * as THREE from "three";
import Experience from "../Experience";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { EventEmitter } from "events";
export default class Resources extends EventEmitter {
  constructor(assets) {
    super();
    this.experience = new Experience();
    this.renderer = this.experience.renderer;
    this.assets = assets;

    this.items = {};
    this.queue = this.assets.length;
    this.loaded = 0;
    this.introProgressBar = document.getElementById("intro-progress-bar");
    this.loaderManager = new THREE.LoadingManager();
    this.setLoaders();
    this.startLoading();
  }
  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader(this.loaderManager);
    this.loaders.dracoLoader = new DRACOLoader(this.loaderManager);
    this.loaders.dracoLoader.setDecoderPath("/draco/");
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
  }
  startLoading() {
    this.loaderManager.onProgress = (url, loaded, total) => {
      const loadedNum = `${((loaded / total) * 100).toFixed()}%`;
      this.introProgressBar.textContent = loadedNum;
      this.introProgressBar.style.width = `${loadedNum}`;
    };
    this.assets.forEach((asset) => {
      if (asset.type === "glbModel") {
        this.loaders.gltfLoader.load(asset.path, (file) => {
          this.singleAssetLoaded(asset, file);
        });
      } else if (asset.type === "videoTexture") {
        this.video = {};
        this.videoTexture = {};
        this.video[asset.name] = document.createElement("video");
        this.video[asset.name].src = asset.path;
        this.video[asset.name].muted = true;
        this.video[asset.name].playsInline = true;
        this.video[asset.name].loop = true;
        this.video[asset.name].autoPlay = true;
        this.video[asset.name].play();
        this.videoTexture[asset.name] = new THREE.VideoTexture(
          this.video[asset.name]
        );
        // this.videoTexture[asset.name].flipX = true;
        this.videoTexture[asset.name].minFilter = THREE.NearestFilter;
        this.videoTexture[asset.name].magFilter = THREE.NearestFilter;
        this.videoTexture[asset.name].generateMipmaps = false;
        this.videoTexture[asset.name].encoding = THREE.sRGBEncoding;
        this.singleAssetLoaded(asset, this.videoTexture[asset.name]);
      }
    });
  }
  singleAssetLoaded(asset, file) {
    this.items[asset.name] = file;
    this.loaded++;
    if (this.loaded === this.queue) {
      this.emit("ready");
    }
  }
}
