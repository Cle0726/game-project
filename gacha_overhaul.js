// gacha_overhaul.js
// Handles the full-screen immersive Gacha sequence

document.addEventListener("DOMContentLoaded", () => {
  // 1. Unbind game.js event listeners by cloning the entry buttons
  const homeBtn = document.getElementById("entry-gacha-button");
  if (homeBtn) {
    const newHomeBtn = homeBtn.cloneNode(true);
    homeBtn.parentNode.replaceChild(newHomeBtn, homeBtn);
  }
  
  const devBtn = document.getElementById("entry-gacha-card-button");
  if (devBtn) {
    const newDevBtn = devBtn.cloneNode(true);
    devBtn.parentNode.replaceChild(newDevBtn, devBtn);
  }

  // Use event delegation for maximum reliability, in case buttons are dynamically added/replaced
  document.addEventListener("click", (event) => {
    if (event.target && (event.target.closest("#entry-gacha-button") || event.target.closest("#entry-gacha-card-button"))) {
      openGachaUniverse();
    }
  });

  document.getElementById("gacha-universe-close")?.addEventListener("click", closeGachaUniverse);
  document.getElementById("gacha-btn-single")?.addEventListener("click", () => playGachaSequence(1));
  document.getElementById("gacha-btn-ten")?.addEventListener("click", () => playGachaSequence(10));
  
  document.getElementById("gacha-btn-collection")?.addEventListener("click", showCollection);
  document.getElementById("gacha-collection-close")?.addEventListener("click", hideCollection);
  document.getElementById("gacha-clear-btn")?.addEventListener("click", confirmClearCollection);
  
  document.getElementById("gacha-results-close")?.addEventListener("click", closeResultsStage);
});

let dependenciesLoaded = false;

function loadGachaDependencies() {
  if (dependenciesLoaded) return Promise.resolve();
  
  const scripts = [
    "https://cdn.jsdelivr.net/npm/tsparticles@3.5.0/tsparticles.bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js",
    "https://cdn.jsdelivr.net/npm/sweetalert2@11"
  ];

  const loadScript = (src) => new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

  return Promise.all(scripts.map(loadScript)).then(() => {
    dependenciesLoaded = true;
    initParticles();
  });
}

function openGachaUniverse() {
  const universe = document.getElementById("gacha-universe");
  if (!universe) return;
  universe.hidden = false;
  
  // Reset states
  const dashboard = document.getElementById("gacha-dashboard");
  dashboard.style.display = "flex";
  document.getElementById("gacha-results-stage").hidden = true;
  document.querySelector(".gacha-result-meta")?.remove();
  document.getElementById("gacha-collection-panel").hidden = true;
  
  // Ambient floating animation for tuning fork
  gsap.fromTo("#gacha-tuning-fork", 
    { y: 20, rotation: -2 }, 
    { y: -20, rotation: 2, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" }
  );

  // Disable interaction while loading dependencies
  const oldEvents = dashboard.style.pointerEvents;
  dashboard.style.pointerEvents = "none";
  loadGachaDependencies().then(() => {
    dashboard.style.pointerEvents = oldEvents;
  }).catch(e => {
    console.error("Failed to load gacha dependencies", e);
    dashboard.style.pointerEvents = oldEvents;
  });
}

function closeGachaUniverse() {
  document.getElementById("gacha-universe").hidden = true;
  gsap.killTweensOf("#gacha-tuning-fork");
}

let particlesContainer;
const GACHA_STATS_KEY = "residual_path_gacha_stats_v2";
let lastGachaResults = [];

function readGachaStats() {
  try { return JSON.parse(localStorage.getItem(GACHA_STATS_KEY) || "{}"); } catch { return {}; }
}

function writeGachaStats(stats) {
  try { localStorage.setItem(GACHA_STATS_KEY, JSON.stringify(stats || {})); } catch {}
}

function getRarityRank(rarity) { return rarity === "SSR" ? 3 : rarity === "SR" ? 2 : 1; }

function getRaritySummary(results = []) {
  return results.reduce((acc, item) => { acc[item.rarity] = (acc[item.rarity] || 0) + 1; return acc; }, { SSR: 0, SR: 0, R: 0 });
}

function updateGachaStats(results = []) {
  const stats = readGachaStats();
  stats.total = Number(stats.total || 0) + results.length;
  stats.sinceSSR = Number(stats.sinceSSR || 0) + results.length;
  stats.sinceSR = Number(stats.sinceSR || 0) + results.length;
  if (results.some((item) => item.rarity === "SSR")) stats.sinceSSR = 0;
  if (results.some((item) => item.rarity === "SSR" || item.rarity === "SR")) stats.sinceSR = 0;
  writeGachaStats(stats);
  return stats;
}

function decorateGachaResults(results = []) {
  const stats = readGachaStats();
  const collection = window.getGachaCollection ? window.getGachaCollection() : {};
  return results.map((item) => {
    const owned = Number(collection[item.id]?.count || 0);
    return { ...item, isNew: owned <= 0, ownedBefore: owned, pityBeforeSSR: Number(stats.sinceSSR || 0) };
  });
}


async function initParticles() {
  if (window.tsParticles) {
    // Custom SVG paths for musical notes
    const eighthNote = "M 100 0 L 100 150 C 100 180 80 200 50 200 C 20 200 0 180 0 150 C 0 120 20 100 50 100 C 60 100 70 103 80 110 L 80 0 L 100 0 Z";
    const trebleClef = "M 50 200 C 20 200 0 180 0 150 C 0 120 20 100 50 100 C 80 100 100 120 100 150 C 100 180 80 200 50 200 Z"; // Simplification for demo

    await tsParticles.load("gacha-particles", {
      fullScreen: { enable: false },
      particles: {
        number: { value: 0 },
        color: { value: ["#FFD700", "#FFFFFF", "#9b59b6"] },
        shape: {
          type: "char",
          options: {
            char: {
              value: ["♪", "♫", "♬", "𝄞", "✦", "✧"],
              font: "Verdana",
              style: "",
              weight: "400",
              fill: true
            }
          }
        },
        opacity: {
          value: { min: 0.3, max: 1 },
          animation: { enable: true, speed: 1, sync: false }
        },
        size: {
          value: { min: 10, max: 35 },
          animation: { enable: true, speed: 5, sync: false }
        },
        move: {
          enable: true,
          speed: { min: 10, max: 30 },
          direction: "none",
          random: false,
          straight: false,
          outModes: { default: "destroy" },
          gravity: { enable: true, acceleration: 9.8 }
        }
      },
      emitters: {
        direction: "top",
        life: { count: 1, duration: 0.1, delay: 0 },
        rate: { delay: 0.1, quantity: 0 }, // Starts at 0
        size: { width: 0, height: 0 },
        position: { x: 50, y: 80 }
      }
    });
    particlesContainer = tsParticles.domItem(0);
  }
}

function playGachaSequence(count) {
  // Disable buttons
  const dashboard = document.getElementById("gacha-dashboard");
  dashboard.style.pointerEvents = "none";
  
  // 1. Audio: low hum & strike
  if (window.AudioManager) {
    AudioManager.playSFX('typing'); // Generic temporary, can use Tone.js for better impact
  }

  // 2. GSAP Sequence
  const tl = gsap.timeline();
  
  // Dashboard fade out
  tl.to(dashboard, { opacity: 0, duration: 0.5, ease: "power2.in" }, 0);
  
  // Tuning fork charge up
  tl.to("#gacha-tuning-fork", {
    scale: 1.2,
    filter: "drop-shadow(0 0 100px rgba(255, 215, 0, 1)) brightness(1.5)",
    duration: 1.5,
    ease: "power2.in"
  }, 0);
  
  // The Strike (Screen Shake)
  tl.to("#gacha-universe", {
    x: () => Math.random() * 20 - 10,
    y: () => Math.random() * 20 - 10,
    duration: 0.1,
    repeat: 5,
    yoyo: true,
    ease: "none",
    onStart: () => {
      // Trigger Particles
      try {
        if (particlesContainer) {
          particlesContainer.play();
          const emittersPlugin = particlesContainer.plugins.get("emitters");
          if (emittersPlugin && emittersPlugin.array && emittersPlugin.array[0]) {
            const emitter = emittersPlugin.array[0];
            emitter.options.rate.quantity = count === 10 ? 80 : 15;
            emitter.play();
            setTimeout(() => emitter.pause(), 200); // Stop emitting after burst
          }
        }
      } catch (e) {
        console.warn("tsParticles emit failed:", e);
      }
      
      // Flash screen white
      gsap.fromTo("#gacha-universe", 
        { backgroundColor: "#fff" }, 
        { backgroundColor: "#1a1e29", duration: 1, ease: "power3.out" }
      );
    }
  }, 1.5);
  
  // Resolve tuning fork
  tl.to("#gacha-tuning-fork", {
    scale: 1,
    filter: "drop-shadow(0 0 40px rgba(196, 154, 69, 0.4)) brightness(1)",
    duration: 1,
    ease: "power2.out"
  }, 1.6);
  
  // 3. Generate Results and Show Cards
  tl.add(() => {
    generateAndShowResults(count);
  }, 2.5);
}

function generateAndShowResults(count) {
  // Use existing pickGachaItem from game.js
  const results = decorateGachaResults(Array.from({ length: count }, () => window.pickGachaItem ? window.pickGachaItem() : getFallbackItem()));
  
  // Save collection
  if (window.getGachaCollection && window.saveGachaCollection) {
    const collection = window.getGachaCollection();
    results.forEach(item => {
      if (collection[item.id]) collection[item.id].count++;
      else collection[item.id] = { ...item, count: 1 };
    });
    window.saveGachaCollection(collection);
  }

  updateGachaStats(results);
  lastGachaResults = results;

  // Render DOM
  const container = document.getElementById("gacha-cards-container");
  container.innerHTML = "";
  
  results.forEach((item, index) => {
    const card = document.createElement("div");
    const isAssetCard = item.type !== "\u5f8b\u8005\u6863\u6848";
    const isDuplicate = !item.isNew;
    card.className = `gacha-3d-card rarity-${item.rarity}${isAssetCard ? " is-asset-card" : " is-character-card"}${isDuplicate ? " is-duplicate" : " is-new"}`;
    card.setAttribute("data-tilt-glare", "true");
    card.setAttribute("data-tilt-max-glare", "0.8");
    card.setAttribute("data-tilt-scale", "1.05");
    card.setAttribute("data-tilt", "");
    card.dataset.gachaIndex = String(index);
    card.title = `${item.rarity} / ${item.type} / ${item.title}`;
    
    // Use the native item image with a premium floating effect
    card.innerHTML = `
      <div class="gacha-card-bg" style="--card-image:url('${item.image}')"></div>
      <div class="gacha-card-glass-layer"></div>
      <img src="${item.image}" alt="${item.title}" class="gacha-card-char">
      <div class="gacha-card-rarity rarity-${item.rarity}">${item.rarity}</div>
      <div class="gacha-card-status">${item.isNew ? "NEW" : `x${(item.ownedBefore || 0) + 1}`}</div>
      <div class="gacha-card-info">
        <h3>${item.title}</h3>
        <p>${item.subtitle || item.type}</p>
        <small>${item.type}</small>
      </div>
    `;
    card.addEventListener("click", () => showGachaCardDetail(item));
    container.appendChild(card);
  });
  
  // Init VanillaTilt safely
  try {
    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(document.querySelectorAll(".gacha-3d-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
      });
    }
  } catch (e) {
    console.warn("VanillaTilt init failed:", e);
  }

  renderGachaResultMeta(results);

  // Show Stage
  const stage = document.getElementById("gacha-results-stage");
  stage.hidden = false;
  
  // GSAP Stagger Reveal
  gsap.fromTo(".gacha-3d-card", 
    { y: 100, opacity: 0, rotationY: 180 },
    { y: 0, opacity: 1, rotationY: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" }
  );
}

function renderGachaResultMeta(results = []) {
  const stage = document.getElementById("gacha-results-stage");
  if (!stage) return;
  const old = stage.querySelector(".gacha-result-meta");
  if (old) old.remove();
  const summary = getRaritySummary(results);
  const best = [...results].sort((a, b) => getRarityRank(b.rarity) - getRarityRank(a.rarity))[0];
  const meta = document.createElement("div");
  meta.className = "gacha-result-meta";
  meta.innerHTML = `<span>\u8c03\u5f8b\u5b8c\u6210</span><strong>${best ? `${best.rarity} / ${best.title}` : "--"}</strong><p>SSR ${summary.SSR || 0} / SR ${summary.SR || 0} / R ${summary.R || 0}</p>`;
  stage.appendChild(meta);
}

function showGachaCardDetail(item) {
  const detailHtml = `<div class="gacha-detail-popup"><img src="${item.image}" alt=""><p>${item.type}</p><strong>${item.subtitle || "\u5df2\u8bb0\u5f55\u5230\u6b8b\u54cd\u6863\u6848"}</strong><small>${item.isNew ? "\u9996\u6b21\u8bb0\u5f55" : `\u91cd\u590d\u8bb0\u5f55 ?${(item.ownedBefore || 0) + 1}`}</small></div>`;
  if (typeof Swal !== "undefined") {
    Swal.fire({ title: `${item.rarity} / ${item.title}`, html: detailHtml, background: "rgba(8,10,15,0.96)", color: "#fff8e8", confirmButtonText: "\u6536\u8d77\u6863\u6848", confirmButtonColor: "#c49a45" });
    return;
  }
  alert(`${item.rarity} / ${item.title}\n${item.subtitle || item.type}`);
}

function closeResultsStage() {
  document.getElementById("gacha-results-stage").hidden = true;
  const dashboard = document.getElementById("gacha-dashboard");
  dashboard.style.opacity = 1;
  dashboard.style.pointerEvents = "auto";
}

function getFallbackItem() {
  return { id: "test", rarity: "SSR", type: "未知实体", title: "高阶残响档案", image: "assets/ui/bg_gacha_tuning_fork.png" };
}

function showCollection() {
  const panel = document.getElementById("gacha-collection-panel");
  const list = document.getElementById("gacha-collection-list");
  panel.hidden = false;
  
  if (window.getGachaCollection) {
    const entries = Object.values(window.getGachaCollection());
    if (entries.length === 0) {
      list.innerHTML = "<p style='color:rgba(255,255,255,0.5)'>暂无记录。</p>";
    } else {
      list.innerHTML = entries
        .sort((a, b) => b.rarity.localeCompare(a.rarity) || a.title.localeCompare(b.title))
        .map(item => `<div class="gacha-collection-chip rarity-${item.rarity}">${item.rarity} ${item.title} ×${item.count}</div>`)
        .join("");
    }
  }
}

function hideCollection() {
  document.getElementById("gacha-collection-panel").hidden = true;
}

function confirmClearCollection() {
  Swal.fire({
    title: '抹除记忆？',
    text: "您即将清空所有残响档案抽取记录，此操作不可逆。",
    icon: 'warning',
    background: '#0d1117',
    color: '#fff',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#34495e',
    confirmButtonText: '确认清空',
    cancelButtonText: '保留记忆'
  }).then((result) => {
    if (result.isConfirmed) {
      if (window.clearGachaCollection) window.clearGachaCollection();
      writeGachaStats({ total: 0, sinceSSR: 0, sinceSR: 0 });
      showCollection();
      Swal.fire({
        title: '已清空',
        text: '调律记录已重置。',
        icon: 'success',
        background: '#0d1117',
        color: '#fff',
        confirmButtonColor: '#c49a45'
      });
    }
  });
}




