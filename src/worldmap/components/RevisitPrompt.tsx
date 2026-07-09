import type { LocationNode, WorldRegion } from '../worldMapTypes';

export interface RevisitLine {
  speaker: string;
  text: string;
}

export interface RevisitPromptProps {
  node: LocationNode;
  region: WorldRegion;
  lines?: RevisitLine[];
  onConfirm: () => void;
  onCancel: () => void;
}

const REVISIT_LINES_BY_NODE_ID: Record<string, RevisitLine[]> = {
  chapter0_start: [
    { speaker: '阿缇娅', text: '禁曲未响的时候，我还没有学会把自己的名字说出口。' }
  ],
  chapter1_start: [
    { speaker: '安柠', text: '那半枚吊坠图案不是回忆，是一条还没断开的追踪线。' }
  ],
  ch1_black_002: [
    { speaker: '钟先生', text: '情报不会自己变干净，只会换一个更像生意的包装。' }
  ],
  ch1_black_004: [
    { speaker: '弥洛', text: '雾里有三组脚步。两组像人，一组不像。' }
  ],
  ch1_black_012: [
    { speaker: '阿缇娅', text: '再回到这里，也要先叫她的名字。不要让编号先响起来。' }
  ],
  ch1_black_014: [
    { speaker: '卡戎', text: '第三拍没有落下，不代表它不会回来。' }
  ],
  chapter3_archive_start: [
    { speaker: '系统', text: '这里是旧一至三章归档区，不再混入新第一章的章节入口。' }
  ]
};

function getDefaultRevisitLines(node: LocationNode, region: WorldRegion): RevisitLine[] {
  return [
    {
      speaker: region.name,
      text: `${node.name}留下的余音仍在，只是这一次，你们不必急着向前。`
    }
  ];
}

export function getRevisitLines(node: LocationNode, region: WorldRegion): RevisitLine[] {
  return REVISIT_LINES_BY_NODE_ID[node.id] ?? getDefaultRevisitLines(node, region);
}

export function RevisitPrompt({
  node,
  region,
  lines = getRevisitLines(node, region),
  onConfirm,
  onCancel
}: RevisitPromptProps) {
  return (
    <div className="revisit-prompt" role="dialog" aria-modal="false" aria-labelledby="revisit-prompt-title">
      <div className="revisit-prompt__panel">
        <p className="revisit-prompt__eyebrow">{region.name}</p>
        <h2 id="revisit-prompt-title">重新回到{node.name}</h2>
        <p className="revisit-prompt__body">
          这不是重放剧情，而是一段短暂的重访对话。走过的路也会留下新的余音。
        </p>

        <div className="revisit-prompt__lines">
          {lines.map((line, index) => (
            <blockquote key={`${line.speaker}-${index}`}>
              <strong>{line.speaker}</strong>
              <span>{line.text}</span>
            </blockquote>
          ))}
        </div>

        <div className="revisit-prompt__actions">
          <button className="worldmap-button" type="button" onClick={onConfirm}>
            <span className="worldmap-button__icon" aria-hidden="true">↺</span>
            进入重访
          </button>
          <button className="worldmap-button worldmap-button--quiet" type="button" onClick={onCancel}>
            <span className="worldmap-button__icon" aria-hidden="true">×</span>
            留在地图
          </button>
        </div>
      </div>
    </div>
  );
}
