// vfx_ultimate.js - Ultimate Effects Framework
if (typeof window.VFXManager === 'undefined') {
    window.VFXManager = {};
}

VFXManager.playUltimate = function(character, onComplete) {
    // Guard: prevent double trigger
    if (document.getElementById('vfx-ult-container')) return;

    const ultContainer = document.createElement("div");
    ultContainer.id = "vfx-ult-container";
    document.body.appendChild(ultContainer);

    const canvasContainer = document.createElement("div");
    canvasContainer.className = "vfx-ult-pixi";
    ultContainer.appendChild(canvasContainer);

    const bgDark = document.createElement("div");
    bgDark.className = "vfx-ult-bg";
    ultContainer.appendChild(bgDark);

    const spotlight = document.createElement("div");
    spotlight.className = "vfx-ult-spotlight";
    ultContainer.appendChild(spotlight);

    const flash = document.createElement("div");
    flash.className = "vfx-ult-flash";
    flash.style.opacity = "0";
    ultContainer.appendChild(flash);

    const textArea = document.createElement("div");
    textArea.className = "vfx-ult-text";
    ultContainer.appendChild(textArea);

    // SVG golden underline
    const textSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    textSvg.className = "vfx-ult-line";
    textSvg.style.width = "100%";
    textSvg.style.height = "2px";
    textSvg.style.marginTop = "10px";
    textArea.appendChild(textSvg);

    const svgLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    svgLine.setAttribute("x1", "0");
    svgLine.setAttribute("y1", "1");
    svgLine.setAttribute("x2", "100%");
    svgLine.setAttribute("y2", "1");
    svgLine.setAttribute("stroke", "#D4AF37");
    svgLine.setAttribute("stroke-width", "2");
    svgLine.setAttribute("stroke-dasharray", "1000");
    svgLine.setAttribute("stroke-dashoffset", "1000");
    textSvg.appendChild(svgLine);

    const app = new PIXI.Application();
    app.init({
        resizeTo: window,
        backgroundAlpha: 0,
        preference: 'webgl'
    }).then(() => {
        canvasContainer.appendChild(app.canvas);
        const particleContainer = new PIXI.Container();
        app.stage.addChild(particleContainer);

        // --- FIX: PixiJS v8 compatible triangle creation ---
        const triangles = [];
        const createTriangle = () => {
            const g = new PIXI.Graphics();
            // v8 API: fill() instead of beginFill/endFill
            g.poly([-10, 10, 10, 10, 0, -10]).fill(0xC49A45);
            const tex = app.renderer.generateTexture(g);
            g.destroy(); // cleanup temp graphics
            const sprite = new PIXI.Sprite(tex);
            sprite.anchor.set(0.5);
            sprite.x = window.innerWidth / 2 + (Math.random() - 0.5) * 300;
            sprite.y = window.innerHeight / 2 + (Math.random() - 0.5) * 300;
            sprite.alpha = 0;
            sprite.rotation = Math.random() * Math.PI * 2;
            particleContainer.addChild(sprite);
            triangles.push({ sprite, angle: Math.random() * Math.PI * 2, radius: 80 + Math.random() * 100 });
        };

        const tl = gsap.timeline();

        // Stage 1
        tl.fromTo(bgDark, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.inOut" }, 0);
        tl.fromTo(spotlight, { scale: 0.5, opacity: 0 }, { scale: 1.5, opacity: 0.6, duration: 0.45, ease: "power1.out" }, 0.15);

        // Stage 1.5 - Particles
        tl.add(() => {
            for (let i = 0; i < 15; i++) createTriangle();
            app.ticker.add((delta) => {
                triangles.forEach(t => {
                    t.angle += 0.005 * delta;
                    t.sprite.x = window.innerWidth / 2 + Math.cos(t.angle) * t.radius;
                    t.sprite.y = window.innerHeight / 2 + Math.sin(t.angle) * t.radius;
                    t.sprite.rotation += 0.01 * delta;
                    if (t.sprite.alpha < 0.6) t.sprite.alpha += 0.02;
                });
            });
        }, 0.3);

        // Stage 2 - Narrative Text (character-aware)
        const textsByChar = {
            huaixu: ["第一拍，是钟声的倒影。", "第二拍，是离散的脚步。", "第三拍——该谢幕了。"],
            default: ["序曲开始。", "主题奏响。", "终章，落幕。"]
        };
        const texts = textsByChar[character] || textsByChar.default;
        let textTime = 0.6;
        texts.forEach((text) => {
            tl.add(() => {
                const p = document.createElement("p");
                p.className = "vfx-ult-para";
                p.textContent = text;
                textArea.insertBefore(p, textSvg);
                gsap.fromTo(p, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
            }, textTime);
            textTime += 0.8;
        });

        // SVG gold line draw
        tl.to(svgLine, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 0.6);

        // Stage 3 - Burst
        tl.fromTo(flash, { opacity: 0 }, { opacity: 0.7, duration: 0.2, ease: "power4.out", yoyo: true, repeat: 1 }, 3.5);
        tl.add(() => {
            // --- FIX: PixiJS v8 Shockwave ring API ---
            const shockwave = new PIXI.Graphics();
            shockwave.circle(0, 0, 50).stroke({ width: 10, color: 0xC49A45, alpha: 1 });
            shockwave.x = window.innerWidth / 2;
            shockwave.y = window.innerHeight / 2;
            shockwave.blendMode = 'add';
            particleContainer.addChild(shockwave);

            gsap.to(shockwave.scale, { x: 20, y: 20, duration: 0.6, ease: "power2.out" });
            gsap.to(shockwave, { alpha: 0, duration: 0.6, ease: "power2.in", onComplete: () => shockwave.destroy() });

            // Light streak particles
            for (let i = 0; i < 100; i++) {
                const p = new PIXI.Graphics();
                // --- FIX: v8 rect API ---
                p.rect(0, -1, 30, 2).fill(0xC49A45);
                p.x = window.innerWidth / 2;
                p.y = window.innerHeight / 2;
                p.blendMode = 'add';
                const angle = Math.random() * Math.PI * 2;
                p.rotation = angle;
                particleContainer.addChild(p);

                const speed = 20 + Math.random() * 30;
                gsap.to(p, {
                    x: p.x + Math.cos(angle) * speed * 20,
                    y: p.y + Math.sin(angle) * speed * 20,
                    alpha: 0,
                    duration: 1.0 + Math.random() * 0.5,
                    ease: "power3.out",
                    onComplete: () => p.destroy()
                });
            }

            // Damage counter
            const dmgText = document.createElement("div");
            dmgText.style.cssText = "font-size:48px;color:#C49A45;font-weight:bold;font-style:italic;";
            dmgText.textContent = "9999";
            textArea.appendChild(dmgText);

            let obj = { val: 9999, progress: 0 };
            gsap.to(obj, {
                val: 0, progress: 1, duration: 0.3, ease: "power2.in",
                onUpdate: () => {
                    dmgText.textContent = Math.floor(obj.val);
                    let color;
                    if (obj.progress < 0.5) {
                        color = gsap.utils.interpolate("#D4AF37", "#8B2354", obj.progress * 2);
                    } else {
                        color = gsap.utils.interpolate("#8B2354", "#D4AF37", (obj.progress - 0.5) * 2);
                    }
                    dmgText.style.color = color;
                }
            });
        }, 3.5);

        // Stage 4 - Exit
        tl.to(spotlight, { scale: 0.5, opacity: 0, duration: 0.6 }, 4.2);
        tl.to(bgDark, { opacity: 0, duration: 1 }, 4.5);
        tl.to(textArea, { opacity: 0, duration: 0.5 }, 4.5);
        tl.add(() => {
            ultContainer.remove();
            app.destroy(true, { children: true, texture: true });
            if (onComplete) onComplete();
        }, 5.5);
    });
};
