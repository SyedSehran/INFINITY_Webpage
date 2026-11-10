/**
 * INFINITY // 3D WebGL Torus Knot Scene
 * Authentic Three.js WebGL rendering for the hero canvas.
 * Interactive 3D Torus Knot reacting to real-time mouse coordinates and respecting prefers-reduced-motion.
 */

import * as THREE from './vendor/three.module.js';

export function init3DHeroScene(containerId = 'three-canvas-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Clear existing children
  container.innerHTML = '';

  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || 520;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 8.5;

  // Renderer
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    console.warn('WebGL not supported, falling back without 3D canvas:', e);
    return;
  }

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0); // Transparent background
  container.appendChild(renderer.domElement);

  // Group for rotation
  const knotGroup = new THREE.Group();
  scene.add(knotGroup);

  // Geometry: Classic Infinity Trefoil Torus Knot (p=2, q=3)
  const geometry = new THREE.TorusKnotGeometry(2.1, 0.55, 160, 24, 2, 3);

  // Solid Inner Material (Deep Carbon Ceramic)
  const solidMaterial = new THREE.MeshStandardMaterial({
    color: 0x0c0f17,
    roughness: 0.35,
    metalness: 0.85
  });
  const solidMesh = new THREE.Mesh(geometry, solidMaterial);
  knotGroup.add(solidMesh);

  // Wireframe Outer Layer (Vibrant Cyan-Emerald Tech Grid)
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
  knotGroup.add(wireframeMesh);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.5); // Radiant Cyan
  dirLight1.position.set(5, 8, 6);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x10b981, 2.0); // Vibrant Emerald
  dirLight2.position.set(-6, -6, -4);
  scene.add(dirLight2);

  const pointLight = new THREE.PointLight(0xa78bfa, 1.8, 50); // Soft Violet rim
  pointLight.position.set(0, 4, 3);
  scene.add(pointLight);

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mouse interaction
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Resize listener
  const onResize = () => {
    if (!container) return;
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || 520;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  window.addEventListener('resize', onResize);

  // Animation Loop
  let reqId = null;
  function animate() {
    reqId = requestAnimationFrame(animate);

    if (!prefersReducedMotion) {
      knotGroup.rotation.y += 0.007;
      knotGroup.rotation.x += 0.0035;

      // Mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      knotGroup.rotation.x = mouse.y * 0.35 + (knotGroup.rotation.x % (Math.PI * 2));
      knotGroup.rotation.z = mouse.x * 0.2;
    }

    renderer.render(scene, camera);
  }

  animate();

  return () => {
    if (reqId) cancelAnimationFrame(reqId);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
  };
}
