import { Assets, Container, Graphics, Sprite, Text } from 'pixi.js';
import type { ExplorationNpcDefinition } from '../../exploration/explorationTypes';

export interface LoadedActorView {
  node: Container;
  sprite?: Sprite;
  baseScale: number;
}

export interface LoadedNpcActorView extends LoadedActorView {
  activityText: Text;
}

export class ExplorationActorViewFactory {
  async createPlayer(spriteSrc: string | undefined, targetHeight = 165): Promise<LoadedActorView> {
    const node = new Container();
    node.addChild(
      new Graphics()
        .ellipse(0, 0, 34, 14)
        .fill({ color: 0x0b1220, alpha: 0.3 })
        .stroke({ width: 2, color: 0x9ed7ff, alpha: 0.7 }),
    );

    const loaded = await this.loadActorSprite(spriteSrc, targetHeight);
    if (loaded) {
      node.addChild(loaded.sprite);
      return { node, sprite: loaded.sprite, baseScale: loaded.baseScale };
    }

    node.addChild(new Graphics().circle(0, -24, 24).fill(0xe5e7eb));
    return { node, baseScale: 1 };
  }

  async createNpc(definition: ExplorationNpcDefinition, targetHeight = 155): Promise<LoadedNpcActorView> {
    const node = new Container();
    node.addChild(
      new Graphics().ellipse(0, 0, 30, 12).fill({ color: 0x0b1220, alpha: 0.25 }),
    );

    const loaded = await this.loadActorSprite(definition.spriteSrc, targetHeight);
    if (loaded) {
      node.addChild(loaded.sprite);
    } else {
      node.addChild(new Graphics().circle(0, -22, 24).fill(0x9fb7d5));
    }

    const label = new Text({
      text: definition.name,
      style: {
        fill: 0xffffff,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'sans-serif',
        stroke: { color: 0x111827, width: 4 },
      },
    });
    label.anchor.set(0.5, 1);
    label.position.set(0, -164);
    node.addChild(label);

    const activityText = new Text({
      text: '',
      style: {
        fill: 0xe5edf7,
        fontSize: 12,
        fontFamily: 'sans-serif',
        stroke: { color: 0x111827, width: 3 },
      },
    });
    activityText.anchor.set(0.5, 0);
    activityText.position.set(0, 8);
    node.addChild(activityText);

    return {
      node,
      activityText,
      sprite: loaded?.sprite,
      baseScale: loaded?.baseScale ?? 1,
    };
  }

  async loadActorSprite(
    src: string | undefined,
    targetHeight: number,
  ): Promise<{ sprite: Sprite; baseScale: number } | undefined> {
    if (!src) return undefined;

    try {
      const texture = await Assets.load(src);
      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5, 1);
      const textureHeight = Math.max(1, sprite.texture.height);
      const baseScale = targetHeight / textureHeight;
      sprite.scale.set(baseScale);
      return { sprite, baseScale };
    } catch (error) {
      console.warn('[exploration] actor sprite failed to load', src, error);
      return undefined;
    }
  }
}
