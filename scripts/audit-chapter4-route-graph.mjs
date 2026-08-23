import fs from 'node:fs';

const game = fs.readFileSync('game.js', 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const scenesStart = game.indexOf('const SCENES = {');
const battlesStart = game.indexOf('const BATTLES = {');
assert(scenesStart >= 0, 'SCENES object must exist');
assert(battlesStart > scenesStart, 'BATTLES object must appear after SCENES');

if (failures.length === 0) {
  const scenesSource = game.slice(scenesStart, battlesStart);
  const sceneHeaderPattern = /^  \"([^\"]+)\": \{/gm;
  const headers = [...scenesSource.matchAll(sceneHeaderPattern)].map((match) => ({
    id: match[1],
    index: match.index ?? 0,
  }));
  const sceneIds = new Set(headers.map((header) => header.id));
  const graph = new Map();

  for (let index = 0; index < headers.length; index += 1) {
    const header = headers[index];
    const end = headers[index + 1]?.index ?? scenesSource.length;
    const body = scenesSource.slice(header.index, end);
    const nextScenes = [...body.matchAll(/nextScene:\s*\"([^\"]+)\"/g)].map((match) => match[1]);
    graph.set(header.id, new Set(nextScenes));

    for (const target of nextScenes) {
      assert(sceneIds.has(target), `Scene ${header.id} points to missing nextScene ${target}`);
    }
  }

  const requiredCoreScenes = [
    'chapter4_start',
    ...Array.from({ length: 19 }, (_, index) => `ch4_${String(index).padStart(3, '0')}`),
  ];
  for (const sceneId of requiredCoreScenes) {
    assert(sceneIds.has(sceneId), `Required chapter-4 scene is missing: ${sceneId}`);
  }

  const battlesSource = game.slice(battlesStart);
  const battleEdges = [
    { from: 'ch4_006', battleId: 'ch4_qilan_duo', to: 'ch4_008' },
    { from: 'ch4_010', battleId: 'ch4_seluomi_final', to: 'ch4_011' },
    { from: 'ch4_014', battleId: 'ch4_charon_final', to: 'ch4_015' },
  ];

  for (const edge of battleEdges) {
    assert(
      scenesSource.includes(`startBattle(\"${edge.battleId}\"`),
      `${edge.from} must still start battle ${edge.battleId}`,
    );
    const battleStart = battlesSource.indexOf(`\"${edge.battleId}\"`);
    assert(battleStart >= 0, `Battle definition ${edge.battleId} must exist`);
    if (battleStart >= 0) {
      const battleBody = battlesSource.slice(battleStart, battleStart + 14000);
      assert(
        battleBody.includes(`showScene(\"${edge.to}\")`),
        `${edge.battleId} must still return to ${edge.to}`,
      );
    }
    graph.get(edge.from)?.add(edge.to);
  }

  const requiredEdges = [
    ['chapter4_start', 'ch4_000'],
    ['ch4_000', 'ch4_001'],
    ['ch4_001', 'ch4_002'],
    ['ch4_002', 'ch4_003'],
    ['ch4_003', 'ch4_004'],
    ['ch4_004', 'ch4_005'],
    ['ch4_005', 'ch4_006'],
    ['ch4_006', 'ch4_007'],
    ['ch4_006', 'ch4_008'],
    ['ch4_007', 'ch4_008'],
    ['ch4_008', 'ch4_009'],
    ['ch4_009', 'ch4_010'],
    ['ch4_010', 'ch4_011'],
    ['ch4_011', 'ch4_012'],
    ['ch4_012', 'ch4_013'],
    ['ch4_013', 'ch4_014'],
    ['ch4_014', 'ch4_015'],
    ['ch4_015', 'ch4_016'],
    ['ch4_016', 'ch4_017'],
    ['ch4_017', 'ch4_018'],
    ['ch4_018', 'chapter4_start'],
  ];

  for (const [from, to] of requiredEdges) {
    assert(
      graph.get(from)?.has(to),
      `Canonical chapter-4 edge must remain intact: ${from} -> ${to}`,
    );
  }

  const reachable = new Set();
  const queue = ['chapter4_start'];
  while (queue.length > 0) {
    const sceneId = queue.shift();
    if (!sceneId || reachable.has(sceneId)) continue;
    reachable.add(sceneId);
    for (const target of graph.get(sceneId) ?? []) {
      if (!reachable.has(target)) queue.push(target);
    }
  }

  for (const sceneId of requiredCoreScenes) {
    assert(
      reachable.has(sceneId),
      `Core chapter-4 scene is unreachable from chapter4_start: ${sceneId}`,
    );
  }

  assert(
    scenesSource.includes('value: \"chapter4_mainline_complete\"') &&
      scenesSource.includes('value: \"chapter4_complete\"'),
    'Chapter 4 must retain both mainline-complete and chapter-complete events',
  );
  assert(
    reachable.has('ch4_018'),
    'Chapter 4 must retain a complete forward route to ch4_018',
  );
}

if (failures.length) {
  console.error('Chapter 4 route graph audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 4 route graph audit passed.');
