import React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BattleScreen, dispatchBattleSkillToGame, type BattleScreenState } from './battle';

const demoState: BattleScreenState = {
  id: 'battle-demo-broken-beat',
  phase: 'entering',
  enemy: {
    id: 'broken-beat-beast',
    name: '断拍兽',
    statusText: '瓷质胸腔里露出错位的金色齿轮，正在寻找下一处节拍缺口。',
    intentText: '下一拍将压向结界薄弱处',
    hpPercent: 64,
    imageSrc: '/assets/battle/enemies/broken_beat_beast_idle.png',
    visualState: 'idle',
  },
  resources: {
    objectiveLabel: '结界稳定',
    objectivePercent: 58,
    conductorHealthPercent: 72,
  },
  musicarts: [
    {
      id: 'huaixu',
      name: '槐序',
      characterId: 'huaixu',
      role: '旋律 / 破拍',
      fallbackImageSrc: '/assets/battle/characters/huaixu_battle_fallback.png',
      hpPercent: 84,
    },
    {
      id: 'luowen',
      name: '洛温',
      characterId: 'luowen',
      role: '和声 / 护阵',
      fallbackImageSrc: '/assets/battle/characters/luowen_battle_fallback.png',
      hpPercent: 91,
    },
  ],
  activeMusicartId: 'huaixu',
  log: [
    { id: 'round-1', tone: 'round', text: '第1轮开始。敌方节拍出现半拍偏移。' },
    { id: 'action-1', tone: 'result', text: '槐序切入三拍弱点，敌人动作被迫延后。' },
    { id: 'cost-1', tone: 'cost', text: '奏者健康 -4，结界稳定 +8。' },
  ],
  skills: [
    {
      id: 'triple-step',
      label: '回身三拍',
      iconLabel: '旋',
      actionPointCost: 1,
      healthCost: 4,
      detail: '标记敌方冲锋轨迹，下轮行动延后。',
    },
    {
      id: 'low-shield',
      label: '沉降低音',
      iconLabel: '和',
      actionPointCost: 1,
      healthCost: 5,
      detail: '形成低音护盾，本轮保护目标。',
    },
    {
      id: 'half-beat',
      label: '半拍游移',
      iconLabel: '节',
      actionPointCost: 0,
      healthCost: 5,
      detail: '预判下一次振翅轨迹，降低结界风险。',
    },
    {
      id: 'forced-silence',
      label: '强制封印',
      iconLabel: '默',
      actionPointCost: 2,
      healthCost: 12,
      danger: true,
      detail: '高代价切断敌方行动，立即压制当前攻势。',
    },
  ],
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BattleDemo />
  </React.StrictMode>,
);

function BattleDemo() {
  const [phase, setPhase] = useState<BattleScreenState['phase']>('entering');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setPhase('active'), 1600);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return <BattleScreen state={{ ...demoState, phase }} onSkill={dispatchBattleSkillToGame} />;
}
