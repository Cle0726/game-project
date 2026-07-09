class ConductorAudio {
    constructor() {
        this.bgmHowl = null;
        this.currentBGM = null;
        
        // Audio paths (placeholders for when actual assets are generated)
        this.assets = {
            bgm: {
                'main_menu': 'assets/audio/bgm01_main.mp3',
                'tea_break': 'assets/audio/bgm02_tea.mp3',
                'explore': 'assets/audio/bgm03_explore.mp3',
                'battle_normal': 'assets/audio/bgm04_battle.mp3',
                'battle_boss': 'assets/audio/bgm05_boss.mp3',
                'victory': 'assets/audio/bgm06_victory.mp3',
                'defeat': 'assets/audio/bgm06_defeat.mp3'
            },
            sfx: {
                'hover': 'assets/audio/sfx01_hover.mp3',
                'click': 'assets/audio/sfx01_click.mp3',
                'positive': 'assets/audio/sfx02_positive.mp3',
                'negative': 'assets/audio/sfx02_negative.mp3',
                'transition': 'assets/audio/sfx03_transition.mp3',
                'solo': 'assets/audio/sfx04_solo.mp3',
                'dysregulation': 'assets/audio/sfx05_dysregulation.mp3',
                'skill_huaixu': 'assets/audio/sfx_skill_huaixu.mp3',
                'skill_luowen': 'assets/audio/sfx_skill_luowen.mp3',
                'skill_yifubai': 'assets/audio/sfx_skill_yifubai.mp3',
                'skill_mingxian': 'assets/audio/sfx_skill_mingxian.mp3'
            }
        };

        this.initialized = false;
        this.dysregulationActive = false;
    }

    async init() {
        if (this.initialized) return;
        
        // Wait for user interaction before starting AudioContext (browser policy)
        if (typeof Tone !== 'undefined') {
            await Tone.start();
            
            // Set up Tone.js effects chain for Dysregulation
            this.pitchShift = new Tone.PitchShift().toDestination();
            this.distortion = new Tone.Distortion(0.3).connect(this.pitchShift); // Reduced from 0.8
            this.delay = new Tone.FeedbackDelay("8n", 0.3).connect(this.pitchShift);
            this.vibrato = new Tone.Vibrato(5, 0.1).connect(this.delay);
            
            // A procedural dissonant synth for "Dysregulation"
            this.dissonantSynth = new Tone.PolySynth(Tone.Synth).connect(this.vibrato);
            this.dissonantSynth.set({
                oscillator: { type: "triangle" }, // Changed from sawtooth to triangle for softer tone
                envelope: { attack: 0.1, decay: 0.2, sustain: 0.3, release: 1.5 }
            });
        }
        
        this.initialized = true;
        console.log("🎵 Audio Manager Initialized: Platinum Opera & Dysregulation Ready.");
    }

    playBGM(trackName) {
        if (!this.assets.bgm[trackName]) return;
        
        if (this.currentBGM === trackName && this.bgmHowl && this.bgmHowl.playing()) return;

        if (this.bgmHowl) {
            this.bgmHowl.fade(0.5, 0, 1000);
            setTimeout(() => {
                this.bgmHowl.stop();
                this._startNewBGM(trackName);
            }, 1000);
        } else {
            this._startNewBGM(trackName);
        }
    }

    _startNewBGM(trackName) {
        this.currentBGM = trackName;
        // Check if Howl is available
        if (typeof Howl !== 'undefined') {
            this.bgmHowl = new Howl({
                src: [this.assets.bgm[trackName]],
                loop: true,
                volume: 0,
                html5: true // Good for large BGM files
            });
            // Handle load errors gracefully since files don't exist yet
            this.bgmHowl.on('loaderror', () => {
                console.warn(`[AudioManager] Missing audio file for BGM: ${trackName}`);
            });
            this.bgmHowl.play();
            this.bgmHowl.fade(0, 0.5, 1000); // Fade in to 50% volume
        } else {
            console.warn(`[AudioManager] Howler.js not loaded, skipping BGM: ${trackName}`);
        }
    }

    playSFX(type) {
        if (!this.assets.sfx[type]) return;
        
        if (typeof Howl !== 'undefined') {
            const sound = new Howl({
                src: [this.assets.sfx[type]],
                volume: 0.8
            });
            sound.on('loaderror', () => {
                 // Suppress warning spam for missing SFX files, since this is early prototype
            });
            sound.play();
        }
    }

    playMusicartSkill(chineseName) {
        const nameMap = {
            '槐序': 'huaixu',
            '洛温': 'luowen',
            '伊芙白': 'yifubai',
            '明弦': 'mingxian'
        };
        const pinyin = nameMap[chineseName];
        if(pinyin) {
            this.playSFX('skill_' + pinyin);
        } else {
            // Default fallback
            this.playSFX('click');
        }
    }

    
    // Triggered when a Musicart dysregulates (Three-layer design)
    triggerDysregulation(musicartName = 'unknown', severity = 'normal') {
        console.log(`[AudioManager] 🌪️ Triggering Dysregulation Audio Effect! Character: ${musicartName}`);
        
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
                    this.dissonantSynth.triggerAttackRelease(["C#2", "G2"], "16n", time, 0.4); // Reduced volume from 1.5 to 0.4
                    
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

}

// Attach to window so game.js can use it
window.AudioManager = new ConductorAudio();
