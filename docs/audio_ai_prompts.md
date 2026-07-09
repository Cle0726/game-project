# 《宿命回响：残响之途》声音设计提示词库 (AI Audio Prompts)

本指南旨在为 AI 音频生成工具（如 Suno, Udio, AudioCraft, ElevenLabs SFX 等）提供精确的文本提示（Prompt），以符合“白金歌剧厅”的管弦乐美学及“失谐”听觉设计。

---

## 一、 背景音乐 (BGM) 提示词

所有的 BGM 必须保持古典管弦乐（Classical Orchestral）的底色，不含现代电子节拍或环境噪音（Drone）。

### BGM01: 主菜单 / 白金歌剧厅主题
**情绪方向**：华丽开场，明亮庄重，展现文明最后的辉煌。
**AI 提示词 (Prompt)**：
> `Classical orchestral music, bright and majestic opening theme, prominent harp glissandos, rich string sections playing a grand waltz. Platinum opera house acoustics, high fidelity, concert hall reverb, hopeful but elegant.`

### BGM02: 茶歇 / 生活日环境音
**情绪方向**：温暖午后沙龙感，慢速，让人卸下防备。
**AI 提示词 (Prompt)**：
> `Classical chamber music, gentle and warm afternoon salon atmosphere. Slow tempo waltz, featuring a soft acoustic piano accompanied by a delicate string quartet. Relaxing, elegant, intimate, high quality acoustic recording.`

### BGM03: 地图探索 / 长廊行进
**情绪方向**：中速行进感，拨奏为主，探索感。
**AI 提示词 (Prompt)**：
> `Classical orchestral music, moderate marching tempo (Andante). String section playing pizzicato (plucked strings) as the primary rhythmic drive, light woodwinds (flute and oboe) carrying a curious melody. Sense of exploration, elegant, non-tense.`

### BGM04: 普通战斗
**情绪方向**：有张力但依然优雅，拒绝重金属或现代打击乐。
**AI 提示词 (Prompt)**：
> `Dynamic classical orchestral music for a duel. Tense but elegant waltz. Fast string tremolos, staccato brass stabs (french horns), driving timpani rhythms. Epic, symphonic, dramatic, high fidelity concert hall sound.`

### BGM05: 首领战（无拍者 / 噬响体）
**情绪方向**："美丽的旋律正在腐坏"，管弦乐轻微走音、失谐和弦、幽灵般的人声。
**AI 提示词 (Prompt)**：
> `Dark classical orchestral waltz. A beautiful string melody that occasionally detunes and bends out of pitch. Dissonant brass chords, erratic tempo shifts. Haunting classical choir humming in the background. Unsettling, corrupted beauty, eerie concert hall acoustics.`

### BGM06: 结算音乐 (胜利 / 失败)
**胜利 AI 提示词**：
> `Short orchestral fanfare, triumphant and bright. Full symphony orchestra with prominent brass (trumpets) and a major chord resolution. 5 seconds long.`

**失败 AI 提示词**：
> `Short classical orchestral sting. A slow, unresolved diminished chord played by strings and cellos, fading out without a proper ending. Suspended, incomplete, lingering melancholic feeling. 5 seconds long.`

---

## 二、 交互音效 (UI SFX) 提示词

所有 UI 音效均使用真实的乐器短音（Stinger / One-shot）。

### SFX01: 按钮悬停 / 点击
**AI 提示词 (Prompt)**：
> `A single, light, crisp harp pluck, C major note, high quality acoustic sound, no background noise.` (悬停)
> `A bright, short glockenspiel (celesta) single note, high fidelity.` (点击)

### SFX02: 变量变化提示音
**AI 提示词 (Prompt)**：
> `Positive UI sound: A quick, bright ascending flute arpeggio, orchestral, clean.` (正面)
> `Negative UI sound: A slow, low-pitched descending cello glissando, orchestral, slightly ominous.` (负面)

### SFX03: 场景过渡
**AI 提示词 (Prompt)**：
> `Orchestral transition sound. A smooth, ascending string section sweep, like the drawing of heavy velvet theater curtains. Elegant, classical acoustic sound.`

### SFX04: 独演触发
**AI 提示词 (Prompt)**：
> `A powerful, sudden orchestral hit (tutti). All symphony instruments playing a sharp staccato chord, accompanied by a heavy timpani strike. Epic, dramatic, high impact, concert hall reverb.`

---

## 三、 失调音效专项设计 (SFX05: Dysregulation)

**设计核心**：“失调”是玩家指挥权被夺走那一刻的听觉体验。核心基调是"美的东西突然不对劲"，而非单纯的恐怖音效。必须保持"该律者的音乐语言"，只是被扭曲了。

系统将采用**三层叠加结构**来实现这一效果。在配置 AI 提示词时，我们主要针对**第三层（失控回响）**生成素材，第一、二层由 Tone.js 在引擎内程序化实时合成。

### 1. 第一层：预警（触发前 0.2 秒）- 由引擎实现
引擎内部通过 `Tone.PitchShift` 将当前音乐下移半音到一个全音之间，制造耳朵先于意识察觉到不对的听感。

### 2. 第二层：夺权瞬间 - 由引擎合成
引擎通过 `Tone.Distortion` 合成一个短促的、故意抢拍的强音，带轻微失真，制造"节奏被打乱"和"不干净"的听感。

### 3. 第三层：失控回响（素材生成目标）
此层级的音效是各律者专属技能音效的“扭曲版”。旋律轮廓不变，但和声换成不协和音程（如大三度变小二度）。

**律者失控回响 AI 提示词 (Prompt) 示例**：
- **槐序 (圆舞曲)**: `A short classical violin solo note combined with a harp glissando, but played with uncomfortable dissonance (minor seconds). An elegant waltz rhythm that sounds slightly corrupted and out of tune. Classical orchestral.`
- **洛温 (帕萨卡利亚)**: `A heavy, detuned cello pizzicato note. Sounds like a classical instrument being played with slightly too much force, creating a buzzing, dissonant string resonance. Unsettling but classical.`
- **伊芙白 (随想曲)**: `A frantic clarinet staccato note that sharpens awkwardly out of tune. Played off-beat with a dissonant classical string pluck in the background.`
- **明弦 (命运动机)**: `A heavy brass section hit (tutti french horns) played with a jarring, unresolved dissonant chord, accompanied by a delayed, out-of-sync timpani strike.`
---

## 四、 角色专属技能音效 (SFX: Musicart Skills)

这些音效用于每个角色的战斗行动（普通攻击/技能/独演）。必须符合其专属的音乐概念。

### 槐序 (Huaixu) - 圆舞曲
**AI 提示词 (Prompt)**：
> `A short, elegant classical violin solo note combined with a delicate harp glissando. Played with rubato (slight rhythmic flexibility). A short, spinning concert hall reverb to create a sense of turning and space. Bright, orchestral.`

### 洛温 (Luowen) - 帕萨卡利亚
**AI 提示词 (Prompt)**：
> `A heavy, resonant cello or double bass pizzicato (plucked string) note. Low pitched, thick texture, firmly anchoring the bassline. Concert hall acoustics, very short decay. Serious, grounded.`

### 伊芙白 (Yifubai) - 随想曲/即兴
**AI 提示词 (Prompt)**：
> `A short, playful clarinet staccato note accompanied by a light string pluck. Played slightly off-beat or slightly delayed. Capriccio style, whimsical, impromptu, high quality classical recording.`

### 明弦 (Mingxian) - 命运动机
**AI 提示词 (Prompt)**：
> `A dramatic, heavy brass section hit (tutti french horns and trombones) simultaneously with a massive timpani strike. Epic, forceful, classical orchestral stinger with 0.5 seconds of silence (rest) before the strike. Powerful concert hall resonance.`
