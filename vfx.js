/* ═══════════════════════════════════════════════════════════════════════════════════════════
   文件: vfx.js | 行号: 1-465
   功能: 原生 JS 特效引擎 —— 好感度弹窗、茶歇粒子、交响按钮绑定、槐序独演演出
   依赖: GSAP 3 (CDN)、PixiJS v8 (CDN)
   被引用: apply_hooks.js 将 VFXManager 注入 game.js 的 showToast/showChoices/renderTeaBreakUI
            game.js 直接调用 VFXManager.playHuaixuUltimate() 触发挥序独演
   ⚠️ 修改注意: VFXManager 为全局单例对象，修改方法签名需同步更新 apply_hooks.js
   ═══════════════════════════════════════════════════════════════════════════════════════════ */


const VFXManager = {
  activeToasts: [],
  teaBreakApp: null,

  /* ───────────────────────────────────────────────────────────
     模块: 好感度弹窗 | 行号: 16-101 | 方法: showRelationshipToast
     功能: 使用 GSAP 动画显示角色关系值变化的弹窗
     参数: name(角色名) stat(属性名) value(变化值) characterColor(角色主题色)
     被调用: apply_hooks.js Hook 2 → 替换 game.js 的 showToast()
     依赖: GSAP (gsap.fromTo, gsap.to), #toast-area DOM 元素, vfx_styles.css
     ⚠️ 修改注意: value 参数会直接显示，负号需调用方传入
     ─────────────────────────────────────────────────────────── */
  showRelationshipToast: function(name, stat, value, characterColor) {
    const toastArea = document.getElementById("toast-area");
    if (!toastArea) return;

    const toastId = "toast_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    const isPositive = value > 0;
    
    // Premium Design Tokens
    const themeColor = isPositive ? '#D4AF37' : '#8B2354';
    const bgGradient = isPositive 
      ? 'linear-gradient(135deg, rgba(20,20,25,0.95), rgba(30,28,24,0.95))' 
      : 'linear-gradient(135deg, rgba(25,18,20,0.95), rgba(15,10,12,0.95))';
    const borderColor = isPositive ? 'rgba(212,175,55,0.3)' : 'rgba(139,35,84,0.3)';
    const glowColor = isPositive ? 'rgba(212,175,55,0.2)' : 'rgba(139,35,84,0.2)';
    
    const displayValue = isPositive ? `+${value}` : `${value}`; // Value already has minus if negative

    const toast = document.createElement("div");
    toast.id = toastId;
    toast.className = "vfx-toast";
    toast.style.background = bgGradient;
    toast.style.border = `1px solid ${borderColor}`;
    toast.style.boxShadow = `0 8px 32px ${glowColor}, inset 0 0 12px ${glowColor}`;
    
    // Generate delicate HTML structure
    toast.innerHTML = `
      <div class="vfx-toast-decorator" style="background: linear-gradient(180deg, transparent, ${themeColor}, transparent);"></div>
      <div class="vfx-toast-content">
        <div class="vfx-toast-header">
          <span class="vfx-toast-dot" style="background-color: ${characterColor}; box-shadow: 0 0 8px ${characterColor}"></span>
          <span class="vfx-toast-name">${name}</span>
        </div>
        <div class="vfx-toast-body">
          <span class="vfx-toast-stat" style="color: rgba(250, 246, 239, 0.85);">${stat}</span>
          <span class="vfx-toast-val" style="color: ${themeColor};">${displayValue}</span>
        </div>
      </div>
    `;

    toastArea.appendChild(toast);

    // 管理队列 (最多3个)
    this.activeToasts.push(toast);
    if (this.activeToasts.length > 3) {
      const oldest = this.activeToasts.shift();
      // 加速销毁最老的
      gsap.killTweensOf(oldest);
      gsap.to(oldest, { y: -40, opacity: 0, duration: 0.2, ease: "power2.in", onComplete: () => oldest.remove() });
    }

    // 重排现有 toasts (向上推)
    this.activeToasts.forEach((t, i) => {
      if (t !== toast) {
        const offset = (this.activeToasts.length - 1 - i) * -52; // 每个高度+间距大约52px
        gsap.to(t, { y: offset, duration: 0.4, ease: "back.out(1.2)" });
      }
    });

    // 当前 Toast 入场动画 (0-400ms) — 从上方滑入（toast 已移至顶部中央）
    gsap.fromTo(toast, 
      { x: 0, y: -20, opacity: 0 }, 
      { x: 0, y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
    );

    // 停留轻微浮动 (400-2000ms)
    gsap.to(toast, {
      y: -18,
      duration: 0.4,
      ease: "power1.inOut",
      yoyo: true,
      repeat: 1,
      delay: 0.4
    });

    // 消失动画 (2000-2400ms)
    gsap.to(toast, {
      y: -40,
      opacity: 0,
      duration: 0.4,
      delay: 2.0,
      ease: "power2.in",
      onComplete: () => {
        toast.remove();
        this.activeToasts = this.activeToasts.filter(t => t !== toast);
      }
    });
  },

  /* ───────────────────────────────────────────────────────────
     模块: 茶歇粒子系统 | 行号: 105-257 | 方法: initTeaBreakParticles / destroyTeaBreakParticles
     功能: 使用 PixiJS 在茶歇界面渲染飘浮的音乐符号和星光粒子
     依赖: PixiJS v8 (PIXI.Application, PIXI.Graphics, PIXI.Text)
     被调用: apply_hooks.js Hook 3 → 注入到 game.js 的 renderTeaBreakUI()
     ⚠️ 修改注意: Mobile 检测 (window.innerWidth <= 768) 控制粒子数量上限
                 销毁时必须调用 destroyTeaBreakParticles() 清理 PixiJS 应用
     ─────────────────────────────────────────────────────────── */
  initTeaBreakParticles: async function(containerElement) {
    if (this.teaBreakApp) return;

    this.teaBreakApp = new PIXI.Application();
    await this.teaBreakApp.init({
      resizeTo: containerElement,
      backgroundAlpha: 0,
      preference: 'webgl',
      antialias: true
    });

    // Insert as first child to be behind content
    this.teaBreakApp.canvas.style.position = 'absolute';
    this.teaBreakApp.canvas.style.inset = '0';
    this.teaBreakApp.canvas.style.zIndex = '0';
    this.teaBreakApp.canvas.style.pointerEvents = 'none';
    containerElement.insertBefore(this.teaBreakApp.canvas, containerElement.firstChild);

    const particleContainer = new PIXI.Container();
    this.teaBreakApp.stage.addChild(particleContainer);

    const isMobile = window.innerWidth <= 768;
    const MAX_PARTICLES = isMobile ? 15 : 30;
    const particles = [];
    const noteChars = ['♩', '♪', '♫', '♬'];
    const appInfo = this.teaBreakApp;

    class Particle {
      constructor() {
        this.sprite = new PIXI.Container();
        const rand = Math.random();
        if (rand < 0.5) {
          this.type = 'star'; this.setupStar();
        } else if (rand < 0.8) {
          this.type = 'note'; this.setupNote();
        } else {
          this.type = 'lace'; this.setupLace();
        }

        const marginX = appInfo.screen.width * 0.05;
        const marginY = appInfo.screen.height * 0.05;
        this.sprite.x = -marginX + Math.random() * (appInfo.screen.width + marginX * 2);
        this.sprite.y = appInfo.screen.height + Math.random() * marginY;

        this.maxLife = 300 + Math.random() * 300;
        this.life = 0;
        this.timeOffset = Math.random() * Math.PI * 2;
        this.sprite.alpha = 0;
        particleContainer.addChild(this.sprite);
      }

      setupStar() {
        const g = new PIXI.Graphics();
        const size = 3 + Math.random() * 3;
        const isGold = Math.random() > 0.5;
        g.fill({ color: isGold ? 0xD4AF37 : 0xE8D9B5 });
        g.star(0, 0, Math.floor(4 + Math.random() * 3), size, size / 2);
        g.fill();
        this.sprite.addChild(g);
        this.baseAlpha = 0.2 + Math.random() * 0.4;
        this.vy = -(0.3 + Math.random() * 0.5);
        this.vx = 0;
        this.rotSpeed = 0;
      }

      setupNote() {
        const char = noteChars[Math.floor(Math.random() * noteChars.length)];
        const text = new PIXI.Text({
          text: char, 
          style: { fontFamily: 'Georgia, serif', fontSize: 10 + Math.random() * 6, fill: 0xD4AF37 }
        });
        text.anchor.set(0.5);
        this.sprite.addChild(text);
        this.baseAlpha = 0.15 + Math.random() * 0.2;
        this.vy = -(0.1 + Math.random() * 0.3);
        this.vx = 0;
        this.rotSpeed = 0.003 + Math.random() * 0.005;
      }

      setupLace() {
        const g = new PIXI.Graphics();
        g.stroke({ width: 1, color: 0xD4AF37 });
        const points = [];
        const numPoints = 5 + Math.floor(Math.random() * 4);
        for(let i=0; i<numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const r = 4 + Math.random() * 6;
          points.push({ x: Math.cos(angle)*r, y: Math.sin(angle)*r });
        }
        g.moveTo(points[0].x, points[0].y);
        for(let i=1; i<numPoints; i++) { g.lineTo(points[i].x, points[i].y); }
        g.closePath();
        g.stroke();
        this.sprite.addChild(g);
        this.baseAlpha = 0.2 + Math.random() * 0.3;
        this.vy = (0.05 + Math.random() * 0.1);
        this.vx = 0;
        this.rotSpeed = (Math.random() - 0.5) * 0.002;
      }

      update(delta) {
        this.life += delta;
        this.sprite.y += this.vy * delta;
        if (this.type === 'star') {
           this.sprite.x += Math.sin(this.life * 0.02 + this.timeOffset) * 0.5 * delta;
        } else if (this.type === 'lace') {
           this.sprite.x += Math.sin(this.life * 0.05 + this.timeOffset) * 0.1 * delta;
        }
        this.sprite.rotation += this.rotSpeed * delta;

        if (this.life < 60) {
          this.sprite.alpha = this.baseAlpha * (this.life / 60);
        } else if (this.life > this.maxLife - 60) {
          this.sprite.alpha = this.baseAlpha * ((this.maxLife - this.life) / 60);
        } else {
          this.sprite.alpha = this.baseAlpha;
        }
        return this.life < this.maxLife;
      }

      destroy() {
        this.sprite.destroy({ children: true });
      }
    }

    let frameCount = 0;
    this.teaBreakApp.ticker.add((ticker) => {
      const delta = ticker.deltaTime;
      frameCount += delta;
      if (frameCount >= 60) {
        frameCount = 0;
        if (particles.length < MAX_PARTICLES) {
          const spawnCount = 1 + Math.floor(Math.random() * 3);
          for(let i=0; i<spawnCount; i++) {
            if (particles.length < MAX_PARTICLES) particles.push(new Particle());
          }
        }
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const isAlive = particles[i].update(delta);
        if (!isAlive) {
          particles[i].destroy();
          particles.splice(i, 1);
        }
      }
    });
  },

  destroyTeaBreakParticles: function() {
    if (this.teaBreakApp) {
      this.teaBreakApp.destroy(true, { children: true, texture: true, baseTexture: true });
      this.teaBreakApp = null;
    }
  },

  /* ───────────────────────────────────────────────────────────
     模块: 交响按钮绑定 | 行号: 261-309 | 方法: bindSymphonyButton
     功能: 为剧情选择按钮添加层叠装饰（光环/扫光/钻石）和点击涟漪特效
     参数: buttonElement(目标按钮DOM) variant(颜色变体: gold/crimson/huaixu/luowen)
     被调用: apply_hooks.js Hook 1 → 注入到 game.js 的 showChoices()
     依赖: GSAP (gsap.timeline), vfx_styles.css 中的 .symphony-* 样式
     ⚠️ 修改注意: variant 的 colorMap 值与 CSS 的 .symphony-btn-{variant} 类名必须对应
     ─────────────────────────────────────────────────────────── */
  bindSymphonyButton: function(buttonElement, variant = 'gold') {
    // Add base classes
    buttonElement.classList.add("symphony-btn");
    buttonElement.classList.add(`symphony-btn-${variant}`);
    
    // Create layers if not exist
    if (!buttonElement.querySelector('.symphony-layer-halo')) {
      const halo = document.createElement('div');
      halo.className = 'symphony-layer-halo';
      
      const sweep = document.createElement('div');
      sweep.className = 'symphony-layer-sweep';
      
      const content = document.createElement('span');
      content.className = 'symphony-content';
      content.innerHTML = `<span class="symphony-diamond">◆</span>${buttonElement.textContent}<span class="symphony-diamond">◆</span>`;
      
      buttonElement.textContent = '';
      buttonElement.appendChild(halo);
      buttonElement.appendChild(sweep);
      buttonElement.appendChild(content);
    }

    const colorMap = { gold: '212, 175, 55', crimson: '139, 35, 84', huaixu: '196, 154, 69', luowen: '90, 55, 40' };
    const rgb = colorMap[variant] || colorMap.gold;

    buttonElement.addEventListener("mousedown", (e) => {
      const tl = gsap.timeline();
      tl.to(buttonElement, { scale: 0.97, duration: 0.08, ease: "power2.in" })
        .to(buttonElement, { scale: 1.03, duration: 0.12, ease: "expo.out" })
        .to(buttonElement, { scale: 1.00, duration: 0.10, ease: "power1.out" });

      // Screen flash
      const flash = document.createElement('div');
      flash.className = "symphony-click-flash";
      flash.style.left = `${e.clientX}px`;
      flash.style.top = `${e.clientY}px`;
      flash.style.background = `radial-gradient(closest-side, rgba(${rgb}, 0.3), transparent)`;
      document.body.appendChild(flash);

      gsap.set(flash, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0.6 });
      gsap.to(flash, {
        scale: 3, 
        opacity: 0, 
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => flash.remove()
      });
    });
  },

  /* ───────────────────────────────────────────────────────────
     模块: 槐序独演演出 | 行号: 313-470 | 方法: playHuaixuUltimate
     功能: 播放槐序终极技能的完整视觉演出序列（三角粒子/花瓣/辉光/爆炸/文本）
     参数: enemyHpElement(敌方血量DOM) onComplete(完成回调)
     被调用: game.js 中的 triggerUltimatePresentation()
     依赖: GSAP (gsap.timeline), PixiJS v8, vfx_styles.css 中的 .vfx-ult-* 样式
     ⚠️ 修改注意: 时间轴硬编码 (0.6s/3.5s/4.2s/5.0s)，修改时需保持 GSAP timeline 同步
     ─────────────────────────────────────────────────────────── */
  playHuaixuUltimate: async function(enemyHpElement, onComplete) {
    const container = document.createElement('div');
    container.id = "vfx-ultimate-container";
    document.body.appendChild(container);

    const pixiContainer = document.createElement('div');
    pixiContainer.className = "vfx-ult-pixi";
    container.appendChild(pixiContainer);

    const bgOverlay = document.createElement('div');
    bgOverlay.className = "vfx-ult-bg";
    container.appendChild(bgOverlay);

    const spotlight = document.createElement('div');
    spotlight.className = "vfx-ult-spotlight";
    container.appendChild(spotlight);

    const whiteFlash = document.createElement('div');
    whiteFlash.className = "vfx-ult-flash";
    container.appendChild(whiteFlash);

    // PixiJS Setup
    const app = new PIXI.Application();
    await app.init({ resizeTo: window, backgroundAlpha: 0, preference: 'webgl', antialias: true });
    pixiContainer.appendChild(app.canvas);
    
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    
    const pContainer = new PIXI.Container();
    app.stage.addChild(pContainer);

    const triangles = [], petals = [], glows = [], explosion = [];
    let isStage3 = false;

    // init particles
    for (let i = 0; i < 12; i++) {
      const g = new PIXI.Graphics();
      const size = 8 + Math.random() * 12;
      g.fill({ color: 0xC49A45, alpha: 0.4 + Math.random() * 0.4 });
      g.poly([0, -size, size * 0.866, size * 0.5, -size * 0.866, size * 0.5]);
      g.fill();
      pContainer.addChild(g);
      triangles.push({ sprite: g, orbit: 80 + Math.random() * 100, angle: Math.random() * Math.PI * 2, speed: (0.3 + Math.random() * 0.5) * (Math.PI / 180) });
    }

    const spawnPetal = () => {
      const g = new PIXI.Graphics();
      g.fill({ color: 0xC08A8A, alpha: 0.2 + Math.random() * 0.3 });
      g.moveTo(0, -5); g.bezierCurveTo(5, -5, 8, 2, 0, 8); g.bezierCurveTo(-8, 2, -5, -5, 0, -5); g.fill();
      g.x = cx + (Math.random() - 0.5) * 400; g.y = cy - 200 - Math.random() * 200;
      pContainer.addChild(g);
      petals.push({ sprite: g, vy: 0.5 + Math.random() * 1, vx: (Math.random() - 0.5) * 0.5, rot: (Math.random() - 0.5) * 0.05, time: Math.random() * 100 });
    };
    for(let i=0; i<15; i++) spawnPetal();

    const spawnGlow = () => {
      const g = new PIXI.Graphics();
      g.fill({ color: 0xC49A45, alpha: 1 }); g.circle(0, 0, 1 + Math.random() * 3); g.fill();
      g.blendMode = 'add';
      const r = Math.random() * 150, a = Math.random() * Math.PI * 2;
      g.x = cx + Math.cos(a) * r; g.y = cy + Math.sin(a) * r;
      pContainer.addChild(g);
      glows.push({ sprite: g, life: 0, maxLife: 20 + Math.random() * 40 });
    };
    for(let i=0; i<20; i++) spawnGlow();

    app.ticker.add((ticker) => {
      const delta = ticker.deltaTime;
      triangles.forEach(t => {
        t.angle += t.speed * delta;
        t.sprite.x = cx + Math.cos(t.angle) * t.orbit;
        t.sprite.y = cy + Math.sin(t.angle) * t.orbit;
        t.sprite.rotation += 0.01 * delta;
      });
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i]; p.time += delta; p.sprite.y += p.vy * delta; p.sprite.x += (p.vx + Math.sin(p.time * 0.05) * 0.5) * delta; p.sprite.rotation += p.rot * delta;
        if (p.sprite.y > cy + 400) { p.sprite.destroy(); petals.splice(i, 1); if (!isStage3) spawnPetal(); }
      }
      for (let i = glows.length - 1; i >= 0; i--) {
        const g = glows[i]; g.life += delta; g.sprite.alpha = Math.sin((g.life / g.maxLife) * Math.PI);
        if (g.life >= g.maxLife) { g.sprite.destroy(); glows.splice(i, 1); if (!isStage3) spawnGlow(); }
      }
      for (let i = explosion.length - 1; i >= 0; i--) {
        const p = explosion[i]; p.vx *= p.friction; p.vy *= p.friction; p.vy += p.gravity; p.sprite.x += p.vx * delta; p.sprite.y += p.vy * delta;
        p.alpha -= 0.015 * delta; p.sprite.alpha = p.alpha;
        if (p.alpha <= 0) { p.sprite.destroy(); explosion.splice(i, 1); }
      }
    });

    const triggerExplosion = () => {
      isStage3 = true;
      for (let i = 0; i < 150; i++) {
        const g = new PIXI.Graphics();
        g.fill({ color: Math.random() > 0.2 ? 0xC49A45 : 0xC08A8A, alpha: 0.8 }); g.circle(0, 0, 2 + Math.random() * 4); g.fill(); g.blendMode = 'add';
        g.x = cx; g.y = cy; pContainer.addChild(g);
        const a = Math.random() * Math.PI * 2, s = 15 + Math.random() * 20;
        explosion.push({ sprite: g, vx: Math.cos(a) * s, vy: Math.sin(a) * s, friction: 0.92, gravity: 0.2, alpha: 1 });
      }
    };

    // Text elements
    const textContainer = document.createElement('div');
    textContainer.className = "vfx-ult-text";
    container.appendChild(textContainer);
    
    // GSAP Timeline
    const tl = gsap.timeline({ onComplete: () => {
      app.destroy(true, { children: true });
      container.remove();
      if(onComplete) onComplete();
    }});

    gsap.set([bgOverlay, spotlight, whiteFlash], { opacity: 0 });
    gsap.set(spotlight, { scale: 0.5 });

    // Stage 1
    tl.to(bgOverlay, { opacity: 1, duration: 0.3, ease: "power2.inOut" }, 0);
    tl.to(spotlight, { scale: 1.5, opacity: 0.6, duration: 0.45, ease: "power1.out" }, 0.15);

    // Stage 2 Texts (600ms+)
    const texts = ["银灰的身影在你视野中旋转，", "不是你记得的那种舞蹈，是什么东西比你先一步抓住了节拍。", "如果必须换位，这次你要跟上。"];
    texts.forEach((txt, i) => {
      tl.call(() => {
        textContainer.innerHTML = `<div class="vfx-ult-para">${txt}<div class="vfx-ult-line"></div></div>`;
        const para = textContainer.querySelector('.vfx-ult-para');
        const line = textContainer.querySelector('.vfx-ult-line');
        gsap.fromTo(para, { opacity: 0, filter: 'blur(8px)', y: 10 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.5 });
        gsap.fromTo(line, { width: '0%' }, { width: '100%', duration: 0.6, ease: "power1.out" });
      }, null, 0.6 + i * 1.0);
    });

    // Stage 3 (3500ms)
    tl.call(() => {
      textContainer.innerHTML = "";
      triggerExplosion();
      if (enemyHpElement) {
        let currentHp = parseInt(enemyHpElement.textContent) || 1500;
        gsap.to({val: currentHp}, {val: 0, duration: 0.3, onUpdate: function() {
          enemyHpElement.textContent = Math.floor(this.val);
        }});
      }
    }, null, 3.5);
    tl.to(whiteFlash, { opacity: 0.7, duration: 0.1, ease: "power4.out" }, 3.5)
      .to(whiteFlash, { opacity: 0, duration: 0.3, ease: "power2.in" }, 3.6);

    // Stage 4 (4200ms)
    tl.call(() => {
      triangles.forEach(t => t.speed *= 0.2);
      petals.forEach(p => { p.vy *= 0.2; p.vx *= 0.2; p.rot *= 0.2; });
      textContainer.innerHTML = `<div class="vfx-ult-post">“……你在看吗？”</div>`;
      gsap.fromTo(textContainer.firstChild, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 });
    }, null, 4.2);

    tl.to(spotlight, { scale: 0.5, opacity: 0, duration: 1.0, ease: "power2.inOut" }, 4.2);
    tl.to(bgOverlay, { opacity: 0, duration: 1.0, ease: "power2.inOut" }, 4.5);
    tl.to(textContainer, { opacity: 0, duration: 0.5 }, 5.0);
  }
};
