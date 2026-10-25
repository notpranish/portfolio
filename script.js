document.addEventListener('DOMContentLoaded', () => {

  // 1. Footer Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =========================================================
  // OPERA GX & MECHANICAL KEYBOARD AUDIO SYNTHESIZER ENGINE
  // =========================================================
  let audioCtx = null;
  let hasBooted = false;

  function initAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Startup Boot Chime (Plays once when opening/interacting with website)
  function playBootSound() {
    if (hasBooted) return;
    hasBooted = true;

    try {
      initAudioContext();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      // Harmonious ascending startup chord
      osc1.frequency.setValueAtTime(261.63, now); // C4
      osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.35); // C5

      osc2.frequency.setValueAtTime(392.00, now); // G4
      osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.35); // E5

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(0.06, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      // Audio fallback
    }
  }

  // Trigger boot sound on the very first click or keypress anywhere on the page
  window.addEventListener('pointerdown', playBootSound, { once: true });
  window.addEventListener('keydown', playBootSound, { once: true });

  // Opera GX Hover Tick (Crisp feedback)
  function playHoverSound() {
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.035);

      gainNode.gain.setValueAtTime(0.045, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.035);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.035);
    } catch (e) {}
  }

  // Mechanical Keyboard Switch Sound
  function playKeypressSound(isBackspace = false) {
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      const baseFreq = isBackspace ? 200 : 290 + (Math.random() * 50 - 25);
      osc.type = 'triangle';
      
      osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.045);

      gainNode.gain.setValueAtTime(0.075, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.045);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.045);
    } catch (e) {}
  }

  // Attach Hover Sounds to interactive elements
  const hoverElements = document.querySelectorAll('button, a, .glass-card, .game-tab, .social-pill, .theme-option-btn');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => playHoverSound());
  });

  // Attach Mechanical Keyboard Sounds to text inputs & textareas
  const inputElements = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
  inputElements.forEach(input => {
    input.addEventListener('keydown', (e) => {
      const isBackspace = e.key === 'Backspace' || e.key === 'Delete';
      playKeypressSound(isBackspace);
    });
  });

  // =========================================================
  // 2. FULL SCENE ENVIRONMENT CANVAS ANIMATION & THEME SWITCHER
  // =========================================================
  let currentTheme = 'space';
  const themeOptionBtns = document.querySelectorAll('.theme-option-btn');
  const themeCurrentText = document.getElementById('theme-current-text');

  const bgCanvas = document.getElementById('bg-canvas');
  let ctx = null;

  if (bgCanvas) {
    ctx = bgCanvas.getContext('2d');

    function resizeBg() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
    }
    resizeBg();
    window.addEventListener('resize', resizeBg);

    let spaceStars = [];
    let egyptParticles = [];
    let cyberpunkGridOffset = 0;

    for (let i = 0; i < 60; i++) {
      spaceStars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.2 + 0.05
      });
    }

    for (let i = 0; i < 40; i++) {
      egyptParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: Math.random() * 0.5 + 0.2,
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    function animateScene() {
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

      if (currentTheme === 'space') {
        spaceStars.forEach(star => {
          star.y -= star.speed;
          if (star.y < 0) star.y = bgCanvas.height;

          ctx.fillStyle = `rgba(0, 229, 255, ${star.alpha})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (currentTheme === 'egypt') {
        const groundY = bgCanvas.height - 100;

        let duneGrad = ctx.createLinearGradient(0, groundY - 50, 0, bgCanvas.height);
        duneGrad.addColorStop(0, '#2d1f0c');
        duneGrad.addColorStop(1, '#161007');
        ctx.fillStyle = duneGrad;
        ctx.beginPath();
        ctx.moveTo(0, bgCanvas.height);
        ctx.lineTo(0, groundY);
        ctx.quadraticCurveTo(bgCanvas.width * 0.3, groundY - 40, bgCanvas.width * 0.6, groundY);
        ctx.quadraticCurveTo(bgCanvas.width * 0.85, groundY - 30, bgCanvas.width, groundY - 20);
        ctx.lineTo(bgCanvas.width, bgCanvas.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#22170b';
        ctx.beginPath();
        ctx.moveTo(120, groundY);
        ctx.lineTo(260, groundY - 140);
        ctx.lineTo(400, groundY);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(bgCanvas.width - 450, groundY);
        ctx.lineTo(bgCanvas.width - 300, groundY - 210);
        ctx.lineTo(bgCanvas.width - 150, groundY);
        ctx.closePath();
        ctx.fill();

        egyptParticles.forEach(p => {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.y > bgCanvas.height) { p.y = 0; p.x = Math.random() * bgCanvas.width; }

          ctx.fillStyle = `rgba(245, 197, 66, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (currentTheme === 'cyberpunk') {
        cyberpunkGridOffset = (cyberpunkGridOffset + 1.5) % 40;
        
        ctx.strokeStyle = 'rgba(255, 0, 127, 0.25)';
        ctx.lineWidth = 1.5;

        const horizonY = bgCanvas.height * 0.55;

        for (let x = -bgCanvas.width; x < bgCanvas.width * 2; x += 80) {
          ctx.beginPath();
          ctx.moveTo(bgCanvas.width / 2, horizonY);
          ctx.lineTo(x + cyberpunkGridOffset * 2, bgCanvas.height);
          ctx.stroke();
        }

        for (let y = horizonY; y < bgCanvas.height; y += (y - horizonY) * 0.15 + 4) {
          let adjustedY = y + (cyberpunkGridOffset % 40);
          if (adjustedY < bgCanvas.height) {
            ctx.beginPath();
            ctx.moveTo(0, adjustedY);
            ctx.lineTo(bgCanvas.width, adjustedY);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateScene);
    }
    animateScene();
  }

  themeOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      themeOptionBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentTheme = btn.getAttribute('data-theme-set');
      document.body.setAttribute('data-theme', currentTheme);

      if (themeCurrentText) {
        themeCurrentText.textContent = btn.textContent.replace(/[🌌🏺⚡]/g, '').trim();
      }
    });
  });

  // 3. Project Modal Popups with Live Previews & Auto-Scroll to Contact
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalTag = document.getElementById('modal-tag');
  const modalActions = document.getElementById('modal-actions');

  const projectDetails = [
    { 
      title: "Tech Metrics & Analytics Dashboard", 
      tag: "Full-Stack Web App",
      content: `
        <p>A full-stack performance dashboard built to track real-time system hardware, CPU usage, and visitor analytics.</p>
        <div class="modal-sandbox">
          <h4>🔴 Live Simulated Server Output:</h4>
          <div class="terminal-mock">
            <p>> initializing system diagnostics...</p>
            <p>> CPU Load: <span style="color: #00ffaa;">14.2% (Optimal)</span></p>
            <p>> Active Memory: <span style="color: #00e5ff;">4.8 GB / 16 GB</span></p>
            <p>> Status: Connected to secure websocket node.</p>
          </div>
        </div>
      `,
      actionText: "Request Code Access",
      actionType: "scroll-contact"
    },
    { 
      title: "Media Editing & Thumbnail Suite", 
      tag: "Video Production & UI",
      content: `
        <p>Professional video editing works and high-impact custom thumbnail designs crafted to maximize click-through rates (CTR) and viewer retention.</p>
        <div class="modal-sandbox">
          <div class="thumb-preview-box">
            <i class="fa-solid fa-photo-film" style="font-size: 3rem; color: var(--primary);"></i>
            <p>Sample High-CTR Thumbnail Design Layout (Photoshop & Canva Workflow)</p>
          </div>
        </div>
      `,
      actionText: "View Design Portfolio",
      actionUrl: "https://www.instagram.com/pranishh90/?hl=en"
    },
    { 
      title: "Brand Identity & Canva Visuals", 
      tag: "Branding & Graphics",
      content: `
        <p>Custom promotional posters, business presentations, and cohesive brand design assets created cleanly using professional design tools.</p>
        <div class="modal-sandbox">
          <p>Includes vector layouts, color palettes, typography guidelines, and promotional marketing banners.</p>
        </div>
      `,
      actionText: "Hire For Branding",
      actionType: "scroll-contact"
    }
  ];

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.modal-trigger');
    if (trigger) {
      const modalIdx = trigger.getAttribute('data-modal');
      const details = projectDetails[modalIdx];
      if (details && modal) {
        modalTitle.textContent = details.title;
        modalTag.textContent = details.tag;
        modalBody.innerHTML = details.content;
        
        if (details.actionType === "scroll-contact") {
          modalActions.innerHTML = `<button class="btn btn-sm btn-primary" id="modal-action-btn">${details.actionText}</button>`;
          document.getElementById('modal-action-btn').addEventListener('click', () => {
            closeModal();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
              const messageInput = document.getElementById('message');
              if (messageInput) {
                messageInput.value = `Hello Pranish, I would like to request code access for the project: "${details.title}".`;
                messageInput.focus();
              }
            }
          });
        } else {
          modalActions.innerHTML = `<a href="${details.actionUrl}" target="_blank" class="btn btn-sm btn-primary">${details.actionText}</a>`;
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // 4. Mobile Menu Navigation
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    navLinksContainer.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
  }

  if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('active')) toggleMobileMenu();
    });
  });

  // ==========================================
  // 5. MULTI-GAME ARCADE ENGINE
  // ==========================================
  const arcadeCanvas = document.getElementById('arcade-canvas');
  const arcadeCtx = arcadeCanvas ? arcadeCanvas.getContext('2d') : null;

  const gameTabs = document.querySelectorAll('.game-tab');
  const currentGameTitle = document.getElementById('current-game-title');
  const gameScoreEl = document.getElementById('game-score');
  const gameHighscoreEl = document.getElementById('game-highscore');
  const gameOverlay = document.getElementById('game-overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayDesc = document.getElementById('overlay-desc');
  const startGameBtn = document.getElementById('start-game-btn');

  const btnLeft = document.getElementById('btn-left');
  const btnRight = document.getElementById('btn-right');
  const btnAction = document.getElementById('btn-action');

  let activeGame = 'racer';
  let gameLoopId = null;
  let isPlaying = false;
  let score = 0;
  let highScores = { racer: 0, flappy: 0, shooter: 0 };

  let keys = { left: false, right: false, up: false, down: false, space: false };

  window.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left = true;
    if (['ArrowRight', 'KeyD'].includes(e.code)) keys.right = true;
    if (['ArrowUp', 'KeyW'].includes(e.code)) keys.up = true;
    if (['ArrowDown', 'KeyS'].includes(e.code)) keys.down = true;
    if (['Space'].includes(e.code)) {
      keys.space = true;
      if (isPlaying && (activeGame === 'flappy' || activeGame === 'shooter')) {
        e.preventDefault();
        triggerAction();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left = false;
    if (['ArrowRight', 'KeyD'].includes(e.code)) keys.right = false;
    if (['ArrowUp', 'KeyW'].includes(e.code)) keys.up = false;
    if (['ArrowDown', 'KeyS'].includes(e.code)) keys.down = false;
    if (['Space'].includes(e.code)) keys.space = false;
  });

  function bindTouchBtn(btn, keyName) {
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[keyName] = true; if (keyName === 'space') triggerAction(); });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[keyName] = false; });
    btn.addEventListener('mousedown', () => { keys[keyName] = true; if (keyName === 'space') triggerAction(); });
    btn.addEventListener('mouseup', () => { keys[keyName] = false; });
  }

  bindTouchBtn(btnLeft, 'left');
  bindTouchBtn(btnRight, 'right');
  bindTouchBtn(btnAction, 'space');

  const gameConfigs = {
    racer: {
      title: "Speed Racer 2D",
      desc: "Steer your car at a comfortable, smooth speed to dodge traffic!",
      actionName: "NITRO BOOST"
    },
    flappy: {
      title: "Flappy Cyber Bird",
      desc: "Tap SPACE or ACTION gently to fly through neon pillars with ease!",
      actionName: "FLAP WINGS"
    },
    shooter: {
      title: "Space Defender",
      desc: "Move steadily and press ACTION or SPACE to shoot down alien ships!",
      actionName: "FIRE LASER"
    }
  };

  gameTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      gameTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      activeGame = tab.getAttribute('data-game');
      resetGameUI();
    });
  });

  function resetGameUI() {
    stopGame();
    const config = gameConfigs[activeGame];
    currentGameTitle.textContent = config.title;
    overlayTitle.textContent = config.title;
    overlayDesc.textContent = config.desc;
    if (btnAction) btnAction.innerHTML = `<i class="fa-solid fa-bolt"></i> ${config.actionName}`;
    gameScoreEl.textContent = '0';
    gameHighscoreEl.textContent = highScores[activeGame];
    gameOverlay.style.display = 'flex';
    startGameBtn.style.display = 'inline-flex';
  }

  function triggerAction() {
    if (activeGame === 'flappy' && flappyState) {
      flappyState.velocity = -5.5;
    } else if (activeGame === 'shooter' && shooterState) {
      shooterState.bullets.push({ x: shooterState.playerX + 18, y: shooterState.playerY, speed: 6 });
    }
  }

  function stopGame() {
    isPlaying = false;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
  }

  if (startGameBtn) {
    startGameBtn.addEventListener('click', () => {
      startGameBtn.style.display = 'none';
      let count = 3;
      overlayTitle.textContent = count;
      overlayDesc.textContent = "Get Ready...";

      let countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
          overlayTitle.textContent = count;
        } else if (count === 0) {
          overlayTitle.textContent = "GO!";
        } else {
          clearInterval(countdownInterval);
          gameOverlay.style.display = 'none';
          score = 0;
          gameScoreEl.textContent = '0';
          isPlaying = true;

          if (activeGame === 'racer') initRacer();
          else if (activeGame === 'flappy') initFlappy();
          else if (activeGame === 'shooter') initShooter();
        }
      }, 1000);
    });
  }

  // GAME 1: RACER
  let racerState = null;
  function initRacer() {
    racerState = { playerX: 280, playerY: 320, obstacles: [], roadOffset: 0 };
    runRacer();
  }

  function runRacer() {
    if (!isPlaying) return;
    arcadeCtx.clearRect(0, 0, 600, 400);

    arcadeCtx.fillStyle = '#1e293b';
    arcadeCtx.fillRect(150, 0, 300, 400);

    racerState.roadOffset = (racerState.roadOffset + 3) % 40;
    arcadeCtx.strokeStyle = currentTheme === 'egypt' ? '#f5c542' : '#00e5ff';
    arcadeCtx.lineWidth = 4;
    arcadeCtx.setLineDash([20, 20]);
    arcadeCtx.lineDashOffset = -racerState.roadOffset;
    arcadeCtx.beginPath();
    arcadeCtx.moveTo(300, 0);
    arcadeCtx.lineTo(300, 400);
    arcadeCtx.stroke();
    arcadeCtx.setLineDash([]);

    if (keys.left && racerState.playerX > 160) racerState.playerX -= 4;
    if (keys.right && racerState.playerX < 400) racerState.playerX += 4;

    arcadeCtx.fillStyle = currentTheme === 'egypt' ? '#f5c542' : '#00e5ff';
    arcadeCtx.fillRect(racerState.playerX, racerState.playerY, 40, 65);
    arcadeCtx.fillStyle = '#000';
    arcadeCtx.fillRect(racerState.playerX + 5, racerState.playerY + 15, 30, 20);

    if (Math.random() < 0.015) {
      racerState.obstacles.push({
        x: 160 + Math.random() * 220,
        y: -70,
        speed: 2.2 + Math.random() * 1.2
      });
    }

    for (let i = racerState.obstacles.length - 1; i >= 0; i--) {
      let obs = racerState.obstacles[i];
      obs.y += obs.speed;

      arcadeCtx.fillStyle = '#ff007f';
      arcadeCtx.fillRect(obs.x, obs.y, 40, 65);

      if (
        racerState.playerX < obs.x + 40 &&
        racerState.playerX + 40 > obs.x &&
        racerState.playerY < obs.y + 65 &&
        racerState.playerY + 65 > obs.y
      ) {
        gameOver("Car Crashed!");
        return;
      }

      if (obs.y > 400) {
        racerState.obstacles.splice(i, 1);
        score += 10;
        gameScoreEl.textContent = score;
      }
    }

    gameLoopId = requestAnimationFrame(runRacer);
  }

  // GAME 2: FLAPPY
  let flappyState = null;
  function initFlappy() {
    flappyState = { birdY: 200, velocity: 0, gravity: 0.25, pipes: [] };
    runFlappy();
  }

  function runFlappy() {
    if (!isPlaying) return;
    arcadeCtx.clearRect(0, 0, 600, 400);

    flappyState.velocity += flappyState.gravity;
    flappyState.birdY += flappyState.velocity;

    arcadeCtx.fillStyle = '#ffbd2e';
    arcadeCtx.beginPath();
    arcadeCtx.arc(120, flappyState.birdY, 15, 0, Math.PI * 2);
    arcadeCtx.fill();

    if (flappyState.birdY > 385 || flappyState.birdY < 15) {
      gameOver("Fell out of bounds!");
      return;
    }

    if (flappyState.pipes.length === 0 || flappyState.pipes[flappyState.pipes.length - 1].x < 380) {
      let gap = 150;
      let topHeight = 60 + Math.random() * 140;
      flappyState.pipes.push({ x: 600, top: topHeight, bottom: topHeight + gap, passed: false });
    }

    for (let i = flappyState.pipes.length - 1; i >= 0; i--) {
      let p = flappyState.pipes[i];
      p.x -= 2;

      arcadeCtx.fillStyle = currentTheme === 'egypt' ? '#00a896' : '#8a2be2';
      arcadeCtx.fillRect(p.x, 0, 45, p.top);
      arcadeCtx.fillRect(p.x, p.bottom, 45, 400 - p.bottom);

      if (
        120 + 15 > p.x && 120 - 15 < p.x + 45 &&
        (flappyState.birdY - 15 < p.top || flappyState.birdY + 15 > p.bottom)
      ) {
        gameOver("Hit a Pillar!");
        return;
      }

      if (!p.passed && p.x < 120) {
        p.passed = true;
        score += 1;
        gameScoreEl.textContent = score;
      }

      if (p.x < -50) flappyState.pipes.splice(i, 1);
    }

    gameLoopId = requestAnimationFrame(runFlappy);
  }

  // GAME 3: SHOOTER
  let shooterState = null;
  function initShooter() {
    shooterState = { playerX: 280, playerY: 340, bullets: [], aliens: [] };
    runShooter();
  }

  function runShooter() {
    if (!isPlaying) return;
    arcadeCtx.clearRect(0, 0, 600, 400);

    if (keys.left && shooterState.playerX > 10) shooterState.playerX -= 4.5;
    if (keys.right && shooterState.playerX < 550) shooterState.playerX += 4.5;

    arcadeCtx.fillStyle = currentTheme === 'egypt' ? '#f5c542' : '#00e5ff';
    arcadeCtx.beginPath();
    arcadeCtx.moveTo(shooterState.playerX + 20, shooterState.playerY);
    arcadeCtx.lineTo(shooterState.playerX, shooterState.playerY + 30);
    arcadeCtx.lineTo(shooterState.playerX + 40, shooterState.playerY + 30);
    arcadeCtx.closePath();
    arcadeCtx.fill();

    if (Math.random() < 0.02) {
      shooterState.aliens.push({ x: Math.random() * 550, y: -30, speed: 1.2 + Math.random() * 1.0 });
    }

    for (let i = shooterState.bullets.length - 1; i >= 0; i--) {
      let b = shooterState.bullets[i];
      b.y -= b.speed;

      arcadeCtx.fillStyle = '#00ffaa';
      arcadeCtx.fillRect(b.x, b.y, 4, 12);

      if (b.y < -10) shooterState.bullets.splice(i, 1);
    }

    for (let aIdx = shooterState.aliens.length - 1; aIdx >= 0; aIdx--) {
      let al = shooterState.aliens[aIdx];
      al.y += al.speed;

      arcadeCtx.fillStyle = '#ff0055';
      arcadeCtx.fillRect(al.x, al.y, 30, 25);

      if (al.y > 330 && Math.abs(al.x - shooterState.playerX) < 30) {
        gameOver("Base Destroyed!");
        return;
      }

      for (let bIdx = shooterState.bullets.length - 1; bIdx >= 0; bIdx--) {
        let b = shooterState.bullets[bIdx];
        if (b.x > al.x && b.x < al.x + 30 && b.y > al.y && b.y < al.y + 25) {
          shooterState.aliens.splice(aIdx, 1);
          shooterState.bullets.splice(bIdx, 1);
          score += 20;
          gameScoreEl.textContent = score;
          break;
        }
      }

      if (al.y > 400) shooterState.aliens.splice(aIdx, 1);
    }

    gameLoopId = requestAnimationFrame(runShooter);
  }

  function gameOver(msg) {
    stopGame();
    if (score > highScores[activeGame]) {
      highScores[activeGame] = score;
      gameHighscoreEl.textContent = score;
    }
    overlayTitle.textContent = "GAME OVER";
    overlayDesc.textContent = `${msg} Final Score: ${score}`;
    gameOverlay.style.display = 'flex';
    startGameBtn.style.display = 'inline-flex';
    startGameBtn.textContent = "PLAY AGAIN";
  }

  // 6. Contact Form AJAX Submission
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formSubmitBtn.disabled = true;
      formSubmitBtn.textContent = 'Sending Message...';

      const formData = new FormData(contactForm);
      try {
        const response = await fetch(contactForm.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
        if (response.ok) {
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Message sent successfully!';
          contactForm.reset();
        } else throw new Error();
      } catch (err) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Failed to send message. Please try directly at pranishsiwakoti13@gmail.com';
      } finally {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = '<span>Send Message</span><i class="fa-solid fa-paper-plane"></i>';
      }
    });
  }

  // 7. Copy Email Button
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('pranishsiwakoti13@gmail.com').then(() => {
        copyEmailBtn.textContent = 'Copied!';
        setTimeout(() => { copyEmailBtn.textContent = 'Copy Email'; }, 2000);
      });
    });
  }

});