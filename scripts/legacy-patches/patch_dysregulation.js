const fs = require('fs');

const path = 'audio_manager.js';
let content = fs.readFileSync(path, 'utf8');

// Also need to add Tone.Distortion in init()
content = content.replace(
    /this\.pitchShift = new Tone\.PitchShift\(\)\.toDestination\(\);/,
    `this.pitchShift = new Tone.PitchShift().toDestination();
            this.distortion = new Tone.Distortion(0.8).connect(this.pitchShift);`
);

const newMethod = `
    // Triggered when a Musicart dysregulates (Three-layer design)
    triggerDysregulation(musicartName = 'unknown', severity = 'normal') {
        console.log(\`[AudioManager] 🌪️ Triggering Dysregulation Audio Effect! Character: \${musicartName}\`);
        
        this.dysregulationActive = true;
        
        if (this.initialized && typeof Tone !== 'undefined') {
            try {
                const now = Tone.now();
                
                // 第一层：预警 (0s - 0.2s) - 整体降调，制造"不对劲"的错觉
                this.pitchShift.pitch = -4; // 下降4个半音
                if (this.bgmHowl) {
                    this.bgmHowl.rate(0.8); // 略微降速
                }
                
                // 第二层：夺权瞬间 (0.2s) - 故意抢拍的强音，带轻微失真
                setTimeout(() => {
                    const time = Tone.now();
                    // 用合成器打出一个带失真的、刺耳的短音 (抢拍感)
                    this.dissonantSynth.connect(this.distortion);
                    this.dissonantSynth.triggerAttackRelease(["C#2", "G2"], "16n", time, 1.5); // 很大声
                    
                    // 播放基础失调警告音 (如果有的话)
                    this.playSFX('dysregulation');
                }, 200); // 0.2s 延迟
                
                // 第三层：失控回响 (0.2s - 2.5s) - 扭曲版技能音效与不协和和声
                setTimeout(() => {
                    const time = Tone.now();
                    this.dissonantSynth.disconnect(this.distortion); // 移除强烈失真
                    this.dissonantSynth.connect(this.vibrato); // 回到正常效果链
                    
                    // 演奏该角色的"扭曲"和声 (小二度摩擦)
                    this.dissonantSynth.triggerAttackRelease(["D4", "Eb4", "A4"], "2n", time);
                    
                    // 播放该角色的技能音效，但在现在的降调/扭曲环境下
                    if (musicartName !== 'unknown') {
                        this.playMusicartSkill(musicartName);
                    }
                }, 300);

                // 结算完成，恢复正常
                setTimeout(() => {
                    this.pitchShift.pitch = 0;
                    if (this.bgmHowl) {
                        this.bgmHowl.rate(1.0);
                    }
                    this.dysregulationActive = false;
                }, 2500);
                
            } catch(e) {
                console.error("Tone.js error during dysregulation:", e);
            }
        } else {
            // Fallback for no Tone.js
            this.playSFX('dysregulation');
        }
        
        // Duck the BGM slightly
        if (this.bgmHowl) {
            this.bgmHowl.volume(0.1);
            setTimeout(() => {
                if (this.bgmHowl && !this.dysregulationActive) {
                    this.bgmHowl.fade(0.1, 0.5, 1000);
                }
            }, 2500);
        }
    }
`;

// Replace the old triggerDysregulation block
content = content.replace(/\/\/ Triggered when a Musicart dysregulates[\s\S]*?\}\n\}/, newMethod + '\n}');

fs.writeFileSync(path, content, 'utf8');
console.log('audio_manager.js patched with three-layered dysregulation.');
