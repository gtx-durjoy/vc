// ==========================================================================
// LUNA DASHBOARD LANDING PAGE & AUTHENTICATION CONTROLLER (DURJOY STYLED)
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

// ==========================================================================
// CUSTOM CURSOR & PARTICLES (durjoyxcheat.bond style)
// ==========================================================================
const initCursor = () => {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  const particlesContainer = document.getElementById('particles');

  if (!cursorDot || !cursorOutline) return;

  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 400, fill: "forwards" });

      // Spawn subtle glowing red particle
      if (particlesContainer && Math.random() > 0.4) {
        const p = document.createElement('div');
        p.className = 'cursor-particle';
        p.style.left = `${posX}px`;
        p.style.top = `${posY}px`;
        particlesContainer.appendChild(p);

        setTimeout(() => {
          p.style.transition = 'all 0.6s ease';
          p.style.transform = 'translateY(15px) scale(0)';
          p.style.opacity = '0';
          setTimeout(() => p.remove(), 600);
        }, 20);
      }
    });

    const clickables = document.querySelectorAll('a, button, .feature-box, .btn');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '55px';
        cursorOutline.style.height = '55px';
        cursorOutline.style.backgroundColor = 'rgba(255, 42, 42, 0.15)';
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
      });
    });
  } else {
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
  }
};

// ==========================================================================
// SECURITY DEVTOOLS & INSPECT PROTECTION (durjoyxcheat.bond style)
// ==========================================================================
const initSecurityToast = () => {
  const toast = document.getElementById('security-toast');
  if (!toast) return;

  const showSecurityNotice = () => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  document.addEventListener('contextmenu', (e) => {
    // Optional discreet toast on right click
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      showSecurityNotice();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))) {
      showSecurityNotice();
    }
  });
};

// ==========================================================================
// THREE.JS CRIMSON FLOATING EMBER PARTICLES SCENE (durjoyxcheat.bond style)
// ==========================================================================
function initLanding3D() {
  const container = document.getElementById('webgl-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050000, 0.002);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 1000;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
  const isMobile = window.innerWidth <= 900;
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Floating crimson embers
  const particleCount = isMobile ? 1500 : 3500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1600 + 200;

    velocities.push({
      x: (Math.random() - 0.5) * 0.4,
      y: Math.random() * 1.8 + 0.4, // Floating upwards gently
      z: (Math.random() - 0.5) * 0.4
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Circular ember particle texture
  const particleCanvas = document.createElement('canvas');
  particleCanvas.width = 16;
  particleCanvas.height = 16;
  const pCtx = particleCanvas.getContext('2d');
  const gradient = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.3, '#ff2a2a');
  gradient.addColorStop(0.8, '#880000');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  pCtx.fillStyle = gradient;
  pCtx.fillRect(0, 0, 16, 16);
  const pTexture = new THREE.CanvasTexture(particleCanvas);

  const material = new THREE.PointsMaterial({
    size: 6,
    map: pTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.85
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Concentric gothic cyber rings in center background
  const ringGroup = new THREE.Group();
  scene.add(ringGroup);

  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(320, 2, 16, 90),
    new THREE.MeshBasicMaterial({ color: 0xff2a2a, wireframe: true, transparent: true, opacity: 0.35 })
  );
  ring1.rotation.x = Math.PI / 3;
  ringGroup.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(400, 1.5, 16, 90),
    new THREE.MeshBasicMaterial({ color: 0x960018, wireframe: true, transparent: true, opacity: 0.25 })
  );
  ring2.rotation.y = Math.PI / 4;
  ringGroup.add(ring2);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.0004;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.0004;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const animate = () => {
    requestAnimationFrame(animate);

    const pos = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 2] += velocities[i].z;

      // Wrap around screen top
      if (pos[i * 3 + 1] > 1100) {
        pos[i * 3 + 1] = -1100;
        pos[i * 3] = (Math.random() - 0.5) * 2200;
      }
    }
    geometry.attributes.position.needsUpdate = true;

    ring1.rotation.z += 0.002;
    ring2.rotation.z -= 0.0015;

    camera.position.x += (mouseX * 1000 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 1000 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  };

  animate();
}

window.addEventListener('DOMContentLoaded', () => {
  initLanding3D();
  initCursor();
  initSecurityToast();
});
