// Advanced VFX Engine additions for Destiny Echoes
// =================================================

// 1. Ambient Spotlight
function initSpotlight() {
    const spotlight = document.createElement('div');
    spotlight.id = 'global-spotlight';
    document.body.appendChild(spotlight);

    // Using GSAP quickTo for high performance
    const xTo = gsap.quickTo(spotlight, "x", {duration: 0.4, ease: "power3"});
    const yTo = gsap.quickTo(spotlight, "y", {duration: 0.4, ease: "power3"});

    window.addEventListener('mousemove', (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
    });
}

// 2. Staggered Text Reveal (Using SplitType + GSAP)
window.animateTextReveal = function(element, text, onComplete) {
    // 强制清理旧的 SplitType 实例，防止窗口 resize 触发旧实例的 revert 导致文本被替换回老文本
    if (element._splitInstance) {
        element._splitInstance.revert();
        element._splitInstance = null;
    }

    // 清理旧动画：杀死元素及其所有子元素上的 GSAP tweens
    gsap.killTweensOf(element);
    element.querySelectorAll("*").forEach(function(child) {
      gsap.killTweensOf(child);
    });
    element.style.opacity = "1";

    if (typeof SplitType === "undefined") {
        console.warn("SplitType not loaded. Falling back to simple fade.");
        element.textContent = text;
        gsap.fromTo(element, {opacity: 0}, {opacity: 1, duration: 0.5, onComplete});
        return;
    }

    // Set text first
    element.textContent = text;

    // Wrap text into characters
    const splitText = new SplitType(element, { types: 'chars,words' });
    element._splitInstance = splitText; // 保存实例以便下次清理
    
    // 如果没有拆分出任何字符，直接完成（防止空文本导致 onComplete 不触发）
    if (!splitText.chars || splitText.chars.length === 0) {
        console.warn("[animateTextReveal] No chars to animate, text:", text ? text.slice(0, 40) : "(empty)");
        if (typeof onComplete === "function") {
            onComplete();
        }
        return;
    }

    // Animate characters with blur and upward movement
    gsap.fromTo(splitText.chars, 
        { 
            opacity: 0, 
            y: 10, 
            filter: "blur(8px)", 
            transformOrigin: "0% 50%" 
        }, 
        {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.015,
            ease: "back.out(1.2)",
            onComplete: () => {
                if (typeof onComplete === "function") {
                    onComplete();
                }
            }
        }
    );
};

// 3. Upgrade bindSymphonyButton with Magnetic Effect
const originalBind = typeof VFXManager !== 'undefined' ? VFXManager.bindSymphonyButton : null;
if (originalBind) {
    VFXManager.bindSymphonyButton = function(btn, variant = "gold") {
        // Original setup (Halo, Sweep)
        originalBind(btn, variant);

        // Add Magnetic Mouse Move
        const xTo = gsap.quickTo(btn, "x", {duration: 0.4, ease: "power2.out"});
        const yTo = gsap.quickTo(btn, "y", {duration: 0.4, ease: "power2.out"});
        
        // Wrap text in a span for parallax if it's just raw text
        if (btn.childNodes.length === 1 && btn.childNodes[0].nodeType === 3) {
            const span = document.createElement("span");
            span.textContent = btn.textContent;
            span.style.display = "inline-block";
            span.style.pointerEvents = "none";
            btn.innerHTML = "";
            btn.appendChild(span);
        }
        
        const textSpan = btn.querySelector("span");
        let textXTo, textYTo;
        if (textSpan) {
            textXTo = gsap.quickTo(textSpan, "x", {duration: 0.4, ease: "power2.out"});
            textYTo = gsap.quickTo(textSpan, "y", {duration: 0.4, ease: "power2.out"});
        }
        
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            // Calculate distance from center
            const x = (e.clientX - rect.left) - (rect.width / 2);
            const y = (e.clientY - rect.top) - (rect.height / 2);
            
            // Move slightly towards cursor (magnetic strength)
            xTo(x * 0.15);
            yTo(y * 0.15);
            
            // Text moves opposite for parallax depth
            if (textXTo) textXTo(-x * 0.05);
            if (textYTo) textYTo(-y * 0.05);
        });

        btn.addEventListener("mouseleave", () => {
            // Reset to center
            xTo(0);
            yTo(0);
            if (textXTo) textXTo(0);
            if (textYTo) textYTo(0);
        });
    };
}

// Auto-init Spotlight
if (document.readyState === "complete") {
    initSpotlight();
} else {
    window.addEventListener('load', initSpotlight);
}
