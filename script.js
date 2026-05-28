// ─── NOTES DATA ───
    
    const notes = [
      {
        title: "freaken no more exams",
        hint: "how good does it feel...",
        message: "how good does it feel to be done, think about all the murder mysteries you can invest in now"
      },
      {
        title: "you're pretty funny",
        hint: "you make me laugh...",
        message: "you make me laugh a lot and I really enjoy your sense of humour, never change - you might just be a little bit more funny then me"
      },
      {
        title: "i understand",
        hint: "when you're in the lows...",
        message: "when you're in the lows or feeling weird, i get it, or i get it a little bit, talk to me i'd rather hear you then sit in silence"
      },
      {
        title: "estoy enferma",
        hint: "when you're feeling overwhelmed...",
        message: "when you're feeling overwhelmed, remember that you're pretty strong and i'm proud of you, i hope this makes you a little less overwhelmed"
      },
      {
        title: "i did it",
        hint: "i dont really know...",
        message: "i dont really know how to code websites because i dont like html or css; but i wanted to create something for you because i like you a lot - we pray to claude for its help"
      },
      {
        title: "favourites",
        hint: "although i love my...",
        message: "although i love my protein powder, breakfast bakes, smoothies, my skateboard, the gym.... you're still my favourite"
      }
    ];

    // ─── RENDER NOTES ───
    const grid = document.getElementById('notes-grid');
    notes.forEach((n, i) => {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.innerHTML = `
        <div class="note-front">
          <h3>${n.title}</h3>
          <p>${n.hint}</p>
        </div>
        <div class="note-back">
          "${n.message}"
        </div>
        <span class="note-tap-hint">tap to read</span>
      `;
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        card.querySelector('.note-tap-hint').textContent =
          card.classList.contains('flipped') ? 'tap to close' : 'tap to read';
        if (card.classList.contains('flipped')) burstHearts(card);
      });
      grid.appendChild(card);
    });

    // ─── SURPRISE MESSAGES ───
    const surprises = [
      "I think about you a lot. Like, a lot a lot.",
      "Eres muy bonita y muy linda.",
      "I'm mega mega proud of you.",
      "My favourite place in the world is that space right next to you btw.",
      "If I was reborn I'd find you again and again and again.",
      "I get hella butterflies when I'm with you.",
      "Never thought someone could be perfect, then I met you.",
      "You're enough. More than enough, you're everything.",
    ];

    let lastSurprise = -1;
    function showSurprise() {
      let idx;
      do { idx = Math.floor(Math.random() * surprises.length); } while (idx === lastSurprise);
      lastSurprise = idx;
      const el = document.getElementById('surprise-msg');
      el.classList.remove('visible');
      setTimeout(() => {
        el.textContent = surprises[idx];
        el.classList.add('visible');
      }, 200);
      bigBurst();
    }

    // ─── CANVAS HEARTS ───
    const canvas = document.getElementById('hearts-canvas');
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function spawnHeart(x, y, big = false) {
      const size = big
        ? Math.random() * 18 + 10
        : Math.random() * 10 + 4;
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * (big ? 4 : 2),
        vy: -(Math.random() * (big ? 4 : 2) + 1),
        alpha: 1,
        size,
        decay: big ? 0.012 : 0.008,
        colour: `hsl(${Math.random() * 30 + 340}, 80%, ${Math.random() * 20 + 65}%)`
      });
    }

    function drawHeart(x, y, size, alpha, colour) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colour;
      ctx.beginPath();
      const s = size / 10;
      ctx.moveTo(x, y + s * 3);
      ctx.bezierCurveTo(x - s * 5, y - s * 2, x - s * 10, y + s * 3, x, y + s * 8);
      ctx.bezierCurveTo(x + s * 10, y + s * 3, x + s * 5, y - s * 2, x, y + s * 3);
      ctx.fill();
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        drawHeart(p.x, p.y, p.size, p.alpha, p.colour);
      }
      requestAnimationFrame(tick);
    }
    tick();

    // Ambient drifting hearts
    setInterval(() => {
      if (particles.length < 30)
        spawnHeart(Math.random() * W, H + 20);
    }, 600);

    function burstHearts(card) {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      for (let i = 0; i < 14; i++) spawnHeart(cx, cy);
    }

    function bigBurst() {
      const cx = W / 2, cy = H / 2;
      for (let i = 0; i < 30; i++) spawnHeart(cx, cy, true);
    }