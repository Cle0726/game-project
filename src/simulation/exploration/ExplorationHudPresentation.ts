import { Container, Graphics, Text } from 'pixi.js';

export class ExplorationHudPresentation {
  readonly prompt = new Text({
    text: '',
    style: {
      fill: 0xffffff,
      fontSize: 18,
      fontFamily: 'sans-serif',
      stroke: { color: 0x020617, width: 5 },
    },
  });

  readonly status = new Text({
    text: '',
    style: {
      fill: 0xe7edf7,
      fontSize: 15,
      fontFamily: 'sans-serif',
      stroke: { color: 0x020617, width: 4 },
    },
  });

  readonly clockText = new Text({
    text: '',
    style: { fill: 0xd7e1ef, fontSize: 14, fontFamily: 'sans-serif' },
  });

  readonly questTitle = new Text({
    text: '',
    style: { fill: 0xf3e4b3, fontSize: 18, fontWeight: '600', fontFamily: 'sans-serif' },
  });

  readonly questDescription = new Text({
    text: '',
    style: {
      fill: 0xe2e8f0,
      fontSize: 14,
      fontFamily: 'sans-serif',
      wordWrap: true,
      wordWrapWidth: 340,
    },
  });

  readonly clockPanel = new Graphics()
    .roundRect(0, 0, 190, 42, 10)
    .fill({ color: 0x08111f, alpha: 0.66 })
    .stroke({ width: 1, color: 0x9fb7d5, alpha: 0.35 });

  readonly controlsText = new Text({
    text: 'WASD / 方向键 移动   ·   E / 空格 交互   ·   ESC 返回',
    style: {
      fill: 0xf1f5f9,
      fontSize: 14,
      fontFamily: 'sans-serif',
      stroke: { color: 0x020617, width: 4 },
    },
  });

  constructor(stage: Container, regionName: string) {
    const questPanel = new Graphics()
      .roundRect(16, 16, 390, 136, 12)
      .fill({ color: 0x08111f, alpha: 0.72 })
      .stroke({ width: 1, color: 0xd7c28d, alpha: 0.5 });
    stage.addChild(questPanel);

    const title = new Text({
      text: regionName,
      style: {
        fill: 0xffffff,
        fontSize: 21,
        fontWeight: '600',
        fontFamily: 'sans-serif',
      },
    });
    title.position.set(30, 27);
    stage.addChild(title);

    this.questTitle.position.set(30, 62);
    this.questDescription.position.set(30, 91);
    stage.addChild(this.questTitle, this.questDescription);

    this.clockText.anchor.set(0.5, 0.5);
    this.controlsText.anchor.set(0.5, 1);
    this.prompt.anchor.set(0.5, 1);
    this.status.position.set(30, 164);

    stage.addChild(
      this.clockPanel,
      this.clockText,
      this.controlsText,
      this.prompt,
      this.status,
    );
  }

  setQuest(title: string, description: string): void {
    this.questTitle.text = title;
    this.questDescription.text = description;
  }

  setPrompt(text: string): void {
    this.prompt.text = text;
  }
}
