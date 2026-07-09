// vfx_boss.js - Epic Boss Entrance Framework
if (typeof window.VFXManager === 'undefined') {
    window.VFXManager = {};
}

// FIX: Add cleanup method to prevent memory leaks
VFXManager.cleanupBossEntrance = function() {
    const existing = document.getElementById('vfx-boss-overlay');
    if (existing) existing.remove();
    if (VFXManager._bossPixiApp) {
        VFXManager._bossPixiApp.destroy(true, { children: true, texture: true });
        VFXManager._bossPixiApp = null;
    }
    // FIX: Reset global state flags that were never cleared
    VFXManager.isOmenActive = false;
    VFXManager.isPhantomConverging = false;
};

VFXManager.playBossEntrance = function(bossName = 'ametric', config = {}) {
    // Guard: prevent double trigger
    if (document.getElementById('vfx-boss-overlay')) return;

    const defaultCfg = {
        enableOmens: true,
        enableSkyCrack: true,
        enablePhantom: true,
        enableCombatUI: true
    };
    const c = { ...defaultCfg, ...config };

    const container = document.getElementById("game-container");
    const timeline = gsap.timeline();

    const bossOverlay = document.createElement("div");
    bossOverlay.id = "vfx-boss-overlay";
    bossOverlay.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:99995;";
    document.body.appendChild(bossOverlay);

    // FIX: Define w/h at top level so all layers can access them regardless of which layers are enabled
    const w = window.innerWidth;
    const h = window.innerHeight;

    // --- Layer 1: Environmental Omens ---
    if (c.enableOmens) {
        const vignette = document.createElement("div");
        vignette.style.cssText = "position:absolute;inset:0;";
        bossOverlay.appendChild(vignette);
        timeline.to(vignette, { boxShadow: "inset 0 0 150px rgba(0,0,0,0.8)", duration: 3 }, 0);

        // Tuning forks at 4 corners
        const forksSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        forksSvg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;overflow:visible;";
        bossOverlay.appendChild(forksSvg);

        const createFork = (x, y, rotation) => {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            // FIX: Don't use transform-based scale as initial state and then GSAP scale simultaneously
            // Use opacity-only animation and draw at actual size
            g.setAttribute("transform", `translate(${x}, ${y}) rotate(${rotation})`);
            g.style.opacity = "0";
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M-8,-40 L-8,0 C-8,8 8,8 8,0 L8,-40 M0,8 L0,40");
            path.setAttribute("stroke", "#999");
            path.setAttribute("stroke-width", "3");
            path.setAttribute("fill", "none");
            g.appendChild(path);
            forksSvg.appendChild(g);
            return g;
        };

        const f1 = createFork(30, 30, 45);
        const f2 = createFork(w - 30, 30, 135);
        const f3 = createFork(w - 30, h - 30, 225);
        const f4 = createFork(30, h - 30, 315);

        timeline.to([f1, f2, f3, f4], { opacity: 0.2, duration: 3, ease: "power3.in" }, 0);

        // Signal tea break particles to slow down
        VFXManager.isOmenActive = true;
    }

    // --- Layers 2 & 3: PixiJS ---
    if (c.enableSkyCrack || c.enablePhantom) {
        const pixiContainer = document.createElement("div");
        pixiContainer.style.cssText = "position:absolute;inset:0;pointer-events:none;";
        bossOverlay.appendChild(pixiContainer);

        const app = new PIXI.Application();
        VFXManager._bossPixiApp = app; // Store ref for cleanup

        app.init({ resizeTo: window, backgroundAlpha: 0, preference: 'webgl' }).then(() => {
            app.canvas.style.pointerEvents = 'none';
            pixiContainer.appendChild(app.canvas);
            const particleContainer = new PIXI.Container();
            app.stage.addChild(particleContainer);
            let particles = [];

            // --- Layer 2: Sky Crack ---
            if (c.enableSkyCrack) {
                const crackSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                crackSvg.style.cssText = `position:absolute;inset:0;width:${w}px;height:${h}px;pointer-events:none;filter:drop-shadow(0 0 3px white) drop-shadow(0 0 1px #aaa);`;
                bossOverlay.appendChild(crackSvg);

                // Generate random zig-zag crack path
                let d = `M ${w / 2} 0`;
                let currY = 0;
                while (currY < h) {
                    currY += 40 + Math.random() * 60;
                    const currX = w / 2 + (Math.random() - 0.5) * 120;
                    d += ` L ${currX} ${currY}`;
                }
                const pathLength = 2500;
                const crackPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                crackPath.setAttribute("d", d);
                crackPath.setAttribute("stroke", "#1a1a1a");
                crackPath.setAttribute("stroke-width", "6");
                crackPath.setAttribute("fill", "none");
                crackPath.setAttribute("stroke-dasharray", pathLength);
                crackPath.setAttribute("stroke-dashoffset", pathLength);
                crackSvg.appendChild(crackPath);

                // White highlight edge
                const crackHighlight = crackPath.cloneNode();
                crackHighlight.setAttribute("stroke", "rgba(255,255,255,0.6)");
                crackHighlight.setAttribute("stroke-width", "1");
                crackSvg.appendChild(crackHighlight);

                // Chromatic aberration flash + screen shake ON crack start
                timeline.add(() => {
                    const flashEl = document.createElement("div");
                    flashEl.style.cssText = "position:fixed;inset:0;background:white;z-index:99998;mix-blend-mode:exclusion;";
                    document.body.appendChild(flashEl);
                    gsap.fromTo(flashEl, { opacity: 0.8 }, { opacity: 0, duration: 0.15, onComplete: () => flashEl.remove() });

                    // Screen shake with RGB split on container
                    const origFilter = container.style.filter || '';
                    gsap.fromTo(container,
                        { x: -8, y: 6, filter: "drop-shadow(8px 0 0 rgba(255,0,0,0.7)) drop-shadow(-8px 0 0 rgba(0,0,255,0.7))" },
                        { x: 0, y: 0, filter: origFilter, duration: 0.25, ease: "elastic.out(1, 0.3)" }
                    );
                }, 3.0);

                // Draw crack
                timeline.to(crackPath, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 3.0);
                timeline.to(crackHighlight, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 3.0);

                // Sheet particle burst from crack
                timeline.add(() => {
                    // Try loading texture; fallback to generated shape
                    const sheetTex = PIXI.Texture.from('assets/torn_sheet.png');

                    for (let i = 0; i < 50; i++) {
                        let sprite;
                        try {
                            sprite = new PIXI.Sprite(sheetTex);
                        } catch(e) { sprite = null; }

                        if (!sprite || !sprite.texture.valid) {
                            // FIX: v8 rect API
                            const g = new PIXI.Graphics();
                            g.rect(-1, -15, 2, 30).fill({ color: 0x888888, alpha: 0.8 });
                            sprite = new PIXI.Sprite(app.renderer.generateTexture(g));
                            g.destroy();
                        }

                        sprite.anchor.set(0.5);
                        sprite.x = w / 2 + (Math.random() - 0.5) * 50;
                        sprite.y = (h / 50) * i;
                        sprite.blendMode = 'add';
                        particleContainer.addChild(sprite);

                        const angle = Math.random() * Math.PI * 2;
                        particles.push({
                            sprite,
                            x: sprite.x, y: sprite.y,
                            vx: Math.cos(angle) * (10 + Math.random() * 20),
                            vy: Math.sin(angle) * (10 + Math.random() * 20),
                        });
                    }

                    app.ticker.add((ticker) => {
                        const delta = ticker.deltaTime;
                        particles.forEach(p => {
                            if (!VFXManager.isPhantomConverging) {
                                p.x += p.vx * delta;
                                p.y += p.vy * delta;
                                p.vx *= 0.95;
                                p.vy *= 0.95;
                                p.sprite.rotation += 0.08 * delta;
                            } else {
                                const dx = w / 2 - p.x;
                                const dy = h / 2 - p.y;
                                p.x += dx * 0.04 * delta;
                                p.y += dy * 0.04 * delta;
                            }
                            p.sprite.x = p.x;
                            p.sprite.y = p.y;
                        });
                    });
                }, 3.0);
            }

            // --- Layer 3: Phantom Condensation ---
            if (c.enablePhantom) {
                timeline.add(() => {
                    VFXManager.isPhantomConverging = true;

                    // Orbiting debris
                    const debrisTex = PIXI.Texture.from('assets/broken_violin.png');
                    for (let i = 0; i < 3; i++) {
                        let sprite;
                        try { sprite = new PIXI.Sprite(debrisTex); } catch(e) { sprite = null; }

                        if (!sprite || !sprite.texture.valid) {
                            // FIX: v8 poly API
                            const g = new PIXI.Graphics();
                            g.poly([-20, -10, 20, -5, 15, 20, -10, 15])
                             .fill({ color: 0x333333, alpha: 0.9 })
                             .stroke({ width: 1, color: 0x888888 });
                            sprite = new PIXI.Sprite(app.renderer.generateTexture(g));
                            g.destroy();
                        }

                        sprite.anchor.set(0.5);
                        particleContainer.addChild(sprite);

                        const angleObj = { a: (i / 3) * Math.PI * 2 };
                        const r = 150 + Math.random() * 80;
                        app.ticker.add((ticker) => {
                            angleObj.a += 0.008 * ticker.deltaTime;
                            // Subtle jitter for "resonance" feel
                            sprite.x = w / 2 + Math.cos(angleObj.a) * r + (Math.random() - 0.5) * 2;
                            sprite.y = h / 2 + Math.sin(angleObj.a) * r + (Math.random() - 0.5) * 2;
                            sprite.rotation += 0.004 * ticker.deltaTime;
                        });
                    }

                    // Color detuning
                    gsap.to(container, {
                        filter: "grayscale(40%) contrast(1.1) sepia(20%) hue-rotate(180deg)",
                        duration: 1.5,
                        ease: "power2.inOut"
                    });

                    // Boss portrait glow (black-silver chromatic)
                    const avatar = document.getElementById("character-avatar");
                    if (avatar) {
                        gsap.to(avatar, {
                            filter: "drop-shadow(0 0 20px rgba(200,200,200,0.7)) drop-shadow(3px 0 0 rgba(255,255,255,0.4)) drop-shadow(-3px 0 0 rgba(0,0,0,0.9)) contrast(1.3)",
                            duration: 1.2,
                            delay: 0.5
                        });
                    }
                }, 4.5);
            }
        });
    }

    // --- Layer 4: Combat UI ---
    if (c.enableCombatUI) {
        container.classList.add('boss-combat-ui-active');
    }
};
