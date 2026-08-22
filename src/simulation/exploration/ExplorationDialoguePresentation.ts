import { Container, Graphics, Text } from 'pixi.js';
import type { ExplorationDialogueLine } from '../../exploration/explorationTypes';

export const EXPLORATION_DIALOGUE_PANEL_WIDTH = 760;
export const EXPLORATION_DIALOGUE_PANEL_HEIGHT = 128;

export class ExplorationDialoguePresentation {
  readonly panel = new Container();
  private readonly speaker = new Text({
    text: '',
    style: {
      fill: 0xf3e4b3,
      fontSize: 18,
      fontWeight: '700',
      fontFamily: 'sans-serif',
    },
  });
  private readonly body = new Text({
    text: '',
    style: {
      fill: 0xf8fafc,
      fontSize: 17,
      fontFamily: 'sans-serif',
      wordWrap: true,
      wordWrapWidth: 690,
      lineHeight: 25,
    },
  });
  private lines: ExplorationDialogueLine[] = [];
  private index = 0;
  private completion?: () => void;

  activeNpcId?: string;

  constructor(stage: Container) {
    const background = new Graphics()
      .roundRect(0, 0, EXPLORATION_DIALOGUE_PANEL_WIDTH, EXPLORATION_DIALOGUE_PANEL_HEIGHT, 14)
      .fill({ color: 0x08111f, alpha: 0.94 })
      .stroke({ width: 2, color: 0xd7c28d, alpha: 0.65 });

    this.speaker.position.set(24, 18);
    this.body.position.set(24, 48);

    const hint = new Text({
      text: 'E / 空格 继续',
      style: { fill: 0xbcc9d8, fontSize: 12, fontFamily: 'sans-serif' },
    });
    hint.anchor.set(1, 1);
    hint.position.set(
      EXPLORATION_DIALOGUE_PANEL_WIDTH - 20,
      EXPLORATION_DIALOGUE_PANEL_HEIGHT - 14,
    );

    this.panel.addChild(background, this.speaker, this.body, hint);
    this.panel.visible = false;
    stage.addChild(this.panel);
  }

  get active(): boolean {
    return this.lines.length > 0;
  }

  start(
    lines: readonly ExplorationDialogueLine[],
    npcId: string | undefined,
    onComplete?: () => void,
  ): boolean {
    if (!lines.length) return false;
    this.lines = lines.map((line) => ({ ...line }));
    this.index = 0;
    this.activeNpcId = npcId;
    this.completion = onComplete;
    this.panel.visible = true;
    this.renderCurrentLine();
    return true;
  }

  advance(): void {
    if (!this.active) return;
    if (this.index < this.lines.length - 1) {
      this.index += 1;
      this.renderCurrentLine();
      return;
    }
    this.finish(true);
  }

  finish(triggerComplete: boolean): void {
    const completion = this.completion;
    this.lines = [];
    this.index = 0;
    this.activeNpcId = undefined;
    this.completion = undefined;
    this.panel.visible = false;
    if (triggerComplete) completion?.();
  }

  setPosition(x: number, y: number): void {
    this.panel.position.set(x, y);
  }

  private renderCurrentLine(): void {
    const line = this.lines[this.index];
    if (!line) return;
    this.speaker.text = line.speaker;
    this.body.text = line.text;
  }
}
