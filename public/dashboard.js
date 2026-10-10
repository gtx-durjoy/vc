// ==========================================================================
// LUNA 3D SERVER CONSOLE • ADVANCED CLIENT ENGINE (VERCEL READY)
// ==========================================================================

let currentUser = null;
let currentGuilds = [];
let activeGuild = null;
let guildChannels = [];
let guildRoles = [];
let audioEnabled = localStorage.getItem('luna_audio_enabled') !== 'false';

// ==========================================================================
// 1. WEB AUDIO API CYBERNETIC SOUND SYNTHESIZER
// ==========================================================================
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playCyberSound(type) {
  if (!audioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'dispatch') {
      // High-tech laser warp confirmation
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.22);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(120, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'boot') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (e) {
    // Audio context silently blocked until user interaction
  }
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  localStorage.setItem('luna_audio_enabled', audioEnabled ? 'true' : 'false');
  updateAudioButtonUI();
  if (audioEnabled) {
    playCyberSound('click');
    showToast("🔊 Cyber SFX Synthesizer Enabled");
  } else {
    showToast("🔇 Cyber SFX Muted");
  }
}

function updateAudioButtonUI() {
  const icon = document.getElementById('audio-toggle-icon');
  const text = document.getElementById('audio-toggle-text');
  const btn = document.getElementById('audio-toggle-btn');
  if (!btn) return;

  if (audioEnabled) {
    btn.classList.remove('muted');
    if (icon) icon.textContent = '🔊';
    if (text) text.textContent = 'SFX ON';
  } else {
    btn.classList.add('muted');
    if (icon) icon.textContent = '🔇';
    if (text) text.textContent = 'MUTED';
  }
}

// ==========================================================================
// 2. ULTRA 3D WEBGL THREE.JS BACKGROUND SCENE
// ==========================================================================
let scene3D, camera3D, renderer3D, mainTorus, particleMesh, holoCoreRenderer, holoCoreScene, holoCoreCamera;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

function initThreeBackground() {
  const container = document.getElementById('dash-webgl-canvas-container');
  if (!container || !window.THREE) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  scene3D = new THREE.Scene();
  scene3D.fog = new THREE.FogExp2(0x08090D, 0.0012);

  camera3D = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
  camera3D.position.z = 85;

  renderer3D = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer3D.setSize(width, height);
  renderer3D.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer3D.domElement);

  // 1. Central Holographic Torus Ring
  const torusGeo = new THREE.TorusGeometry(32, 1.2, 16, 100);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0x5865F2,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  mainTorus = new THREE.Mesh(torusGeo, torusMat);
  scene3D.add(mainTorus);

  // 2. Inner Neon Cyber Lattice
  const icosaGeo = new THREE.IcosahedronGeometry(18, 1);
  const icosaMat = new THREE.MeshBasicMaterial({
    color: 0x00F0FF,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const icosaMesh = new THREE.Mesh(icosaGeo, icosaMat);
  mainTorus.add(icosaMesh);

  // 3. Multi-Colored Floating Particle Starfield
  const particleCount = 1200;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorChoices = [
    new THREE.Color(0x00F0FF), // Neon Cyan
    new THREE.Color(0x5865F2), // Blurple
    new THREE.Color(0x9B59B6), // Purple
    new THREE.Color(0x57F287)  // Emerald
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 350;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 350;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 250;

    const chosenColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  particleMesh = new THREE.Points(particleGeo, particleMat);
  scene3D.add(particleMesh);

  // Mouse Listener for 3D Camera Parallax
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - width / 2) * 0.05;
    mouseY = (e.clientY - height / 2) * 0.05;
  });

  window.addEventListener('resize', onWindowResize3D);
  animateThree3D();
}

function onWindowResize3D() {
  if (!camera3D || !renderer3D) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera3D.aspect = width / height;
  camera3D.updateProjectionMatrix();
  renderer3D.setSize(width, height);
}

function animateThree3D() {
  requestAnimationFrame(animateThree3D);

  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;

  if (camera3D) {
    camera3D.position.x = targetX * 0.4;
    camera3D.position.y = -targetY * 0.4;
    camera3D.lookAt(0, 0, 0);
  }

  if (mainTorus) {
    mainTorus.rotation.x += 0.0018;
    mainTorus.rotation.y += 0.0028;
  }

  if (particleMesh) {
    particleMesh.rotation.y -= 0.0006;
  }

  if (renderer3D && scene3D && camera3D) {
    renderer3D.render(scene3D, camera3D);
  }
}

// ==========================================================================
// 3. 3D CARD TILT WITH SPECULAR GLARE REFLECTION
// ==========================================================================
function init3DCardTilt() {
  const cards = document.querySelectorAll('.card-3d-tilt');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8; // Max 8 deg
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// 3D Mini Holo Core Visualizer for Tab 8
function initHoloCoreMini() {
  const container = document.getElementById('holo-core-container');
  if (!container || !window.THREE || container.children.length > 0) return;

  const w = container.clientWidth || 600;
  const h = container.clientHeight || 320;

  holoCoreScene = new THREE.Scene();
  holoCoreCamera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  holoCoreCamera.position.z = 25;

  holoCoreRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  holoCoreRenderer.setSize(w, h);
  holoCoreRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(holoCoreRenderer.domElement);

  const sphereGeo = new THREE.SphereGeometry(6, 24, 24);
  const sphereMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, wireframe: true, transparent: true, opacity: 0.6 });
  const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
  holoCoreScene.add(coreSphere);

  const ringGeo = new THREE.RingGeometry(8, 9, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x5865F2, side: THREE.DoubleSide, wireframe: true, transparent: true, opacity: 0.5 });
  const coreRing = new THREE.Mesh(ringGeo, ringMat);
  coreRing.rotation.x = Math.PI / 3;
  holoCoreScene.add(coreRing);

  function animateHoloMini() {
    requestAnimationFrame(animateHoloMini);
    coreSphere.rotation.y += 0.01;
    coreSphere.rotation.x += 0.005;
    coreRing.rotation.z += 0.015;
    holoCoreRenderer.render(holoCoreScene, holoCoreCamera);
  }
  animateHoloMini();
}

// ==========================================================================
// 4. AUTHENTICATION & INITIALIZATION
// ==========================================================================
async function initDashboard() {
  updateAudioButtonUI();
  initThreeBackground();
  init3DCardTilt();

  const token = localStorage.getItem('luna_auth_token');

  try {
    const resp = await fetch('/api/auth.js?action=me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (!resp.ok) {
      window.location.href = '/';
      return;
    }

    const data = await resp.json();
    if (!data.authenticated || !data.user) {
      window.location.href = '/';
      return;
    }

    currentUser = data.user;
    renderUserProfile();
    await loadGuilds();
    playCyberSound('boot');
  } catch (err) {
    console.error("Dashboard init error:", err);
    window.location.href = '/';
  }
}

function renderUserProfile() {
  const nameEl = document.getElementById('user-name');
  const avatarEl = document.getElementById('user-avatar');

  if (nameEl) nameEl.textContent = currentUser.username || "Admin User";
  if (avatarEl && currentUser.avatar) {
    avatarEl.src = `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png`;
  }
}

function handleLogout() {
  playCyberSound('click');
  localStorage.removeItem('luna_auth_token');
  fetch('/api/auth.js?action=logout');
  window.location.href = '/';
}

// ==========================================================================
// 5. SERVER, CHANNELS & ROLES SYNC
// ==========================================================================
async function loadGuilds() {
  const token = localStorage.getItem('luna_auth_token');
  const serverSelect = document.getElementById('server-select');

  try {
    const resp = await fetch('/api/guilds.js', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = await resp.json();

    if (!data.success || !Array.isArray(data.guilds) || data.guilds.length === 0) {
      serverSelect.innerHTML = `<option value="">No manageable servers found</option>`;
      return;
    }

    currentGuilds = data.guilds;
    serverSelect.innerHTML = currentGuilds.map(g => `
      <option value="${g.id}">
        ${g.name} ${g.hasBot ? '🟢 (Connected)' : '⚠️ (Bot Not In Server)'}
      </option>
    `).join('');

    const statsServerCount = document.getElementById('stats-server-count');
    if (statsServerCount) statsServerCount.textContent = currentGuilds.filter(g => g.hasBot).length;

    // Pick first guild by default
    activeGuild = currentGuilds[0];
    updateServerHeader();
    await loadChannels(activeGuild.id);
    await loadRoles(activeGuild.id);
    await loadGuildSettings(activeGuild.id);
  } catch (err) {
    console.error("Load guilds error:", err);
  }
}

function onServerChange() {
  playCyberSound('click');
  const serverSelect = document.getElementById('server-select');
  const selectedId = serverSelect.value;
  activeGuild = currentGuilds.find(g => g.id === selectedId) || null;

  if (activeGuild) {
    updateServerHeader();
    loadChannels(activeGuild.id);
    loadRoles(activeGuild.id);
    loadGuildSettings(activeGuild.id);
  }
}

function updateServerHeader() {
  if (!activeGuild) return;
  const nameEl = document.getElementById('sidebar-server-name');
  const idEl = document.getElementById('sidebar-server-id');
  const iconEl = document.getElementById('sidebar-server-icon');
  const prevGuildName = document.getElementById('prev-welcome-guild-name');

  if (nameEl) nameEl.textContent = activeGuild.name;
  if (idEl) idEl.textContent = `ID: ${activeGuild.id}`;
  if (prevGuildName) prevGuildName.textContent = activeGuild.name;

  if (iconEl) {
    if (activeGuild.icon) {
      iconEl.innerHTML = `<img src="https://cdn.discordapp.com/icons/${activeGuild.id}/${activeGuild.icon}.png" alt="Server" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    } else {
      iconEl.textContent = activeGuild.name.substring(0, 2).toUpperCase();
    }
  }
}

async function loadChannels(guildId) {
  const token = localStorage.getItem('luna_auth_token');
  try {
    const resp = await fetch(`/api/channels.js?guildId=${guildId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = await resp.json();

    if (data.success && Array.isArray(data.channels)) {
      guildChannels = data.channels;
      populateChannelDropdowns();
    }
  } catch (err) {
    console.error("Load channels error:", err);
  }
}

function populateChannelDropdowns() {
  const selects = [
    'welcome-channel-select',
    'chat-channel-select',
    'rules-channel-select',
    'leave-channel-select',
    'verify-channel-select',
    'ticket-channel-select',
    'giveaway-channel-select',
    'announce-channel-select',
    'mod-channel-select',
    'lockdown-channel-select'
  ];

  const optionsHtml = guildChannels.length === 0
    ? `<option value="">No channels available</option>`
    : `<option value="">Select a Discord channel...</option>` + guildChannels.map(c => `
        <option value="${c.id}"># ${c.name}</option>
      `).join('');

  selects.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const currentVal = el.value;
      el.innerHTML = optionsHtml;
      if (currentVal) el.value = currentVal;
    }
  });

  // Auto-pick sensible defaults if channels match names
  setDefaultChannel('welcome-channel-select', ['welcome', 'joins', 'welcome-bye', 'general']);
  setDefaultChannel('chat-channel-select', ['chat', 'general', 'main-chat', 'lounge']);
  setDefaultChannel('rules-channel-select', ['rules', 'rule', 'info', 'guidelines']);
  setDefaultChannel('leave-channel-select', ['leave', 'goodbye', 'bye', 'logs']);
  setDefaultChannel('verify-channel-select', ['verify', 'verification', 'rules']);
  setDefaultChannel('ticket-channel-select', ['tickets', 'ticket', 'support']);
  setDefaultChannel('giveaway-channel-select', ['giveaway', 'giveaways', 'events']);
  setDefaultChannel('announce-channel-select', ['announcements', 'news', 'updates']);
  setDefaultChannel('lockdown-channel-select', ['general', 'main-chat']);

  updateWelcomePreview();
}

function setDefaultChannel(elementId, preferredKeywords) {
  const el = document.getElementById(elementId);
  if (!el || el.value || guildChannels.length === 0) return;

  for (const kw of preferredKeywords) {
    const match = guildChannels.find(c => c.name.toLowerCase().includes(kw));
    if (match) {
      el.value = match.id;
      return;
    }
  }

  // fallback to first channel
  if (guildChannels[0]) el.value = guildChannels[0].id;
}

async function loadRoles(guildId) {
  try {
    const resp = await fetch(`/api/roles.js?guildId=${guildId}`);
    const data = await resp.json();

    if (data.success && Array.isArray(data.roles)) {
      guildRoles = data.roles;
      const roleSelect = document.getElementById('verify-role-select');
      if (roleSelect) {
        roleSelect.innerHTML = `<option value="">Select Verified Role...</option>` +
          guildRoles.map(r => `<option value="${r.id}">${r.name}</option>`).join('');

        // Try to pre-select role containing VERIF
        const verifyRole = guildRoles.find(r => r.name.toLowerCase().includes('verif'));
        if (verifyRole) {
          roleSelect.value = verifyRole.id;
        }
        updateVerifyPreview();
      }
    }
  } catch (err) {
    console.error("Load roles error:", err);
  }
}

async function loadGuildSettings(guildId) {
  try {
    const resp = await fetch(`/api/settings.js?guildId=${guildId}`);
    const data = await resp.json();

    if (data.success && data.settings) {
      const s = data.settings;
      if (s.welcome_channel_id) {
        const welEl = document.getElementById('welcome-channel-select');
        if (welEl) welEl.value = s.welcome_channel_id;
      }
      if (s.chat_channel_id) {
        const chatEl = document.getElementById('chat-channel-select');
        if (chatEl) chatEl.value = s.chat_channel_id;
      }
      if (s.rules_channel_id) {
        const rulesEl = document.getElementById('rules-channel-select');
        if (rulesEl) rulesEl.value = s.rules_channel_id;
      }
      if (s.welcome_banner) {
        const bannerEl = document.getElementById('welcome-banner-input');
        if (bannerEl) bannerEl.value = s.welcome_banner;
      }
      if (s.leave_channel_id) {
        const leaveEl = document.getElementById('leave-channel-select');
        if (leaveEl) leaveEl.value = s.leave_channel_id;
      }
      if (s.leave_banner) {
        const leaveBannerEl = document.getElementById('leave-banner-input');
        if (leaveBannerEl) leaveBannerEl.value = s.leave_banner;
      }
      updateWelcomePreview();
      updateLeavePreview();
    }
  } catch (err) {
    console.error("Load settings error:", err);
  }
}

// ==========================================================================
// 6. WELCOME & LEAVE STUDIO ACTIONS
// ==========================================================================
function updateWelcomePreview() {
  const bannerInput = document.getElementById('welcome-banner-input');
  const bannerImg = document.getElementById('prev-welcome-banner-img');
  const chatSelect = document.getElementById('chat-channel-select');
  const rulesSelect = document.getElementById('rules-channel-select');
  const prevChat = document.getElementById('prev-w-chat');
  const prevRules = document.getElementById('prev-w-rules');

  if (bannerImg && bannerInput) {
    bannerImg.src = bannerInput.value || 'https://media.giphy.com/media/qXdb9xFp3cqYnqQ6RI/giphy.gif';
  }

  if (prevChat && chatSelect) {
    const selectedOption = chatSelect.options[chatSelect.selectedIndex];
    prevChat.textContent = selectedOption && selectedOption.value ? selectedOption.text : '#main-chat';
  }

  if (prevRules && rulesSelect) {
    const selectedOption = rulesSelect.options[rulesSelect.selectedIndex];
    prevRules.textContent = selectedOption && selectedOption.value ? selectedOption.text : '#rules';
  }
}

function setWelcomeBanner(url) {
  playCyberSound('click');
  const bannerInput = document.getElementById('welcome-banner-input');
  if (bannerInput) {
    bannerInput.value = url;
    updateWelcomePreview();
    showToast("Banner preset loaded!");
  }
}

async function saveWelcomeSettings() {
  playCyberSound('click');
  if (!activeGuild) return showToast("Select a server first!", true);

  const channelId = document.getElementById('welcome-channel-select').value;
  const chatChannelId = document.getElementById('chat-channel-select').value;
  const rulesChannelId = document.getElementById('rules-channel-select').value;
  const bannerUrl = document.getElementById('welcome-banner-input').value;

  if (!channelId) return showToast("Please select a welcome channel!", true);

  try {
    const resp = await fetch('/api/settings.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guildId: activeGuild.id,
        settings: {
          welcome_channel_id: channelId,
          chat_channel_id: chatChannelId,
          rules_channel_id: rulesChannelId,
          welcome_banner: bannerUrl,
          welcome_enabled: 1
        }
      })
    });

    const data = await resp.json();
    if (data.success) {
      playCyberSound('success');
      showToast("💾 Welcome settings saved successfully!");
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    playCyberSound('error');
    showToast("Error saving welcome settings: " + err.message, true);
  }
}

async function dispatchWelcomeTest() {
  playCyberSound('dispatch');
  const channelId = document.getElementById('welcome-channel-select').value;
  if (!channelId) return showToast("Select a Welcome Channel first!", true);

  const bannerUrl = document.getElementById('welcome-banner-input').value;
  const chatChannelId = document.getElementById('chat-channel-select').value;
  const rulesChannelId = document.getElementById('rules-channel-select').value;

  showToast("🚀 Dispatching Luxury Welcome Card to Discord...");

  try {
    const resp = await fetch('/api/discord-action.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'test-welcome',
        channelId: channelId,
        data: {
          serverName: activeGuild ? activeGuild.name : 'Server',
          bannerUrl: bannerUrl,
          chatChannelId: chatChannelId,
          rulesChannelId: rulesChannelId
        }
      })
    });

    const data = await resp.json();
    if (data.success) {
      playCyberSound('success');
      showToast("✨ Card successfully sent to Discord channel!");
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    playCyberSound('error');
    showToast("Failed to dispatch: " + err.message, true);
  }
}

function updateLeavePreview() {
  const bannerInput = document.getElementById('leave-banner-input');
  const bannerImg = document.getElementById('prev-leave-banner-img');
  if (bannerImg && bannerInput) {
    bannerImg.src = bannerInput.value || 'https://media.giphy.com/media/26u4b45b8KlgAB7iM/giphy.gif';
  }
}

async function saveLeaveSettings() {
  playCyberSound('click');
  if (!activeGuild) return showToast("Select a server first!", true);

  const channelId = document.getElementById('leave-channel-select').value;
  const bannerUrl = document.getElementById('leave-banner-input').value;

  try {
    const resp = await fetch('/api/settings.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guildId: activeGuild.id,
        settings: {
          leave_channel_id: channelId,
          leave_banner: bannerUrl,
          leave_enabled: 1
        }
      })
    });

    const data = await resp.json();
    if (data.success) {
      playCyberSound('success');
      showToast("💾 Leave settings saved successfully!");
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    playCyberSound('error');
    showToast("Error saving leave settings: " + err.message, true);
  }
}

async function dispatchLeaveTest() {
  playCyberSound('dispatch');
  const channelId = document.getElementById('leave-channel-select').value;
  if (!channelId) return showToast("Select a Leave Channel first!", true);

  const bannerUrl = document.getElementById('leave-banner-input').value;
  showToast("🚀 Dispatching Leave Log to Discord...");

  try {
    const resp = await fetch('/api/discord-action.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'test-leave',
        channelId: channelId,
        data: {
          serverName: activeGuild ? activeGuild.name : 'Server',
          bannerUrl: bannerUrl
        }
      })
    });

    const data = await resp.json();
    if (data.success) {
      playCyberSound('success');
      showToast("🚪 Farewell card sent to Discord!");
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    playCyberSound('error');
    showToast("Failed to dispatch: " + err.message, true);
  }
}

// ==========================================================================
// 7. AUTO-ROLES & MEMBER VERIFICATION ACTIONS
// ==========================================================================
function updateVerifyPreview() {
  const title = document.getElementById('verify-title-input').value;
  const desc = document.getElementById('verify-desc-input').value;
  const roleSelect = document.getElementById('verify-role-select');
  const prevTitle = document.getElementById('prev-verify-title');
  const prevDesc = document.getElementById('prev-verify-desc');
  const prevBadge = document.getElementById('prev-verify-role-badge');

  if (prevTitle) prevTitle.textContent = title || 'Server Member Verification Portal';
  if (prevDesc) prevDesc.textContent = desc || 'Welcome to the server! Click below to verify.';
  if (prevBadge && roleSelect) {
    const selRole = roleSelect.options[roleSelect.selectedIndex];
    prevBadge.textContent = selRole && selRole.value ? `@${selRole.text}` : '@VERIFIED';
  }
}

async function deployVerificationPanel() {
  playCyberSound('dispatch');
  const channelId = document.getElementById('verify-channel-select').value;
  const roleId = document.getElementById('verify-role-select').value;
  const title = document.getElementById('verify-title-input').value;
  const desc = document.getElementById('verify-desc-input').value;

  if (!channelId) return showToast("Select a verification target channel!", true);

  showToast("⚡ Deploying Verification Portal to Discord...");

  try {
    const resp = await fetch('/api/discord-action.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deploy-verification',
        channelId: channelId,
        data: { title, description: desc, roleId }
      })
    });

    const data = await resp.json();
    if (data.success) {
      playCyberSound('success');
      showToast("🛡️ Verification Portal deployed with [Verify Me] button!");
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    playCyberSound('error');
    showToast("Failed: " + err.message, true);
  }
}

// ==========================================================================
// 8. SUPPORT TICKET PORTAL ACTIONS
// ==========================================================================
function updateTicketPreview() {
  const title = document.getElementById('ticket-title-input').value;
  const desc = document.getElementById('ticket-desc-input').value;
  const prevTitle = document.getElementById('prev-ticket-title');
  const prevDesc = document.getElementById('prev-ticket-desc');

  if (prevTitle) prevTitle.textContent = title || 'Support & Assistance Portal';
  if (prevDesc) prevDesc.textContent = desc || 'Click below to open a ticket.';
}

async function deployTicketPanel() {
  playCyberSound('dispatch');
  const channelId = document.getElementById('ticket-channel-select').value;
  const title = document.getElementById('ticket-title-input').value;
  const desc = document.getElementById('ticket-desc-input').value;

  if (!channelId) return showToast("Select a ticket channel first!", true);

  showToast("⚡ Deploying Ticket Generator to Discord...");

  try {
    const resp = await fetch('/api/discord-action.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deploy-ticket',
        channelId: channelId,
        data: { title, description: desc }
      })
    });

    const data = await resp.json();
    if (data.success) {
      playCyberSound('success');
      showToast("🎫 Support Ticket Panel deployed with interactive button!");
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    playCyberSound('error');
    showToast("Failed: " + err.message, true);
  }
}

// ==========================================================================
// 9. LIVE GIVEAWAY ACTIONS
// ==========================================================================
function updateGiveawayPreview() {
  const prize = document.getElementById('giveaway-prize-input').value;
  const durSelect = document.getElementById('giveaway-duration-select');
  const winSelect = document.getElementById('giveaway-winners-select');

  const prevTitle = document.getElementById('prev-giveaway-title');
  const prevTime = document.getElementById('prev-giveaway-time');
  const prevWinners = document.getElementById('prev-giveaway-winners');

  if (prevTitle) prevTitle.textContent = `🎉 GIVEAWAY: ${prize || 'Discord Nitro'}`;
  if (prevTime && durSelect) {
    prevTime.textContent = durSelect.options[durSelect.selectedIndex].text;
  }
  if (prevWinners && winSelect) {
    prevWinners.textContent = winSelect.options[winSelect.selectedIndex].text;
  }
}

async function launchGiveaway() {
  playCyberSound('dispatch');
  const channelId = document.getElementById('giveaway-channel-select').value;
  const prize = document.getElementById('giveaway-prize-input').value;
  const duration = document.getElementById('giveaway-duration-select').value;
  const winners = document.getElementById('giveaway-winners-select').value;

  if (!channelId) return showToast("Select a giveaway channel first!", true);
  if (!prize) return showToast("Please specify a prize name!", true);

  showToast(`🎉 Launching Giveaway for '${prize}' in Discord...`);

  try {
    const resp = await fetch('/api/discord-action.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'launch-giveaway',
        channelId: channelId,
        data: {
          prize: prize,
          durationMinutes: duration,
          winnersCount: winners
        }
      })
    });

    const data = await resp.json();
    if (data.success) {
      playCyberSound('success');
      showToast("🎁 Giveaway successfully launched with Join button!");
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    playCyberSound('error');
    showToast("Failed: " + err.message, true);
  }
}

// ==========================================================================
// 10. EMBED BROADCASTER ACTIONS
// ==========================================================================
function updateAnnouncePreview() {
  const title = document.getElementById('announce-title-input').value;
  const desc = document.getElementById('announce-desc-input').value;
  const color = document.getElementById('announce-color-input').value;
  const banner = document.getElementById('announce-banner-input').value;

  const prevTitle = document.getElementById('prev-announce-title');
  const prevDesc = document.getElementById('prev-announce-desc');
  const prevBar = document.getElementById('prev-announce-bar');
  const bannerBox = document.getElementById('prev-announce-banner-box');
  const bannerImg = document.getElementById('prev-announce-banner-img');

  if (prevTitle) prevTitle.textContent = title ? `📢 ${title}` : '📢 Important Community Announcement';
  if (prevDesc) prevDesc.textContent = desc || 'Your announcement text here...';
  if (prevBar) prevBar.style.background = color || '#5865F2';

  if (bannerBox && bannerImg) {
    if (banner && banner.startsWith('http')) {
      bannerBox.style.display = 'block';
      bannerImg.src = banner;
    } else {
      bannerBox.style.display = 'none';
    }
  }
}

async function publishAnnouncement() {
  playCyberSound('dispatch');
  const channelId = document.getElementById('announce-channel-select').value;
  const title = document.getElementById('announce-title-input').value;
  const message = document.getElementById('announce-desc-input').value;
  const color = document.getElementById('announce-color-input').value;
  const bannerUrl = document.getElementById('announce-banner-input').value;

  if (!channelId) return showToast("Select an announcement channel first!", true);
  if (!message) return showToast("Message content cannot be empty!", true);

  showToast("📢 Publishing Announcement to Discord...");

  try {
    const resp = await fetch('/api/discord-action.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'announce',
        channelId: channelId,
        data: { title, message, color, bannerUrl }
      })
    });

    const data = await resp.json();
    if (data.success) {
      playCyberSound('success');
      showToast("📢 Announcement published to Discord channel!");
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    playCyberSound('error');
    showToast("Publish failed: " + err.message, true);
  }
}

// ==========================================================================
// 11. EMERGENCY DEFENSE & SLOWMODE ACTIONS
// ==========================================================================
async function applySlowmode() {
  playCyberSound('click');
  const channelId = document.getElementById('mod-channel-select').value;
  const seconds = document.getElementById('mod-slowmode-select').value;

  if (!channelId) return showToast("Select a channel first!", true);

  showToast("🛡️ Applying slowmode cooldown to channel...");

  try {
    const resp = await fetch('/api/discord-action.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'slowmode',
        channelId: channelId,
        data: { seconds: seconds }
      })
    });

    const data = await resp.json();
    if (data.success) {
      playCyberSound('success');
      showToast(data.message || "Slowmode applied successfully!");
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    playCyberSound('error');
    showToast("Slowmode error: " + err.message, true);
  }
}

async function triggerLockdown() {
  playCyberSound('error');
  const channelId = document.getElementById('lockdown-channel-select').value;
  const reason = document.getElementById('lockdown-reason-input').value;

  if (!channelId) return showToast("Select a target channel for lockdown!", true);

  showToast("🚨 Broadcasting Emergency Lockdown Alert...");

  try {
    const resp = await fetch('/api/discord-action.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'lockdown',
        channelId: channelId,
        data: { reason: reason }
      })
    });

    const data = await resp.json();
    if (data.success) {
      playCyberSound('dispatch');
      showToast("🚨 EMERGENCY LOCKDOWN ALERT SENT TO DISCORD!");
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    playCyberSound('error');
    showToast("Failed: " + err.message, true);
  }
}

// ==========================================================================
// 12. TAB SWITCHER & TOAST SYSTEM
// ==========================================================================
function switchDashTab(tabName) {
  playCyberSound('click');
  document.querySelectorAll('.side-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.dash-section-pane').forEach(pane => pane.classList.remove('active'));

  const activeBtn = Array.from(document.querySelectorAll('.side-tab-btn')).find(b => b.getAttribute('onclick')?.includes(tabName));
  const activePane = document.getElementById(`tab-${tabName}-content`);

  if (activeBtn) activeBtn.classList.add('active');
  if (activePane) activePane.classList.add('active');

  // Trigger 3D mini visualizer if Tab 8
  if (tabName === 'bot') {
    setTimeout(initHoloCoreMini, 100);
  }

  // Refresh 3D card tilt listeners
  setTimeout(init3DCardTilt, 50);
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toast-message');
  if (!toast || !text) return;

  text.textContent = message;
  toast.style.borderColor = isError ? 'var(--crimson-danger)' : 'var(--emerald-success)';
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4200);
}

// Boot up dashboard on window load
window.addEventListener('DOMContentLoaded', initDashboard);
