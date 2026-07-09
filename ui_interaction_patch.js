/**
 * 高级音乐化交互修补脚本 (Premium Musical UI Patch)
 * 特性：零延迟 pointerdown 响应、Hitbox 扩展、物理钢琴采样反馈、滤色光晕涟漪
 */

(function initPremiumUI() {
    // 注入核心 CSS
    const style = document.createElement('style');
    style.textContent = `
        /* 高级按钮核心基类 */
        .premium-gameplay-btn {
            position: relative;
            cursor: pointer;
            touch-action: manipulation;
            user-select: none;
            will-change: transform, filter;
            transition: transform 0.08s cubic-bezier(0.25, 1, 0.5, 1), filter 0.1s ease-out;
            -webkit-tap-highlight-color: transparent;
        }
        
        /* Hitbox 扩充 (至少 44x44) */
        .premium-gameplay-btn::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            min-width: 44px;
            min-height: 44px;
            width: 100%;
            height: 100%;
            z-index: 10;
        }

        /* 零延迟按压反馈 (由 JS data 驱动) */
        .premium-gameplay-btn[data-active="true"] {
            transform: scale(0.92) !important;
            filter: brightness(1.2) !important;
        }

        /* 高级共鸣涟漪 (玻璃态/滤色发光贴图) */
        .premium-ripple {
            position: absolute;
            width: 128px;
            height: 128px;
            background-image: url('assets/generated/ui_resonance_ring.png');
            background-size: cover;
            background-position: center;
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 1;
            pointer-events: none;
            mix-blend-mode: screen; /* 滤色叠加产生发光感 */
            animation: playPremiumRipple 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            z-index: 999;
        }

        @keyframes playPremiumRipple {
            0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.9; filter: blur(0px); }
            100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; filter: blur(4px); }
        }
    `;
    document.head.appendChild(style);

    // 等待 Howler 和基础 DOM 加载
    const initEngine = () => {


        // 挑选目标按钮：主菜单、快捷操作、返回按钮
        const targetSelectors = [
            '.menu-button',
            '.quick-action-button',
            '.team-secondary-button',
            '.team-confirm-button',
            '.entry-archive-card',
            '.entry-gallery-card',
            '.conductor-option'
        ];

        // 为这些按钮添加基类并解除子元素 pointer 干扰
        const bindButtons = () => {
            const buttons = document.querySelectorAll(targetSelectors.join(', '));
            buttons.forEach(btn => {
                if (!btn.classList.contains('premium-gameplay-btn')) {
                    btn.classList.add('premium-gameplay-btn');
                    btn.style.overflow = 'visible'; // 确保涟漪不被裁切
                    Array.from(btn.children).forEach(child => child.style.pointerEvents = 'none');
                }
            });
        };
        bindButtons();

        // 使用 MutationObserver 监听动态生成的 DOM (如 React 或组件) 并绑定
        const observer = new MutationObserver(bindButtons);
        observer.observe(document.body, { childList: true, subtree: true });

        let activeElement = null;

        // 零延迟事件拦截总线
        document.addEventListener('pointerdown', (e) => {
            const btn = e.target.closest('.premium-gameplay-btn');
            if (!btn || btn.disabled) return;

            activeElement = btn;
            
            // 1. 瞬间缩放
            btn.setAttribute('data-active', 'true');



            // 3. 生成滤色发光涟漪
            const rect = btn.getBoundingClientRect();
            const rippleX = e.clientX - rect.left;
            const rippleY = e.clientY - rect.top;

            const ripple = document.createElement('div');
            ripple.className = 'premium-ripple';
            ripple.style.left = rippleX + 'px';
            ripple.style.top = rippleY + 'px';
            
            btn.appendChild(ripple);

            // 清理涟漪 DOM 避免内存泄漏
            setTimeout(() => {
                if (ripple.parentNode) ripple.remove();
            }, 600);

            // 4. 移动端震感引擎 (触觉反馈)
            if (navigator.vibrate) navigator.vibrate(15);
        }, { passive: true });

        const handleUp = (e) => {
            if (activeElement) {
                activeElement.removeAttribute('data-active');
                activeElement = null;
            }
        };

        document.addEventListener('pointerup', handleUp);
        document.addEventListener('pointercancel', handleUp);
        
        // Narrative Toast Fallback
        window.showNarrativeToast = function(msg) {
            let toastArea = document.getElementById('toast-area');
            if (!toastArea) {
                toastArea = document.createElement('div');
                toastArea.id = 'toast-area';
                toastArea.style.position = 'fixed';
                toastArea.style.bottom = '80px';
                toastArea.style.left = '50%';
                toastArea.style.transform = 'translateX(-50%)';
                toastArea.style.zIndex = '9999';
                document.body.appendChild(toastArea);
            }
            const t = document.createElement('div');
            t.className = 'toast-message';
            t.style.background = 'rgba(20,20,20,0.95)';
            t.style.color = '#e8e0cc';
            t.style.padding = '12px 20px';
            t.style.border = '1px solid rgba(212, 175, 55, 0.4)';
            t.style.marginBottom = '10px';
            t.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
            t.innerText = msg;
            toastArea.appendChild(t);
            setTimeout(() => {
                t.style.opacity = '0';
                t.style.transition = 'opacity 0.5s';
                setTimeout(() => t.remove(), 500);
            }, 3000);
        };

        const attachNarrativeBtn = (id, msg) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => {
                    if (window.showToast) window.showToast(msg);
                    else window.showNarrativeToast(msg);
                });
            }
        };

        attachNarrativeBtn('quick-caravan-button', '“引擎尚未预热。你需要先修理好传动轴，才能整理车厢内的粮药和调音工具。”');
        attachNarrativeBtn('quick-log-button', '“那些残破的曲谱碎片散落一地，现在还无法拼凑出完整的旋律。”');
        attachNarrativeBtn('quick-comms-button', '“【白谱院】通讯频段被高浓度失谐波段干扰，暂无法解析信号。”');

        console.log("🎻 Premium Musical UI Interaction Engine Loaded.");
    };

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initEngine);
    } else {
        initEngine();
    }
})();
