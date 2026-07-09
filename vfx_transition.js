// vfx_transition.js - Scene Transition Effects
if (typeof window.VFXManager === 'undefined') {
    window.VFXManager = {};
}

VFXManager.isTransitioning = false;

VFXManager.transitionScene = function(sceneId, type, executeSceneChange) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const container = document.getElementById("game-container");

    // Fallback
    if (typeof gsap === "undefined") {
        executeSceneChange(sceneId);
        this.isTransitioning = false;
        return;
    }

    // Safety: always reset transitioning flag after max timeout
    const safetyTimer = setTimeout(() => { VFXManager.isTransitioning = false; }, 2000);
    const done = () => {
        clearTimeout(safetyTimer);
        VFXManager.isTransitioning = false;
    };

    if (type === 'planA') {
        // --- Golden Line Sweep ---
        const goldLine = document.createElement("div");
        goldLine.style.cssText = `position:fixed;top:0;left:-10px;width:4px;height:100vh;
            background:#D4AF37;filter:blur(3px);z-index:100000;
            box-shadow:0 0 20px #D4AF37,0 0 40px #D4AF37;`;
        document.body.appendChild(goldLine);

        gsap.to(container, {
            x: -20, opacity: 0, duration: 0.25, ease: "power2.in",
            onComplete: () => {
                executeSceneChange(sceneId);

                const sparkContainer = document.createElement("div");
                sparkContainer.style.cssText = "position:fixed;inset:0;z-index:99999;pointer-events:none;";
                document.body.appendChild(sparkContainer);

                let lastSparkX = -999;
                gsap.to(goldLine, {
                    x: window.innerWidth + 20, duration: 0.18, ease: "none",
                    onUpdate: () => {
                        const currentX = parseFloat(goldLine.style.left || '0') + gsap.getProperty(goldLine, "x");
                        if (currentX - lastSparkX > 25) {
                            lastSparkX = currentX;
                            for (let i = 0; i < 4; i++) {
                                const spark = document.createElement("div");
                                const sparkTop = Math.random() * window.innerHeight;
                                spark.style.cssText = `position:absolute;width:6px;height:2px;background:#D4AF37;
                                    left:${currentX}px;top:${sparkTop}px;box-shadow:0 0 6px #D4AF37;border-radius:1px;`;
                                sparkContainer.appendChild(spark);
                                // FIX: animate relative to 0, not to currentX which is already the left position
                                gsap.to(spark, {
                                    x: -(80 + Math.random() * 120),
                                    y: (Math.random() - 0.5) * 60,
                                    opacity: 0,
                                    scaleX: 0.2,
                                    duration: 0.25 + Math.random() * 0.2,
                                    ease: "power2.out",
                                    onComplete: () => spark.remove()
                                });
                            }
                        }
                    },
                    onComplete: () => {
                        goldLine.remove();
                        setTimeout(() => sparkContainer.remove(), 500);
                    }
                });

                gsap.fromTo(container,
                    { x: 20, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.3, ease: "power2.out", delay: 0.05, onComplete: done }
                );
            }
        });

    } else if (type === 'planB') {
        // --- Spotlight Iris Wipe ---
        // FIX: planB had a logic bug - it called executeSceneChange twice in the leaving case.
        // New logic: always use iris wipe, execute scene change at the closed moment.
        const isEntering = sceneId.includes("tea_break");

        if (isEntering) {
            // Entering tea break: start closed, execute scene, then iris open
            container.style.clipPath = "circle(0% at 50% 60%)";
            executeSceneChange(sceneId);
            gsap.to(container, {
                clipPath: "circle(150% at 50% 60%)",
                duration: 0.5,
                ease: "power3.inOut",
                onComplete: () => {
                    container.style.clipPath = "none";
                    done();
                }
            });
        } else {
            // Leaving tea break: iris close, then execute scene, then iris open
            container.style.clipPath = "circle(150% at 50% 60%)";
            gsap.to(container, {
                clipPath: "circle(0% at 50% 60%)",
                duration: 0.4,
                ease: "power3.inOut",
                onComplete: () => {
                    executeSceneChange(sceneId);
                    gsap.to(container, {
                        clipPath: "circle(150% at 50% 60%)",
                        duration: 0.4,
                        ease: "power3.inOut",
                        onComplete: () => {
                            container.style.clipPath = "none";
                            done();
                        }
                    });
                }
            });
        }

    } else if (type === 'planC') {
        // --- 3D Sheet Music Flip ---
        // FIX: perspective should be on a wrapper, not on the element itself.
        // We apply it to document.body temporarily, or use perspective() in transform.
        const flash = document.createElement("div");
        flash.style.cssText = `position:fixed;inset:0;background:#FAF6EF;z-index:100001;opacity:0;
            background-image:repeating-linear-gradient(transparent,transparent 10px,#1a1a1a 10px,#1a1a1a 11px);
            background-size:100% 55px;`;
        document.body.appendChild(flash);

        const flipOut = { angle: 0 };
        gsap.to(flipOut, {
            angle: -90,
            duration: 0.35,
            ease: "power2.in",
            onUpdate: () => {
                const a = flipOut.angle;
                // Use perspective() inside the transform string for correct effect
                container.style.transform = `perspective(1000px) rotateY(${a}deg)`;
                const s = Math.abs(a) / 90;
                container.style.boxShadow = `inset ${s * 80}px 0 80px rgba(0,0,0,${s * 0.7})`;
            },
            onComplete: () => {
                // Flash sheet music
                gsap.to(flash, { opacity: 1, duration: 0.05, onComplete: () => {
                    executeSceneChange(sceneId);
                    setTimeout(() => {
                        gsap.to(flash, { opacity: 0, duration: 0.15, onComplete: () => flash.remove() });
                        const flipIn = { angle: 90 };
                        gsap.to(flipIn, {
                            angle: 0,
                            duration: 0.35,
                            ease: "power2.out",
                            onUpdate: () => {
                                const a = flipIn.angle;
                                container.style.transform = `perspective(1000px) rotateY(${a}deg)`;
                                const s = Math.abs(a) / 90;
                                container.style.boxShadow = `inset ${s * 80}px 0 80px rgba(0,0,0,${s * 0.7})`;
                            },
                            onComplete: () => {
                                container.style.transform = "none";
                                container.style.boxShadow = "none";
                                done();
                            }
                        });
                    }, 50);
                }});
            }
        });

    } else {
        executeSceneChange(sceneId);
        done();
    }
};
