import "./style.css";
import * as THREE from "three";

import * as dat from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const gui = new dat.GUI({
  width: 400,
});
const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// * sizes

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// * camera

const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height);
camera.position.z = 5;
camera.position.y = 1;
scene.add(camera);

// * Textures

const bakedTexture = textureLoader.load("finalBaked.png");
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

// * MODEL
gltfLoader.load("portal.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    child.material = bakedMaterial;
  });
  scene.add(gltf.scene);
  console.log("model loaded");
});

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.outputColorSpace = THREE.SRGBColorSpace;
const animate = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
