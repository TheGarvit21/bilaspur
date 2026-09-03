/**
 * VIRASAT E KEHLOOR — THE ROYAL HERITAGE OF BILASPUR
 * Data-driven engine: loads all king data from /data/ folder
 * Audio: Hindi (default) / English toggle
 */

document.addEventListener('DOMContentLoaded', async () => {

  // ==========================================
  // 0. GRAND ROYAL CURTAIN OPENING REVEAL (10 SEC READING & SLOW-MOTION EXPERIENCE)
  // ==========================================
  const curtainStage = document.getElementById('royalCurtainStage');
  if (curtainStage) {
    // 2.8s focused reading time for "VIRASAT E KEHLOOR", then 7.5s majestic slow-motion reveal
    const openTimer = setTimeout(() => { curtainStage.classList.add('opened'); }, 2800);
    curtainStage.addEventListener('click', () => { 
      clearTimeout(openTimer);
      curtainStage.classList.add('opened'); 
      setTimeout(() => { curtainStage.style.display = 'none'; }, 1500);
    });
    setTimeout(() => { curtainStage.style.display = 'none'; }, 10800);
  }

  // ==========================================
  // 1. LOAD ALL KINGS FROM DATA / MASTER CACHE
  // ==========================================
  let allKings = [];
  let currentAudioLang = 'hindi'; // DEFAULT: Hindi
  let currentAudio = null;
  let currentKingIndex = 0;
  let currentPlaybackRate = 1.0;
  let currentFontSizeRem = 1.15;
  let highlightRafId = null;

  // Use master bundled data if available (zero network delay)
  if (typeof window !== 'undefined' && Array.isArray(window.KINGS_MASTER_DATA) && window.KINGS_MASTER_DATA.length > 0) {
    allKings = window.KINGS_MASTER_DATA;
  } else {
    try {
      const res = await fetch('data/index.json');
      allKings = await res.json();
    } catch(e) {
      console.error('Failed to load kings index', e);
    }
  }

  // ==========================================
  // 2. BUILD RULERS CAROUSEL FROM DATA
  // ==========================================
  const rulersTrack = document.getElementById('rulersTrack');
  if (rulersTrack && allKings.length > 0) {
    rulersTrack.innerHTML = '';
    allKings.forEach((king, idx) => {
      const card = document.createElement('div');
      card.className = 'ruler-card' + (idx === 0 ? ' active-featured' : '');
      card.setAttribute('data-id', king.index);
      card.setAttribute('data-name', king.name);
      card.setAttribute('data-timeline', king.timeline || '');

      const featuredFrame = idx === 0 ? 'featured-frame' : '';
      const mandalaRings = idx === 0 
        ? '<div class="mandala-outer-ring"></div><div class="mandala-inner-ring"></div>' 
        : '';
      const activePin = idx === 0 ? 'active-pin' : '';

      card.innerHTML = `
        <div class="ruler-avatar-frame ${featuredFrame}">
          ${mandalaRings}
          <div class="ruler-avatar-inner">
            <img src="data/${king.index}/${king.index}.png" 
                 alt="${king.name}" 
                 class="ruler-portrait" 
                 loading="lazy"
                 onerror="this.src='assets/images/ruler_1_kirpal.jpg'">
          </div>
          <div class="timeline-node-pin ${activePin}"></div>
        </div>
        <div class="ruler-info">
          <h3 class="ruler-name">${king.name}</h3>
          <span class="ruler-years">${king.timeline ? '(' + king.timeline + ')' : ''}</span>
        </div>
      `;
      rulersTrack.appendChild(card);
    });

    bindRulerCards();
  }

  // ==========================================
  // 3. RULER CARD CLICK → OPEN FULLSCREEN MODAL
  // ==========================================
  function bindRulerCards() {
    const rulerCards = document.querySelectorAll('.ruler-card');
    rulerCards.forEach(card => {
      card.addEventListener('click', async () => {
        const id = card.getAttribute('data-id');
        highlightCardInTrack(id);
        await openRulerModal(id);
      });
    });
  }

  function highlightCardInTrack(id) {
    const rulerCards = document.querySelectorAll('.ruler-card');
    rulerCards.forEach(c => {
      c.classList.remove('active-featured');
      const frame = c.querySelector('.ruler-avatar-frame');
      if (frame) {
        frame.classList.remove('featured-frame');
        const mOuter = frame.querySelector('.mandala-outer-ring');
        const mInner = frame.querySelector('.mandala-inner-ring');
        if (mOuter) mOuter.remove();
        if (mInner) mInner.remove();
        const pin = frame.querySelector('.timeline-node-pin');
        if (pin) pin.classList.remove('active-pin');
      }
    });

    const activeCard = document.querySelector(`.ruler-card[data-id='${id}']`);
    if (activeCard) {
      activeCard.classList.add('active-featured');
      const frame = activeCard.querySelector('.ruler-avatar-frame');
      if (frame) {
        frame.classList.add('featured-frame');
        const outer = document.createElement('div');
        outer.className = 'mandala-outer-ring';
        const inner = document.createElement('div');
        inner.className = 'mandala-inner-ring';
        frame.prepend(outer);
        frame.prepend(inner);
        const pin = frame.querySelector('.timeline-node-pin');
        if (pin) pin.classList.add('active-pin');
      }
    }
  }

  // ==========================================
  // 4. OPEN RULER MODAL WITH COMPLETE DOCS
  // ==========================================
  async function openRulerModal(id) {
    const modal = document.getElementById('rulerModal');
    if (!modal) return;

    stopAudio();

    const king = allKings.find(k => k.index == id);
    if (!king) return;

    currentKingIndex = allKings.findIndex(k => k.index == id);

    modal.dataset.kingId = id;
    modal.dataset.kingName = king.name;
    modal.dataset.kingTimeline = king.timeline || '';

    // Set King Portrait
    const img = document.getElementById('rulerModalImg');
    if (img) {
      img.src = `data/${id}/${id}.png`;
      img.onerror = () => { img.src = `assets/images/ruler_1_kirpal.jpg`; };
      img.alt = king.name;
    }

    // Set King Name, Timeline, Counter
    const nameEl = document.getElementById('rulerModalName');
    const reignEl = document.getElementById('rulerModalReign');
    const numEl = document.getElementById('rulerModalNum');
    if (nameEl) nameEl.textContent = king.name;
    if (reignEl) reignEl.textContent = king.timeline || '';
    if (numEl) numEl.textContent = currentKingIndex + 1;

    // Reset Audio UI
    resetAudioUI();

    // Render Text for current language
    await renderChronicleText(king);

    // Update Language Buttons UI
    updateAudioLangUI();

    // Setup Reading Progress
    setupReadingProgress();

    modal.classList.add('active');
    const scroll = document.getElementById('rfmDocScroll');
    if (scroll) scroll.scrollTop = 0;
  }

  // Format seconds to mm:ss
  function formatTime(seconds) {
    if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function resetAudioUI() {
    const playBtn = document.getElementById('btnPlayKingAudio');
    const playText = document.getElementById('playBtnText');
    const playIcon = document.getElementById('playIconSvg');
    const dot = document.getElementById('rulerAudioDot');
    const statusEl = document.getElementById('rulerAudioStatus');

    if (playBtn) playBtn.classList.remove('playing');
    if (playText) playText.textContent = 'सुनें / Listen';
    if (playIcon) playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    if (dot) dot.classList.remove('speaking');
    if (statusEl) statusEl.textContent = currentAudioLang === 'hindi' ? 'हिंदी ऑडियो' : 'English Audio';
  }

  // Renders text as clickable interactive paragraphs
  async function renderChronicleText(king) {
    const bioEl = document.getElementById('rulerModalBio');
    const titleEl = document.getElementById('rfmChronicleTitle');
    if (!bioEl) return;

    let rawText = '';
    if (currentAudioLang === 'hindi') {
      rawText = king.hindiText;
      if (!rawText) {
        try {
          const res = await fetch(`data/${king.index}/${king.index}.txt`);
          if (res.ok) rawText = await res.text();
        } catch(e) {}
      }
      if (titleEl) titleEl.textContent = `HISTORICAL CHRONICLE OF ${king.name.toUpperCase()} (हिंदी)`;
    } else {
      // English: check bundled English text first
      rawText = king.englishText;
      if (!rawText || rawText.length < 20) {
        try {
          const engRes = await fetch(`data/${king.index}/eng.txt`);
          if (engRes.ok) rawText = await engRes.text();
        } catch(e) {}
      }
      if (!rawText || rawText.length < 20) {
        try {
          const docxRes = await fetch(`data/${king.index}/${king.index}.docx`);
          if (docxRes.ok && typeof mammoth !== 'undefined') {
            const arrayBuffer = await docxRes.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            rawText = result.value.trim();
          }
        } catch(e) {}
      }
      if (titleEl) titleEl.textContent = `HISTORICAL CHRONICLE OF ${king.name.toUpperCase()} (ENGLISH)`;
    }

    if (!rawText || rawText.trim().length === 0) {
      rawText = `${king.name} reigned ${king.timeline || 'over Kehloor'}. The historical documentation for this sovereign is preserved in the Kehloor royal archives.`;
    }

    // Split text into clean paragraphs
    const paragraphs = rawText
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    bioEl.innerHTML = paragraphs.map((p, idx) => `
      <div class="rfm-para" data-para-idx="${idx}" title="Click to listen from this paragraph">
        ${p.replace(/\n/g, '<br>')}
      </div>
    `).join('');

    // Attach click-to-seek listeners on each paragraph
    const paraEls = bioEl.querySelectorAll('.rfm-para');
    paraEls.forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-para-idx'), 10);
        seekAudioToParagraph(idx, paraEls.length);
      });
    });

    // Update scroll hint
    setTimeout(() => {
      const scrollEl = document.getElementById('rfmDocScroll');
      const hint = document.getElementById('rfmScrollHint');
      if (scrollEl && hint) {
        hint.style.opacity = scrollEl.scrollHeight > scrollEl.clientHeight ? '1' : '0';
      }
    }, 60);
  }

  function updateAudioLangUI() {
    const hindiBtn = document.getElementById('btnLangHindi');
    const engBtn = document.getElementById('btnLangEng');
    const statusEl = document.getElementById('rulerAudioStatus');

    if (hindiBtn && engBtn) {
      if (currentAudioLang === 'hindi') {
        hindiBtn.classList.add('rfm-lang-active');
        engBtn.classList.remove('rfm-lang-active');
        if (statusEl) statusEl.textContent = 'हिंदी ऑडियो';
      } else {
        engBtn.classList.add('rfm-lang-active');
        hindiBtn.classList.remove('rfm-lang-active');
        if (statusEl) statusEl.textContent = 'English Audio';
      }
    }
  }

  function setupReadingProgress() {
    const scrollEl = document.getElementById('rfmDocScroll');
    const bar = document.getElementById('rfmReadingProgress');
    const hint = document.getElementById('rfmScrollHint');
    if (!scrollEl || !bar) return;

    scrollEl.onscroll = () => {
      const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
      if (maxScroll <= 0) {
        bar.style.width = '100%';
        if (hint) hint.style.opacity = '0';
        return;
      }
      const pct = (scrollEl.scrollTop / maxScroll) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
      if (hint) hint.style.opacity = pct > 85 ? '0' : '1';
    };
  }

  // ==========================================
  // 5. INTERACTIVE AUDIO PLAYER + PARAGRAPH SYNC
  // ==========================================
  function clearParaHighlights() {
    if (highlightRafId) {
      cancelAnimationFrame(highlightRafId);
      highlightRafId = null;
    }
    document.querySelectorAll('#rulerModalBio .rfm-para').forEach(p => {
      p.classList.remove('para-active', 'para-done');
    });
  }

  function startParaHighlightLoop() {
    clearParaHighlights();
    const paraEls = Array.from(document.querySelectorAll('#rulerModalBio .rfm-para'));
    if (!paraEls.length) return;

    const scrollEl = document.getElementById('rfmDocScroll');
    let lastActiveIdx = -1;

    function loop() {
      if (!currentAudio || currentAudio.paused || currentAudio.ended) {
        return;
      }

      const duration = currentAudio.duration || 1;
      const current = currentAudio.currentTime || 0;
      const pct = Math.min(current / duration, 1);

      // Calculate active paragraph index
      const activeIdx = Math.min(Math.floor(pct * paraEls.length), paraEls.length - 1);

      if (activeIdx !== lastActiveIdx) {
        paraEls.forEach((p, i) => {
          p.classList.remove('para-active', 'para-done');
          if (i < activeIdx) {
            p.classList.add('para-done');
          } else if (i === activeIdx) {
            p.classList.add('para-active');
            // Auto-scroll to keep active paragraph centered
            if (scrollEl) {
              const paraTop = p.offsetTop;
              const paraHeight = p.offsetHeight;
              const viewScroll = scrollEl.scrollTop;
              const viewHeight = scrollEl.clientHeight;

              if (paraTop < viewScroll + 40 || paraTop + paraHeight > viewScroll + viewHeight - 40) {
                scrollEl.scrollTo({
                  top: Math.max(0, paraTop - Math.floor(viewHeight / 3)),
                  behavior: 'smooth'
                });
              }
            }
          }
        });
        lastActiveIdx = activeIdx;
      }

      highlightRafId = requestAnimationFrame(loop);
    }

    highlightRafId = requestAnimationFrame(loop);
  }

  // Click on paragraph seeks audio directly!
  function seekAudioToParagraph(idx, totalParas) {
    if (!totalParas || totalParas <= 0) return;
    const targetPct = idx / totalParas;

    const modal = document.getElementById('rulerModal');
    const id = modal ? modal.dataset.kingId : null;
    if (!id) return;

    if (!currentAudio) {
      playKingAudio(id);
      currentAudio.addEventListener('loadedmetadata', () => {
        if (currentAudio) {
          currentAudio.currentTime = targetPct * currentAudio.duration;
        }
      }, { once: true });
    } else {
      if (currentAudio.duration) {
        currentAudio.currentTime = targetPct * currentAudio.duration;
        if (currentAudio.paused) currentAudio.play();
        startParaHighlightLoop();
      }
    }
  }

  function playKingAudio(id) {
    const audioFilename = currentAudioLang === 'hindi' ? 'hindi.mp3' : 'eng.mp3';
    const audioPath = `data/${id}/${audioFilename}`;

    // If already exists and playing, pause/stop it
    if (currentAudio && !currentAudio.ended && currentAudio.src.includes(audioFilename)) {
      if (currentAudio.paused) {
        currentAudio.playbackRate = currentPlaybackRate;
        currentAudio.play();
        updatePlayingUI(true);
        startParaHighlightLoop();
        return;
      } else {
        // Toggle stop
        stopAudio();
        return;
      }
    }

    // Stop any previous audio
    stopAudio();

    currentAudio = new Audio(audioPath);
    currentAudio.playbackRate = currentPlaybackRate;

    updatePlayingUI(true);

    currentAudio.addEventListener('loadedmetadata', () => {
      startParaHighlightLoop();
    });

    currentAudio.play().catch(err => {
      console.warn('Audio playback error:', err);
      updatePlayingUI(false);
      const statusEl = document.getElementById('rulerAudioStatus');
      if (statusEl) statusEl.textContent = 'ऑडियो उपलब्ध नहीं है';
    });

    currentAudio.onended = () => {
      clearParaHighlights();
      updatePlayingUI(false);
    };
  }

  function updatePlayingUI(isPlaying) {
    const playBtn = document.getElementById('btnPlayKingAudio');
    const playText = document.getElementById('playBtnText');
    const playIcon = document.getElementById('playIconSvg');
    const dot = document.getElementById('rulerAudioDot');
    const statusEl = document.getElementById('rulerAudioStatus');

    if (isPlaying) {
      if (playBtn) playBtn.classList.add('playing');
      if (playText) playText.textContent = 'रोकें / Stop';
      if (playIcon) playIcon.innerHTML = '<rect x="6" y="6" width="12" height="12"/>';
      if (dot) dot.classList.add('speaking');
      if (statusEl) {
        statusEl.textContent = currentAudioLang === 'hindi' ? 'ऑडियो चल रहा है...' : 'Playing audio...';
      }
    } else {
      if (playBtn) playBtn.classList.remove('playing');
      if (playText) playText.textContent = 'सुनें / Listen';
      if (playIcon) playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
      if (dot) dot.classList.remove('speaking');
      if (statusEl) {
        statusEl.textContent = currentAudioLang === 'hindi' ? 'हिंदी ऑडियो' : 'English Audio';
      }
    }
  }

  function stopAudio() {
    clearParaHighlights();
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    resetAudioUI();
  }

  // ==========================================
  // 6. GLOBAL INTERACTIVE CONTROLS
  // ==========================================
  document.addEventListener('click', async (e) => {
    const modal = document.getElementById('rulerModal');
    if (!modal || !modal.classList.contains('active')) return;
    const id = modal.dataset.kingId;
    const king = allKings.find(k => k.index == id);

    // Switch to Hindi
    if (e.target.id === 'btnLangHindi' || e.target.closest('#btnLangHindi')) {
      if (currentAudioLang !== 'hindi') {
        currentAudioLang = 'hindi';
        stopAudio();
        updateAudioLangUI();
        if (king) await renderChronicleText(king);
      }
    }

    // Switch to English
    if (e.target.id === 'btnLangEng' || e.target.closest('#btnLangEng')) {
      if (currentAudioLang !== 'english') {
        currentAudioLang = 'english';
        stopAudio();
        updateAudioLangUI();
        if (king) await renderChronicleText(king);
      }
    }

    // Play / Stop Audio Toggle Button
    if (e.target.id === 'btnPlayKingAudio' || e.target.closest('#btnPlayKingAudio')) {
      if (id) playKingAudio(id);
    }

    // Back to Kings Button
    if (e.target.id === 'rulerModalBackBtn' || e.target.closest('#rulerModalBackBtn')) {
      closeAllModals();
    }

    // Previous King
    if (e.target.id === 'rfmPrevKing' || e.target.closest('#rfmPrevKing')) {
      if (currentKingIndex > 0) {
        currentKingIndex--;
        const prevKing = allKings[currentKingIndex];
        highlightCardInTrack(prevKing.index);
        await openRulerModal(prevKing.index);
      }
    }

    // Next King
    if (e.target.id === 'rfmNextKing' || e.target.closest('#rfmNextKing')) {
      if (currentKingIndex < allKings.length - 1) {
        currentKingIndex++;
        const nextKing = allKings[currentKingIndex];
        highlightCardInTrack(nextKing.index);
        await openRulerModal(nextKing.index);
      }
    }

    // Click on Timeline King Card opens ruler chronicle modal directly
    const timelineRow = e.target.closest('.timeline-row');
    if (timelineRow && timelineRow.dataset.kingIdx) {
      const idx = parseInt(timelineRow.dataset.kingIdx, 10);
      closeAllModals();
      await openRulerModal(idx);
    }
  });


  // ==========================================
  // 7. CAROUSEL NAVIGATION
  // ==========================================
  const trackContainer = document.getElementById('rulersTrackContainer');
  const btnRulerPrev = document.getElementById('rulerPrevBtn');
  const btnRulerNext = document.getElementById('rulerNextBtn');

  if (btnRulerPrev && trackContainer) {
    btnRulerPrev.addEventListener('click', () => {
      trackContainer.scrollBy({ left: -220, behavior: 'smooth' });
    });
  }
  if (btnRulerNext && trackContainer) {
    btnRulerNext.addEventListener('click', () => {
      trackContainer.scrollBy({ left: 220, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 8. POPULAR EVENTS INTERACTION (unchanged)
  // ==========================================
  const EVENTS_DATA = {
    kahlur_fort: {
      title: "Kahlur Fort Construction",
      era: "8th Century AD (c. 697 AD)",
      img: "assets/images/event_kahlur_fort.jpg",
      text: "Kot Kahlur was built on the highest spine of the Naina Devi hills by Raja Bir Chand, founder of the state. Its ramparts and watchtowers guarded the sacred Sutlej gorge and stood as the impregnable shield of the Chandel dynasty for over a thousand years.",
      facts: [
        "Constructed atop a 3,600-foot ridge overlooking the Sutlej river.",
        "Served as the primary royal seat before Raja Dip Chand relocated to Vyaspur in 1654.",
        "Possesses subterranean granaries and freshwater cisterns that could withstand multi-year sieges."
      ]
    },
    battles: {
      title: "Battles of Kehloor",
      era: "17th – 18th Century AD",
      img: "assets/images/event_battles.jpg",
      text: "The Chandel warriors fought with legendary valor across centuries to preserve their mountain independence. Key battles were fought against imperial Mughal governors, regional hill coalitions, and in the memorable military encounters around Anandpur Sahib.",
      facts: [
        "Renowned for mountain cavalry tactics and elite archers.",
        "The Peace Accord of 1700 AD was signed after negotiations led to mutual respect between Raja Bhim Chand and Guru Gobind Singh Ji.",
        "Bilaspur hill forts remained unconquered during multiple foreign invasions."
      ]
    },
    culture: {
      title: "Cultural Renaissance",
      era: "18th – 19th Century AD",
      img: "assets/images/event_cultural_renaissance.jpg",
      text: "The Bilaspur court was a renowned cradle of Pahari miniature painting, classical Hindustani music, and architecture. The world-famous Rang Mahal palace, Gopalji temple, and riverside ghats witnessed poetry gatherings and grand festival assemblies.",
      facts: [
        "Distinctive Bilaspur Pahari miniature style known for soft pastel hues and lyrical romance.",
        "The riverside Rang Mahal boasted 120 rooms embellished with natural gold-leaf frescoes.",
        "Patronized celebrated musicians and masters of the rudra veena and sitar."
      ]
    },
    british_era: {
      title: "British Era & Beyond",
      era: "1815 – 1948 AD",
      img: "assets/images/event_british_era.jpg",
      text: "Following the Treaty of 1815, Bilaspur maintained sovereign princely status. The final ruler, Raja Anand Chand, navigated the accession of Bilaspur to the Indian Union in 1948, culminating in the historic construction of the Bhakra Dam.",
      facts: [
        "Bilaspur retained a 11-gun salute in the imperial protocol.",
        "Became a Part C State in independent India under Chief Commissioner Raja Anand Chand in 1948.",
        "In 1954, Bilaspur was merged into the territory of Himachal Pradesh."
      ]
    }
  };

  const exploreButtons = document.querySelectorAll('.btn-event-explore');
  exploreButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const eventKey = btn.getAttribute('data-event');
      const data = EVENTS_DATA[eventKey];
      if (!data) return;

      const modal = document.getElementById('eventModal');
      if (!modal) return;

      document.getElementById('eventModalImg').src = data.img;
      document.getElementById('eventModalTitle').textContent = data.title;
      document.getElementById('eventModalEra').textContent = `Historical Era: ${data.era}`;
      document.getElementById('eventModalText').textContent = data.text;

      const factsContainer = document.getElementById('eventModalFacts');
      factsContainer.innerHTML = '';
      if (data.facts) {
        const ul = document.createElement('ul');
        ul.style.cssText = 'list-style:none;padding-left:0;margin-top:1rem;';
        data.facts.forEach(f => {
          const li = document.createElement('li');
          li.style.cssText = 'margin-bottom:0.5rem;font-size:0.92rem;color:#e2d2bf;';
          li.innerHTML = `❖ <span style="margin-left:6px;">${f}</span>`;
          ul.appendChild(li);
        });
        factsContainer.appendChild(ul);
      }

      modal.classList.add('active');
    });
  });

  // ==========================================
  // 9. AI STORYTELLER (unchanged)
  // ==========================================
  const AI_LORE = {
    fort: "The Fortress of Kot Kahlur stands perched high in the Naina Devi hills at over 3,600 feet. Founded in 697 AD by Raja Bir Chand, its massive sandstone walls defended the heart of Kehloor. Legend holds that Raja Bir Chand saw a goat fight off a fierce leopard at this very summit, which he took as a divine omen of victory to build the state's central fort!",
    anandpur: "The campaigns around Anandpur Sahib between Raja Bhim Chand of Kehloor and the tenth Sikh Guru, Guru Gobind Singh Ji, are recorded in the classical chronicles of 'Bichitra Natak'. After strategic battles, a historic treaty was forged, cementing mutual respect and regional tranquility across the Shivalik hills.",
    submerged: "Ah, the sunken Atlantis of Himachal! Before the construction of the mighty Bhakra Dam in 1961 created the vast Govind Sagar reservoir, the ancient stone city of Bilaspur stood along the turquoise Sutlej river. Its magnificent Rang Mahal palace, 30 historic temples, and ornate stone bathing ghats are now submerged underwater. During dry summers when reservoir levels recede, the sacred stone spires of the submerged temples emerge once again like ghosts from history!",
    hira: "Raja Hira Chand (1857-1883) is revered as the architect of modern Bilaspur. Known as the Golden Era of Kehloor, he abolished archaic taxes, built the main carriage roads connecting the hills to the plains, introduced tea plantations, and laid down the state's first modern treasury.",
    paintings: "The Bilaspur School of Pahari Miniature Painting is world-renowned for its delicate brushstrokes and vibrant mineral pigments made from lapis lazuli, crushed pearls, and pure gold foil. The court painters depicted lyrical scenes of the Rasamanjari, Ramayana, and portraiture of the royal Chandel kings."
  };

  const btnOpenStoryteller = document.getElementById('btnOpenStoryteller');
  const storytellerModal = document.getElementById('storytellerModal');
  const storytellerForm = document.getElementById('storytellerForm');
  const storytellerInput = document.getElementById('storytellerInput');
  const storytellerMessages = document.getElementById('storytellerMessages');
  const storyChips = document.querySelectorAll('.story-chip');
  const btnNarrateAudio = document.getElementById('btnNarrateAudio');
  const btnStopAudio = document.getElementById('btnStopAudio');
  const audioDot = document.getElementById('audioDot');
  const audioStatusText = document.getElementById('audioStatusText');

  let currentUtterance = null;
  let lastNarrationText = "";

  if (btnOpenStoryteller) {
    btnOpenStoryteller.addEventListener('click', () => {
      storytellerModal.classList.add('active');
    });
  }

  storyChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.getAttribute('data-topic');
      const response = AI_LORE[topic] || "The royal chronicler ponders the depths of your inquiry...";
      addChatMessage("user", chip.textContent);
      setTimeout(() => {
        addChatMessage("bot", response);
        speakText(response);
      }, 500);
    });
  });

  if (storytellerForm) {
    storytellerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = storytellerInput.value.trim();
      if (!query) return;
      addChatMessage("user", query);
      storytellerInput.value = "";
      setTimeout(() => {
        const reply = generateChronicleResponse(query);
        addChatMessage("bot", reply);
        speakText(reply);
      }, 600);
    });
  }

  function addChatMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}-msg`;
    if (sender === 'bot') {
      msgDiv.innerHTML = `
        <div class="msg-avatar"><img src="assets/images/storyteller_avatar.jpg" alt="AI"></div>
        <div class="msg-content">${text}</div>
      `;
    } else {
      msgDiv.innerHTML = `<div class="msg-content">${text}</div>`;
    }
    storytellerMessages.appendChild(msgDiv);
    storytellerMessages.scrollTop = storytellerMessages.scrollHeight;
    lastNarrationText = text;
  }

  function generateChronicleResponse(query) {
    const q = query.toLowerCase();
    if (q.includes("fort") || q.includes("kahlur") || q.includes("qila")) return AI_LORE.fort;
    if (q.includes("battle") || q.includes("war") || q.includes("anandpur") || q.includes("fight")) return AI_LORE.anandpur;
    if (q.includes("lake") || q.includes("dam") || q.includes("water") || q.includes("submerge") || q.includes("rang mahal") || q.includes("bhakra")) return AI_LORE.submerged;
    if (q.includes("hira") || q.includes("golden") || q.includes("reform")) return AI_LORE.hira;
    if (q.includes("art") || q.includes("paint") || q.includes("miniature") || q.includes("culture")) return AI_LORE.paintings;
    if (q.includes("sansar")) return "Raja Sansar Chand's reign was the crown jewel of Kehloor's cultural renaissance. He formed legendary alliances across the Kangra and Shivalik valleys and protected the sacred arts against all adversaries.";
    return `By the sacred waters of the Sutlej, the chronicles of Kehloor hold that ${query} remains deeply woven into the valor and royal heritage of Bilaspur. From the peaks of Naina Devi to the deep blue of Govind Sagar, the Chandel lineage forever remembers this legacy!`;
  }

  function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    currentUtterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance.rate = 0.92;
    currentUtterance.pitch = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India') || v.lang.includes('en-GB'));
    if (preferredVoice) currentUtterance.voice = preferredVoice;
    currentUtterance.onstart = () => {
      if (audioDot) audioDot.classList.add('speaking');
      if (audioStatusText) audioStatusText.textContent = "Narrating Royal Chronicle...";
    };
    currentUtterance.onend = () => {
      if (audioDot) audioDot.classList.remove('speaking');
      if (audioStatusText) audioStatusText.textContent = "Narrator: Ready";
    };
    currentUtterance.onerror = () => {
      if (audioDot) audioDot.classList.remove('speaking');
      if (audioStatusText) audioStatusText.textContent = "Narrator: Ready";
    };
    window.speechSynthesis.speak(currentUtterance);
  }

  if (btnNarrateAudio) {
    btnNarrateAudio.addEventListener('click', () => {
      if (lastNarrationText) speakText(lastNarrationText);
      else speakText("Pranam! Ask me any chronicle of Bilaspur and I shall narrate its glorious past.");
    });
  }
  if (btnStopAudio) {
    btnStopAudio.addEventListener('click', () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (audioDot) audioDot.classList.remove('speaking');
      if (audioStatusText) audioStatusText.textContent = "Narrator: Stopped";
    });
  }

  // ==========================================
  // 10. MODAL MANAGER
  // ==========================================
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const allModals = document.querySelectorAll('.royal-modal-backdrop');
  const closeButtons = document.querySelectorAll('.modal-close-btn');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        closeAllModals();
        targetModal.classList.add('active');
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => { closeAllModals(); });
  });

  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  function closeAllModals() {
    // Close regular modals
    allModals.forEach(m => m.classList.remove('active'));
    // Close fullscreen ruler modal
    const rulerFullModal = document.getElementById('rulerModal');
    if (rulerFullModal) rulerFullModal.classList.remove('active');
    stopAudio();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (audioDot) audioDot.classList.remove('speaking');
  }

  // ==========================================
  // 11. 360° TOUR PAN CONTROLS
  // ==========================================
  const tourPanoImg = document.getElementById('tourPanoImg');
  const btnPanLeft = document.getElementById('tourPanLeft');
  const btnPanRight = document.getElementById('tourPanRight');
  const btnPanReset = document.getElementById('tourPanReset');
  let currentPanOffset = 0;

  if (btnPanLeft && tourPanoImg) {
    btnPanLeft.addEventListener('click', () => {
      currentPanOffset = Math.min(currentPanOffset + 40, 100);
      tourPanoImg.style.transform = `scale(1.3) translateX(${currentPanOffset}px)`;
    });
  }
  if (btnPanRight && tourPanoImg) {
    btnPanRight.addEventListener('click', () => {
      currentPanOffset = Math.max(currentPanOffset - 40, -100);
      tourPanoImg.style.transform = `scale(1.3) translateX(${currentPanOffset}px)`;
    });
  }
  if (btnPanReset && tourPanoImg) {
    btnPanReset.addEventListener('click', () => {
      currentPanOffset = 0;
      tourPanoImg.style.transform = `scale(1) translateX(0)`;
    });
  }

  // ==========================================
  // 12. HERO CTA & NAVIGATION
  // ==========================================
  const btnBeginJourney = document.getElementById('btnBeginJourney');
  if (btnBeginJourney) {
    btnBeginJourney.addEventListener('click', () => {
      document.getElementById('rulers').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const btnExploreBilaspur = document.getElementById('btnExploreBilaspur');
  if (btnExploreBilaspur) {
    btnExploreBilaspur.addEventListener('click', () => {
      document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const mobileBtn = document.getElementById('mobileMenuBtn');
  const royalNav = document.getElementById('royalNav');
  if (mobileBtn && royalNav) {
    mobileBtn.addEventListener('click', () => { royalNav.classList.toggle('open'); });
  }

  // Trigger first king on load for demo
  // (optional – uncomment if you want modal to open on load)
  // if (allKings.length > 0) await openRulerModal(allKings[0].index);

  console.log(`Virasat E Kehloor initialized. ${allKings.length} kings loaded from data folder.`);
});
