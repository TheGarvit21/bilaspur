/**
 * VIRASAT E KEHLOOR — THE ROYAL HERITAGE OF BILASPUR
 * Interactive Engine: Rulers Timeline, AI Storyteller, Speech Synthesis & Modals
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 0. GRAND ROYAL CURTAIN OPENING REVEAL
  // ==========================================
  const curtainStage = document.getElementById('royalCurtainStage');
  if (curtainStage) {
    // Open curtains after brief theatrical pause (600ms)
    setTimeout(() => {
      curtainStage.classList.add('opened');
    }, 600);

    // Or open immediately if user clicks
    curtainStage.addEventListener('click', () => {
      curtainStage.classList.add('opened');
    });

    // Remove from interaction layer once opened
    setTimeout(() => {
      curtainStage.style.display = 'none';
    }, 2400);
  }

  // ==========================================
  // 1. DATA REPOSITORY: RULERS & EVENTS
  // ==========================================
  const RULERS_DATA = {
    1: {
      name: "Raja Kirpal Chand",
      reign: "1650 – 1690",
      img: "assets/images/ruler_1_kirpal.jpg",
      capital: "Kot Kahlur",
      fort: "Kot Kahlur / Tiun Fort",
      patronage: "Fort Architecture & Border Defense",
      bio: "Raja Kirpal Chand was an unyielding guardian of Kehloor sovereignty. During his forty-year rule, he consolidated the hill principality's defenses, rebuilt the ancient towers of Kot Kahlur, and repelled multiple regional incursions along the Sutlej gorge."
    },
    2: {
      name: "Raja Govind Chand",
      reign: "1690 – 1720",
      img: "assets/images/ruler_2_govind.jpg",
      capital: "Bilaspur (Vyaspur)",
      fort: "Sriun Fort",
      patronage: "Agrarian Canals & Sutlej River Trade",
      bio: "Under Raja Govind Chand, Kehloor enjoyed agricultural prosperity and flourishing trade along the Sutlej waterway. He laid the foundation for peaceful diplomatic ties with neighbouring hill monarchies and patronized traditional temple architecture."
    },
    3: {
      name: "Raja Hira Chand",
      reign: "1720 – 1760",
      img: "assets/images/ruler_3_hira.jpg",
      capital: "Bilaspur",
      fort: "Bahadurpur Fort",
      patronage: "Pahari Literature & Civic Reservoirs",
      bio: "A visionary ruler whose wisdom transformed Kehloor into a progressive mountain state. He commissioned state granaries, built stone water tanks across hill villages, and invited skilled painters and poets to the Bilaspur court."
    },
    4: {
      name: "Raja Sansar Chand",
      reign: "1760 – 1823",
      img: "assets/images/ruler_4_sansar.jpg",
      capital: "Bilaspur & Sujanpur",
      fort: "Kot Kahlur / Kangra",
      patronage: "Pahari Miniature Paintings & Classical Sitar",
      bio: "The most iconic monarch of the era. His reign sparked a cultural golden age in the Western Himalayas. Master painters like Nainsukh and Manaku created exquisite Pahari miniature artworks in the Bilaspur court, depicting the Geet Govinda and Mahabharata."
    },
    5: {
      name: "Raja Ranjit Chand",
      reign: "1823 – 1843",
      img: "assets/images/ruler_5_ranjit.jpg",
      capital: "Bilaspur",
      fort: "Fatehpur Fort",
      patronage: "Rajput Cavalry & Weapon Metallurgy",
      bio: "Raja Ranjit Chand commanded high respect among Western Himalayan monarchs for his statesmanship and valiant military drills. He navigated intricate treaties during a turbulent period of regional power shifts."
    },
    6: {
      name: "Raja Amar Chand",
      reign: "1843 – 1860",
      img: "assets/images/ruler_6_amar.jpg",
      capital: "Bilaspur",
      fort: "Rang Mahal & Riverside Pavilions",
      patronage: "The Grand Rang Mahal & State Legal Code",
      bio: "Renowned for commissioning the fabled Rang Mahal on the left bank of the Sutlej—a magnificent palace famous for its frescoed chambers and waterfront jharokhas. He codified the customary laws of Kehloor."
    },
    7: {
      name: "Raja Jagat Singh",
      reign: "1860 – 1890",
      img: "assets/images/ruler_7_jagat.jpg",
      capital: "Bilaspur",
      fort: "Kot Kahlur Citadel",
      patronage: "Modern Judicial Courts & Telegraphic Lines",
      bio: "Modernizer of the realm who inaugurated modern schools, laid postal and telegraph networks through mountainous terrain, and instituted judicial courts to ensure swift justice across all districts of Kehloor."
    }
  };

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

  // Pre-configured AI Lore Knowledge Base
  const AI_LORE = {
    fort: "The Fortress of Kot Kahlur stands perched high in the Naina Devi hills at over 3,600 feet. Founded in 697 AD by Raja Bir Chand, its massive sandstone walls defended the heart of Kehloor. Legend holds that Raja Bir Chand saw a goat fight off a fierce leopard at this very summit, which he took as a divine omen of victory to build the state's central fort!",
    anandpur: "The campaigns around Anandpur Sahib between Raja Bhim Chand of Kehloor and the tenth Sikh Guru, Guru Gobind Singh Ji, are recorded in the classical chronicles of 'Bichitra Natak'. After strategic battles, a historic treaty was forged, cementing mutual respect and regional tranquility across the Shivalik hills.",
    submerged: "Ah, the sunken Atlantis of Himachal! Before the construction of the mighty Bhakra Dam in 1961 created the vast Govind Sagar reservoir, the ancient stone city of Bilaspur stood along the turquoise Sutlej river. Its magnificent Rang Mahal palace, 30 historic temples, and ornate stone bathing ghats are now submerged underwater. During dry summers when reservoir levels recede, the sacred stone spires of the submerged temples emerge once again like ghosts from history!",
    hira: "Raja Hira Chand (1857-1883) is revered as the architect of modern Bilaspur. Known as the Golden Era of Kehloor, he abolished archaic taxes, built the main carriage roads connecting the hills to the plains, introduced tea plantations, and laid down the state's first modern treasury.",
    paintings: "The Bilaspur School of Pahari Miniature Painting is world-renowned for its delicate brushstrokes and vibrant mineral pigments made from lapis lazuli, crushed pearls, and pure gold foil. The court painters depicted lyrical scenes of the Rasamanjari, Ramayana, and portraiture of the royal Chandel kings."
  };

  // ==========================================
  // 2. RULERS TIMELINE INTERACTION
  // ==========================================
  const rulerCards = document.querySelectorAll('.ruler-card');
  const trackContainer = document.getElementById('rulersTrackContainer');
  const btnRulerPrev = document.getElementById('rulerPrevBtn');
  const btnRulerNext = document.getElementById('rulerNextBtn');

  // Carousel navigation
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

  // Ruler Card Click -> Highlight & Open Ruler Detail Modal
  rulerCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const data = RULERS_DATA[id];

      // Update active state visual
      rulerCards.forEach(c => {
        c.classList.remove('active-featured');
        const frame = c.querySelector('.ruler-avatar-frame');
        if (frame) {
          frame.classList.remove('featured-frame');
          const mOuter = frame.querySelector('.mandala-outer-ring');
          const mInner = frame.querySelector('.mandala-inner-ring');
          if (mOuter) mOuter.remove();
          if (mInner) mInner.remove();
        }
      });

      card.classList.add('active-featured');
      const frame = card.querySelector('.ruler-avatar-frame');
      if (frame) {
        frame.classList.add('featured-frame');
        const outer = document.createElement('div');
        outer.className = 'mandala-outer-ring';
        const inner = document.createElement('div');
        inner.className = 'mandala-inner-ring';
        frame.prepend(outer);
        frame.prepend(inner);
      }

      // Update and open Ruler Modal
      if (data) {
        openRulerModal(data);
      }
    });
  });

  function openRulerModal(data) {
    const modal = document.getElementById('rulerModal');
    if (!modal) return;

    document.getElementById('rulerModalImg').src = data.img;
    document.getElementById('rulerModalName').textContent = data.name;
    document.getElementById('rulerModalReign').textContent = `(${data.reign})`;
    document.getElementById('rulerModalBio').textContent = data.bio;
    document.getElementById('rulerModalCapital').textContent = data.capital;
    document.getElementById('rulerModalFort').textContent = data.fort;
    document.getElementById('rulerModalPatronage').textContent = data.patronage;

    // Listen button in ruler modal triggers AI storyteller voice
    const btnListen = document.getElementById('btnRulerListenStory');
    btnListen.onclick = () => {
      closeAllModals();
      openStorytellerWithPrompt(`Tell me the glorious historical tale of ${data.name} of Kehloor (${data.reign}).`);
    };

    modal.classList.add('active');
  }

  // ==========================================
  // 3. POPULAR EVENTS EXPLORE INTERACTION
  // ==========================================
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
        ul.style.listStyle = 'none';
        ul.style.paddingLeft = '0';
        ul.style.marginTop = '1rem';
        data.facts.forEach(f => {
          const li = document.createElement('li');
          li.style.marginBottom = '0.5rem';
          li.style.fontSize = '0.92rem';
          li.style.color = '#e2d2bf';
          li.innerHTML = `❖ <span style="margin-left: 6px;">${f}</span>`;
          ul.appendChild(li);
        });
        factsContainer.appendChild(ul);
      }

      modal.classList.add('active');
    });
  });

  // ==========================================
  // 4. AI STORYTELLER & SPEECH SYNTHESIS
  // ==========================================
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

  // Handle suggested story chips
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

  // Handle custom user questions in AI Storyteller
  if (storytellerForm) {
    storytellerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = storytellerInput.value.trim();
      if (!query) return;

      addChatMessage("user", query);
      storytellerInput.value = "";

      // Generate AI historical response
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
      msgDiv.innerHTML = `
        <div class="msg-content">${text}</div>
      `;
    }

    storytellerMessages.appendChild(msgDiv);
    storytellerMessages.scrollTop = storytellerMessages.scrollHeight;
    lastNarrationText = text;
  }

  function generateChronicleResponse(query) {
    const q = query.toLowerCase();
    if (q.includes("fort") || q.includes("kahlur") || q.includes("qila")) {
      return AI_LORE.fort;
    } else if (q.includes("battle") || q.includes("war") || q.includes("anandpur") || q.includes("fight")) {
      return AI_LORE.anandpur;
    } else if (q.includes("lake") || q.includes("dam") || q.includes("water") || q.includes("submerge") || q.includes("rang mahal") || q.includes("bhakra")) {
      return AI_LORE.submerged;
    } else if (q.includes("hira") || q.includes("golden") || q.includes("reform")) {
      return AI_LORE.hira;
    } else if (q.includes("art") || q.includes("paint") || q.includes("miniature") || q.includes("culture")) {
      return AI_LORE.paintings;
    } else if (q.includes("sansar")) {
      return "Raja Sansar Chand's reign was the crown jewel of Kehloor's cultural renaissance. He formed legendary alliances across the Kangra and Shivalik valleys and protected the sacred arts against all adversaries.";
    } else {
      return `By the sacred waters of the Sutlej, the chronicles of Kehloor hold that ${query} remains deeply woven into the valor and royal heritage of Bilaspur. From the peaks of Naina Devi to the deep blue of Govind Sagar, the Chandel lineage forever remembers this legacy!`;
    }
  }

  // Web Speech Synthesis (Text-To-Speech)
  function speakText(text) {
    if (!('speechSynthesis' in window)) {
      if (audioStatusText) audioStatusText.textContent = "Voice synthesis not supported in this browser.";
      return;
    }

    window.speechSynthesis.cancel(); // cancel any active speech

    // Clean HTML tags for speech
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    currentUtterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance.rate = 0.92; // dignified royal pace
    currentUtterance.pitch = 0.95;

    // Pick best available English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India') || v.lang.includes('en-GB'));
    if (preferredVoice) {
      currentUtterance.voice = preferredVoice;
    }

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
      if (lastNarrationText) {
        speakText(lastNarrationText);
      } else {
        speakText("Pranam! Ask me any chronicle of Bilaspur and I shall narrate its glorious past.");
      }
    });
  }

  if (btnStopAudio) {
    btnStopAudio.addEventListener('click', () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioDot) audioDot.classList.remove('speaking');
      if (audioStatusText) audioStatusText.textContent = "Narrator: Stopped";
    });
  }

  function openStorytellerWithPrompt(promptText) {
    storytellerModal.classList.add('active');
    addChatMessage("user", promptText);
    setTimeout(() => {
      const reply = generateChronicleResponse(promptText);
      addChatMessage("bot", reply);
      speakText(reply);
    }, 500);
  }

  // ==========================================
  // 5. MODAL MANAGER (GENERIC)
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
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  function closeAllModals() {
    allModals.forEach(m => m.classList.remove('active'));
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioDot) audioDot.classList.remove('speaking');
  }

  // ==========================================
  // 6. 360° TOUR PAN CONTROLS
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
  // 7. HERO CTA & NAVIGATION
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

  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const royalNav = document.getElementById('royalNav');
  if (mobileBtn && royalNav) {
    mobileBtn.addEventListener('click', () => {
      royalNav.classList.toggle('open');
    });
  }

  console.log("Virasat E Kehloor initialized with full royal heritage experience.");
});
