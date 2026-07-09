/**
 * 高级响应式状态栏 (Reactive HUD)
 * 特性：Proxy 数据劫持、按需 O(1) 渲染、60fps 数值滚动、平滑插值(Lerp)进度条
 */

(function initReactiveHUD() {
    // 注入平滑过渡的 CSS
    const style = document.createElement('style');
    style.textContent = `
        /* 进度条硬件加速缓动 */
        .status-meter span {
            display: block;
            height: 100%;
            background-color: currentColor;
            transform-origin: left center;
            will-change: transform;
            transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        
        /* 危险状态的跳动警告动画 */
        @keyframes pulseDanger {
            0% { filter: drop-shadow(0 0 2px rgba(255,0,0,0.5)); }
            50% { filter: drop-shadow(0 0 8px rgba(255,0,0,0.8)); transform: scale(1.05); }
            100% { filter: drop-shadow(0 0 2px rgba(255,0,0,0.5)); }
        }
        .status-danger-pulse .status-icon {
            animation: pulseDanger 1s infinite ease-in-out;
            color: #ff4444;
        }
    `;
    document.head.appendChild(style);

    // DOM 映射缓存
    const uiMap = {
        stability: { valueEl: 'stability-value', meterEl: 'stability-meter', containerEl: 'status-item[data-status-key="stability"]', max: 100, dangerWhen: 'low', dangerThreshold: 20 },
        discord:   { valueEl: 'discord-value',   meterEl: 'discord-meter',   containerEl: 'status-item[data-status-key="discord"]',   max: 100, dangerWhen: 'high', dangerThreshold: 80 },
        supply:    { valueEl: 'supply-value',    meterEl: 'supply-meter',    containerEl: 'status-item[data-status-key="supply"]',    max: 20,  dangerWhen: 'low', dangerThreshold: 5 },
        core:      { valueEl: 'core-value',      meterEl: 'core-meter',      containerEl: 'status-item[data-status-key="core"]',      max: 10,  dangerWhen: 'low', dangerThreshold: 2 },
        health:    { valueEl: 'health-value',    meterEl: 'health-meter',    containerEl: 'status-item[data-status-key="health"]',    max: 100, dangerWhen: 'low', dangerThreshold: 30 }
    };

    // 数值跳动动画 (Lerp Number)
    function animateValue(obj, start, end, duration) {
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end;
            }
        };
        window.requestAnimationFrame(step);
    }

    // 内部数据层
    const internalData = {
        stability: 100,
        discord: 0,
        supply: 20,
        core: 10,
        health: 100
    };

    // 核心：基于 Proxy 的响应式拦截
    const hudProxy = new Proxy(internalData, {
        set(target, property, value) {
            // 类型检查与旧值比对
            const newValue = Math.max(0, Number(value)); 
            if (target[property] === newValue) return true;
            
            const oldValue = target[property];
            target[property] = newValue;

            // 触发定向 UI 更新
            const mapping = uiMap[property];
            if (mapping) {
                const valueEl = document.getElementById(mapping.valueEl);
                const meterEl = document.getElementById(mapping.meterEl);
                const containerEl = document.querySelector(\`.\${mapping.containerEl}\`) || 
                                    document.querySelector(\`[data-status-key="\${property}"]\`);

                // 1. 动态数字缓动
                if (valueEl) {
                    animateValue(valueEl, oldValue, newValue, 600); // 600ms 平滑跳字
                }

                // 2. 进度条缓动 (使用 scaleX 而非 width 避免重排)
                if (meterEl) {
                    const ratio = Math.min(1, Math.max(0, newValue / mapping.max));
                    meterEl.style.transform = \`scaleX(\${ratio})\`;
                }

                // 3. 危险状态阈值处理 (呼吸红光预警)
                if (containerEl) {
                    let isDanger = false;
                    if (mapping.dangerWhen === 'low' && newValue <= mapping.dangerThreshold) isDanger = true;
                    if (mapping.dangerWhen === 'high' && newValue >= mapping.dangerThreshold) isDanger = true;
                    
                    if (isDanger) {
                        containerEl.classList.add('status-danger-pulse');
                    } else {
                        containerEl.classList.remove('status-danger-pulse');
                    }
                }
            }
            return true; // 设值成功
        }
    });

    // 暴露为全局对象
    window.ReactiveHUD = {
        state: hudProxy,
        // 提供一个初始化方法同步 game.js 初始状态
        syncFromGameState(gameState) {
            if(!gameState) return;
            this.state.stability = gameState.城邦稳定度 ?? 100;
            this.state.discord = gameState.世界失谐度 ?? 0;
            this.state.supply = gameState.粮药 ?? 20;
            this.state.core = gameState.音芯 ?? 10;
            this.state.health = gameState.奏者健康 ?? 100;
        }
    };

    console.log("⚡ Reactive HUD Engine Loaded.");
})();
