// vfx_dysregulation.js - Dysregulation Effects Framework
if (typeof window.VFXManager === 'undefined') {
    window.VFXManager = {};
}

// FIX: Character-specific config map
const DYS_CHAR_CONFIG = {
    luowen: {
        color: '#1B3A6B',
        text: '洛温没有等你的节拍——',
        glowColor: 'rgba(27,58,107,0.8)',
        slashColor: 'rgba(27,58,107,0.85)',
    },
    default: {
        color: '#3A1B6B',
        text: '律者已失控——',
        glowColor: 'rgba(58,27,107,0.8)',
        slashColor: 'rgba(58,27,107,0.85)',
    }
};

VFXManager.triggerDysregulation = function(characterName, onComplete) {
    // Guard: prevent double trigger
    if (document.getElementById('vfx-dys-overlay')) return;

    // FIX: use characterName to drive the text and colors
    const cfg = DYS_CHAR_CONFIG[characterName] || DYS_CHAR_CONFIG.default;

    const container = document.getElementById("game-container");
    if (!container) { if (onComplete) onComplete(); return; }

    const overlay = document.createElement("div");
    overlay.id = "vfx-dys-overlay";
    overlay.style.cssText = "position:fixed;inset:0;z-index:99990;pointer-events:none;";
    document.body.appendChild(overlay);

    // --- 1. SVG feDisplacementMap for full-DOM spatial distortion ---
    const filterSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    filterSvg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;";
    // FIX: use unique filter ID to avoid collisions on re-trigger
    const filterId = `dys-displacement-${Date.now()}`;
    const mapId = `dys-map-${Date.now()}`;
    filterSvg.innerHTML = `
      <filter id="${filterId}">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" id="${mapId}"/>
      </filter>`;
    document.body.appendChild(filterSvg);

    const origContainerFilter = container.style.filter || '';
    container.style.filter = `url(#${filterId}) hue-rotate(0deg)`;

    const feMap = document.getElementById(mapId);
    const filterObj = { scale: 0, hue: 0 };
    gsap.to(filterObj, {
        scale: 10, hue: -15, duration: 0.25, ease: "power3.out",
        onUpdate: () => {
            if (feMap) feMap.setAttribute("scale", filterObj.scale);
            container.style.filter = `url(#${filterId}) hue-rotate(${filterObj.hue}deg)`;
        },
        yoyo: true, repeat: 1, repeatDelay: 0.5,
        onComplete: () => {
            container.style.filter = origContainerFilter;
            filterSvg.remove();
        }
    });

    // --- 2. Avatar RGB split glow ---
    const avatar = document.getElementById("character-avatar");
    if (avatar) {
        const origAvatarFilter = avatar.style.filter || '';
        gsap.to(avatar, {
            filter: `drop-shadow(4px 0 0 rgba(255,0,0,0.6)) drop-shadow(-4px 0 0 rgba(0,0,255,0.6)) drop-shadow(0 0 12px ${cfg.color})`,
            duration: 0.1,
            yoyo: true, repeat: 9, // flicker 5 times
            onComplete: () => { avatar.style.filter = origAvatarFilter; }
        });
    }

    // --- 3. Erratic SVG energy path ---
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;overflow:visible;";
    overlay.appendChild(svg);

    const startX = window.innerWidth * 0.18;
    const startY = window.innerHeight * 0.78;
    const endX = window.innerWidth * 0.82;
    const endY = window.innerHeight * 0.38;

    // Multi-segment erratic path for more chaos
    let pathD = `M ${startX} ${startY}`;
    const segments = 5;
    for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const baseX = startX + (endX - startX) * t;
        const baseY = startY + (endY - startY) * t;
        pathD += ` L ${baseX + (Math.random() - 0.5) * 200} ${baseY + (Math.random() - 0.5) * 100}`;
    }

    const energyPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    energyPath.setAttribute("d", pathD);
    energyPath.setAttribute("fill", "none");
    energyPath.setAttribute("stroke", cfg.color);
    energyPath.setAttribute("stroke-width", "4");
    energyPath.setAttribute("stroke-dasharray", "1500");
    energyPath.setAttribute("stroke-dashoffset", "1500");
    energyPath.style.filter = `drop-shadow(0 0 10px ${cfg.color})`;
    svg.appendChild(energyPath);

    // FIX: rough() ease now works because EasePack is loaded
    gsap.to(energyPath, {
        strokeDashoffset: 0,
        duration: 0.45,
        delay: 0.15,
        ease: "rough({ template: power2.out, strength: 1.5, points: 15, randomize: true })",
        onComplete: () => gsap.to(energyPath, { opacity: 0, duration: 0.3, delay: 0.1 })
    });

    // --- 4. Narrative text with slash background ---
    const textContainer = document.createElement("div");
    textContainer.style.cssText = `position:absolute;top:50%;left:0;width:100%;height:90px;
        transform:translateY(-50%);display:flex;align-items:center;justify-content:center;overflow:hidden;`;
    overlay.appendChild(textContainer);

    const slashBg = document.createElement("div");
    slashBg.style.cssText = `position:absolute;width:130%;height:100%;
        background:linear-gradient(90deg, transparent 0%, ${cfg.slashColor} 15%, ${cfg.slashColor} 85%, transparent 100%);
        transform:skewX(-20deg) translateX(-115%);`;
    textContainer.appendChild(slashBg);

    const textLayer = document.createElement("div");
    textLayer.style.cssText = `position:relative;color:#FFFFFF;font-size:34px;
        font-family:var(--font-display,serif);letter-spacing:10px;opacity:0;
        text-shadow:0 0 15px ${cfg.color},0 0 35px ${cfg.glowColor};white-space:nowrap;`;
    textLayer.textContent = cfg.text;
    textContainer.appendChild(textLayer);

    // Slash sweeps in first, text follows
    gsap.to(slashBg, { transform: "skewX(-20deg) translateX(-5%)", duration: 0.25, ease: "power4.out", delay: 0.1 });
    gsap.to(slashBg, { opacity: 0, duration: 0.3, delay: 1.1 });

    gsap.fromTo(textLayer,
        { opacity: 0, x: -40, filter: "blur(8px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.35, ease: "power2.out", delay: 0.22 }
    );
    gsap.to(textLayer, { opacity: 0, x: 40, filter: "blur(8px)", duration: 0.3, delay: 1.1 });

    // --- 5. HP deduction + baton return ---
    setTimeout(() => {
        const healthFeedback = document.createElement("div");
        healthFeedback.style.cssText = `position:fixed;bottom:12%;left:12%;font-size:22px;
            font-weight:bold;color:#D4AF37;z-index:99991;pointer-events:none;`;
        healthFeedback.textContent = "— HP";
        document.body.appendChild(healthFeedback);

        gsap.fromTo(healthFeedback,
            { opacity: 0, y: -5 },
            { opacity: 1, y: 0, duration: 0.1, delay: 0.2 } // 200ms suspense
        );

        let hpObj = { progress: 0 };
        gsap.to(hpObj, {
            progress: 1, duration: 0.6, delay: 0.3,
            ease: "rough({ template: power1.in, strength: 1, points: 8, randomize: true })",
            onUpdate: () => {
                const c = hpObj.progress < 0.5
                    ? gsap.utils.interpolate("#D4AF37", "#8B2354", hpObj.progress * 2)
                    : gsap.utils.interpolate("#8B2354", "#D4AF37", (hpObj.progress - 0.5) * 2);
                healthFeedback.style.color = c;
            },
            onComplete: () => gsap.to(healthFeedback, {
                opacity: 0, y: 5, duration: 0.25,
                onComplete: () => healthFeedback.remove()
            })
        });

        // Baton icon (command return)
        const baton = document.createElement("div");
        baton.style.cssText = `position:fixed;bottom:18%;left:12%;font-size:28px;opacity:0;
            z-index:99991;pointer-events:none;filter:drop-shadow(0 0 8px #D4AF37);`;
        baton.textContent = "🎼";
        document.body.appendChild(baton);
        gsap.to(baton, {
            opacity: 1, duration: 0.08, yoyo: true, repeat: 7, delay: 0.9,
            onComplete: () => baton.remove()
        });
    }, 200);

    // --- 6. Cleanup ---
    setTimeout(() => {
        overlay.remove();
        if (onComplete) onComplete();
    }, 2000);
};
