// vfx_teabreak.js - Tea Break Ambient Particles
if (typeof window.VFXManager === 'undefined') {
    window.VFXManager = {};
}

VFXManager.teaBreakApp = null;
VFXManager.teaBreakParticles = [];
VFXManager.teaBreakFrameCount = 0;

VFXManager.initTeaBreakParticles = async function(containerElement) {
    if (this.teaBreakApp) return;

    // Use regular Container in Pixi v8 as it's highly optimized
    this.teaBreakApp = new PIXI.Application();
    await this.teaBreakApp.init({
        resizeTo: containerElement,
        backgroundAlpha: 0,
        preference: 'webgl',
        antialias: true
    });

    this.teaBreakApp.canvas.style.position = 'absolute';
    this.teaBreakApp.canvas.style.inset = '0';
    this.teaBreakApp.canvas.style.zIndex = '0';
    this.teaBreakApp.canvas.style.pointerEvents = 'none';
    containerElement.insertBefore(this.teaBreakApp.canvas, containerElement.firstChild);

    const particleContainer = new PIXI.Container();
    this.teaBreakApp.stage.addChild(particleContainer);

    const isMobile = window.innerWidth <= 768;
    const MAX_PARTICLES = isMobile ? 15 : 30;
    const noteChars = ['♩', '♪', '♫', '♬'];
    
    // Texture caches to improve performance
    let starTexture = null;
    let laceTexture = null;

    function createStarTexture(app) {
        if (starTexture) return starTexture;
        const g = new PIXI.Graphics();
        // FIX: PixiJS v8 — drawStar deprecated, use star() method
        if (g.star) {
            g.star(0, 0, 5, 10, 4).fill(0xFFFFFF);
        } else {
            // Fallback for older versions
            g.beginFill(0xFFFFFF);
            g.drawCircle(0, 0, 6);
            g.endFill();
        }
        starTexture = app.renderer.generateTexture(g);
        g.destroy();
        return starTexture;
    }

    function createLaceTexture(app) {
        if (laceTexture) return laceTexture;
        const g = new PIXI.Graphics();
        g.lineStyle(1, 0xFFFFFF);
        
        const points = [];
        const numPoints = Math.floor(Math.random() * 4) + 5; // 5-8
        for(let i=0; i<numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const r = 5 + Math.random() * 5;
            points.push(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        g.drawPolygon(points);
        laceTexture = app.renderer.generateTexture(g);
        return laceTexture;
    }

    class Particle {
        constructor(app, container) {
            this.app = app;
            this.container = container;
            const rand = Math.random();
            if (rand < 0.5) this.type = 'star';
            else if (rand < 0.8) this.type = 'note';
            else this.type = 'lace';

            this.life = 0;
            this.maxLife = 300 + Math.random() * 300;
            this.timeOffset = Math.random() * Math.PI * 2;
            this.active = true;

            const marginX = app.screen.width * 0.05;
            const marginY = app.screen.height * 0.05;
            const startX = -marginX + Math.random() * (app.screen.width + marginX * 2);
            const startY = app.screen.height + (Math.random() * marginY);

            this.setupSprite(startX, startY);
        }

        setupSprite(x, y) {
            if (this.type === 'star') {
                this.sprite = new PIXI.Sprite(createStarTexture(this.app));
                this.sprite.tint = Math.random() > 0.5 ? 0xD4AF37 : 0xE8D9B5; // Gold / Ivory
                const scale = (3 + Math.random() * 3) / 10;
                this.sprite.scale.set(scale);
                this.targetAlpha = 0.2 + Math.random() * 0.4;
                this.vy = - (0.3 + Math.random() * 0.5);
                this.vxAmp = 0.5;
            } else if (this.type === 'note') {
                const char = noteChars[Math.floor(Math.random() * noteChars.length)];
                this.sprite = new PIXI.Text({
                    text: char,
                    style: { fontFamily: 'serif', fontSize: Math.floor(10 + Math.random()*6), fill: 0xD4AF37 }
                });
                this.targetAlpha = 0.15 + Math.random() * 0.2;
                this.vy = - (0.1 + Math.random() * 0.3);
                this.vxAmp = 0.2;
                this.rotSpeed = 0.003 + Math.random() * 0.005;
            } else {
                this.sprite = new PIXI.Sprite(createLaceTexture(this.app));
                this.sprite.tint = 0xD4AF37;
                this.targetAlpha = 0.15 + Math.random() * 0.2;
                this.vy = -(0.08 + Math.random() * 0.12); // Lace: very slow upward drift
                this.vxAmp = 0.15;
                this.rotSpeed = (Math.random() - 0.5) * 0.008;
            }

            this.sprite.anchor.set(0.5);
            this.sprite.x = x;
            this.sprite.y = y;
            this.sprite.alpha = 0;

            // FIX: v8 blend mode uses string
            this.sprite.blendMode = 'add';

            // FIX: DoF blur — use a normalized depth value per particle type
            // Stars vary in scale (0.3-0.6), notes are scale 1, lace varies
            let depthBlur = 0;
            if (this.type === 'star') {
                // Small stars are far away = blurrier
                depthBlur = Math.max(0, (0.4 - this.sprite.scale.x) * 8);
            } else if (this.type === 'note') {
                // Notes: random depth placement
                depthBlur = Math.random() * 1.2;
            } else {
                // Lace: also random depth
                depthBlur = Math.random() * 0.8;
            }
            if (depthBlur > 0.3) {
                const blurFilter = new PIXI.BlurFilter({ strength: depthBlur });
                this.sprite.filters = [blurFilter];
            }

            this.container.addChild(this.sprite);
        }

        update(delta) {
            this.life += delta;
            
            // Fade in/out
            if (this.life < 60) {
                this.sprite.alpha = (this.life / 60) * this.targetAlpha;
            } else if (this.life > this.maxLife - 60) {
                this.sprite.alpha = ((this.maxLife - this.life) / 60) * this.targetAlpha;
            } else {
                this.sprite.alpha = this.targetAlpha;
            }

            if (this.life >= this.maxLife) {
                this.destroy();
                return;
            }

            // FIX: Consume VFXManager.isOmenActive flag to alter movement during boss omen
            const omenFactor = VFXManager.isOmenActive ? 0.3 : 1.0;

            // Movement
            if (VFXManager.isOmenActive) {
                // Particles slowly drift toward screen center during omen
                const cx = (this.app.screen.width / 2 - this.sprite.x) * 0.001 * delta;
                const cy = (this.app.screen.height / 2 - this.sprite.y) * 0.001 * delta;
                this.sprite.x += cx;
                this.sprite.y += cy + this.vy * omenFactor * delta;
            } else {
                this.sprite.y += this.vy * delta;
            }

            if (this.type === 'star') {
                this.sprite.x += Math.sin(this.life * 0.02 + this.timeOffset) * this.vxAmp * omenFactor * delta;
            } else if (this.type === 'note') {
                this.sprite.rotation += this.rotSpeed * delta;
                this.sprite.x += Math.sin(this.life * 0.01 + this.timeOffset) * this.vxAmp * omenFactor * delta;
            } else if (this.type === 'lace') {
                this.sprite.rotation += this.rotSpeed * delta;
                // Lace trembles more intensely during omen
                this.sprite.x += (Math.random() - 0.5) * (VFXManager.isOmenActive ? 1.5 : 0.4);
            }
        }

        destroy() {
            this.active = false;
            if (this.sprite) {
                this.container.removeChild(this.sprite);
                this.sprite.destroy();
            }
        }
    }

    // Initial fill
    for(let i=0; i < MAX_PARTICLES / 2; i++) {
        const p = new Particle(this.teaBreakApp, particleContainer);
        // Randomize start life
        p.life = Math.random() * (p.maxLife - 120) + 60;
        p.sprite.y = Math.random() * this.teaBreakApp.screen.height;
        VFXManager.teaBreakParticles.push(p);
    }

    this.teaBreakApp.ticker.add(() => {
        const delta = this.teaBreakApp.ticker.deltaTime;
        VFXManager.teaBreakFrameCount += delta;
        
        // Spawn
        if (VFXManager.teaBreakFrameCount >= 60) {
            VFXManager.teaBreakFrameCount = 0;
            if (VFXManager.teaBreakParticles.length < MAX_PARTICLES) {
                const count = Math.floor(Math.random() * 3) + 1; // 1-3
                for(let i=0; i<count; i++) {
                    if (VFXManager.teaBreakParticles.length < MAX_PARTICLES) {
                        VFXManager.teaBreakParticles.push(new Particle(this.teaBreakApp, particleContainer));
                    }
                }
            }
        }

        // Update
        for (let i = VFXManager.teaBreakParticles.length - 1; i >= 0; i--) {
            const p = VFXManager.teaBreakParticles[i];
            p.update(delta);
            if (!p.active) {
                VFXManager.teaBreakParticles.splice(i, 1);
            }
        }
    });
};
