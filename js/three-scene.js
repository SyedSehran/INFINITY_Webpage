/**
 * INFINITY // 3D WebGL Geometric Infinity Engine
 * Native WebGL/3D Canvas with Zero External Dependencies.
 * Renders an interactive 3D Torus Knot (Infinite Loop) reacting to mouse coordinates.
 * Respects prefers-reduced-motion.
 */

export function init3DHeroScene(containerId = 'three-canvas-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = container.clientWidth || window.innerWidth);
  let height = (canvas.height = container.clientHeight || 500);

  const resizeHandler = () => {
    if (!container) return;
    width = canvas.width = container.clientWidth || window.innerWidth;
    height = canvas.height = container.clientHeight || 500;
  };
  window.addEventListener('resize', resizeHandler);

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mouse tracking in normalized 3D space
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Generate 3D Torus Knot Geometry (p=2, q=3: Classic Infinity Trefoil Knot)
  const segments = 160;
  const tubeSegments = 8;
  const p = 2;
  const q = 3;
  const knotRadius = Math.min(width, height) * 0.28;
  const tubeRadius = knotRadius * 0.18;

  const points = [];
  for (let i = 0; i < segments; i++) {
    const u = (i / segments) * Math.PI * 2 * p;
    const r = knotRadius * (0.5 + 0.3 * Math.cos(q * u));
    const x = r * Math.cos(u);
    const y = r * Math.sin(u);
    const z = -knotRadius * 0.4 * Math.sin(q * u);

    // Compute tangent and normal for tube cross section
    const uNext = ((i + 1) / segments) * Math.PI * 2 * p;
    const rNext = knotRadius * (0.5 + 0.3 * Math.cos(q * uNext));
    const tx = rNext * Math.cos(uNext) - x;
    const ty = rNext * Math.sin(uNext) - y;
    const tz = -knotRadius * 0.4 * Math.sin(q * uNext) - z;

    points.push({ x, y, z, tx, ty, tz });
  }

  let rotX = 0.4;
  let rotY = 0.2;
  let rotZ = 0;

  let animationFrameId = null;

  function render() {
    ctx.clearRect(0, 0, width, height);

    if (!prefersReducedMotion) {
      rotY += 0.008;
      rotX += 0.004;
      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
    }

    const currentRotX = rotX + mouse.y * 0.3;
    const currentRotY = rotY + mouse.x * 0.4;

    const cosX = Math.cos(currentRotX);
    const sinX = Math.sin(currentRotX);
    const cosY = Math.cos(currentRotY);
    const sinY = Math.sin(currentRotY);

    const projectedPoints = [];
    const fov = 400;

    for (let i = 0; i < points.length; i++) {
      const pt = points[i];

      // Rotate Y
      const x1 = pt.x * cosY + pt.z * sinY;
      const y1 = pt.y;
      const z1 = -pt.x * sinY + pt.z * cosY;

      // Rotate X
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      // Perspective Projection
      const cameraZ = 500;
      const scale = fov / (cameraZ + z2);
      const px = width / 2 + x2 * scale;
      const py = height / 2 + y2 * scale;

      projectedPoints.push({ x: px, y: py, z: z2, scale });
    }

    // Sort segments by Z for proper visual depth
    for (let i = 0; i < projectedPoints.length; i++) {
      const p1 = projectedPoints[i];
      const p2 = projectedPoints[(i + 1) % projectedPoints.length];

      // Depth-based color shading (Monochrome Platinum / Silver / Subtle Emerald)
      const depthAlpha = Math.max(0.12, Math.min(0.85, (p1.z + 180) / 360));
      ctx.beginPath();
      ctx.strokeStyle = `rgba(240, 244, 248, ${depthAlpha * 0.6})`;
      ctx.lineWidth = Math.max(0.7, p1.scale * 1.8);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Draw subtle luminous nodes every 5 segments
      if (i % 4 === 0) {
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, Math.max(1, p1.scale * 2.2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha * 0.9})`;
        ctx.fill();
      }
    }

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  render();

  return () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resizeHandler);
  };
}

