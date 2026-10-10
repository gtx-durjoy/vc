// ==========================================================================
// LUNA DASHBOARD LANDING PAGE & AUTHENTICATION CONTROLLER
// ==========================================================================

function openLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.classList.add('active');
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.classList.remove('active');
}

async function loginWithDiscord() {
  try {
    const resp = await fetch('/api/auth.js?action=login-url');
    const data = await resp.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Could not generate Discord OAuth URL. Please check your APPLICATION_ID.");
    }
  } catch (err) {
    alert("Connection error: " + err.message);
  }
}

async function handlePasskeyLogin(e) {
  e.preventDefault();
  const passkey = document.getElementById('admin-passkey').value.trim();
  if (!passkey) return;

  try {
    const resp = await fetch('/api/auth.js?action=passkey-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passkey, username: "Durjoy (Server Master)" })
    });

    const data = await resp.json();
    if (data.success && data.token) {
      localStorage.setItem('luna_auth_token', data.token);
      window.location.href = '/dashboard.html';
    } else {
      alert(data.error || "Incorrect Passkey. Access Denied.");
    }
  } catch (err) {
    alert("Login failed: " + err.message);
  }
}

// Three.js 3D Background Scene for Landing Page
function initLanding3D() {
  const container = document.getElementById('webgl-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 550;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  // Glowing sphere
  const sphereGeo = new THREE.SphereGeometry(130, 28, 28);
  const sphereMat = new THREE.PointsMaterial({
    color: 0x00F0FF,
    size: 3.2,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const sphere = new THREE.Points(sphereGeo, sphereMat);
  group.add(sphere);

  // Concentric Rings
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(220, 2.0, 16, 90),
    new THREE.MeshBasicMaterial({ color: 0x5865F2, wireframe: true, transparent: true, opacity: 0.4 })
  );
  ring1.rotation.x = Math.PI / 3;
  group.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(270, 1.8, 16, 90),
    new THREE.MeshBasicMaterial({ color: 0x9B59B6, wireframe: true, transparent: true, opacity: 0.4 })
  );
  ring2.rotation.y = Math.PI / 4;
  group.add(ring2);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.0006;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.0006;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.004;
    ring1.rotation.z += 0.006;
    ring2.rotation.z -= 0.005;

    group.rotation.y += (mouseX - group.rotation.y) * 0.05;
    group.rotation.x += (mouseY - group.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }

  animate();
}

document.addEventListener('DOMContentLoaded', () => {
  initLanding3D();

  // Check if redirected with an error (e.g. missing Discord Client Secret)
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  if (error) {
    openLoginModal();
    if (error === 'missing_secret') {
      alert("💡 Discord OAuth2 requires Client Secret in Discord Developer Portal.\n\n👉 You can log in directly right now by clicking 'Enter Dashboard Immediately' with the prefilled Passkey (luna2026)!");
    } else {
      alert("Notice: " + (params.get('details') || error));
    }
  }
});
