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
  const sceneHeaderPattern = /^  "([^"]+)": \{/gm;
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
    const nextScenes = [...body.matchAll(/nextScene:\s*"([^"]+)"/g)].map((match) => match[1]);
    graph.set(header.id, new Set(nextScenes));

    for (const target of nextScenes) {
      assert(
        sceneIds.has(target),
        `Scene ${header.id} points to missing nextScene ${target}`,
      );
    }
  }

  const requiredCoreScenes = [
    'chapter1_start',
    'ch1_black_000',
    'ch1_black_001',
    'ch1_black_002',
    'ch1_minigame_intel_trade',
    'ch1_black_003',
    'ch1_black_004',
    'ch1_minigame_track_ruts',
    'ch1_minigame_cipher',
    'ch1_black_005',
    'ch1_black_006',
    'ch1_minigame_ensemble',
    'ch1_black_007',
    'ch1_black_008',
    'ch1_black_009',
    'ch1_minigame_escort_yuna',
    'ch1_black_012',
    'ch1_black_010_a',
    'ch1_black_010_b',
    'ch1_black_010_c',
    'ch1_black_013',
    'ch1_side_atya_dinner',
    'ch1_side_milo_score',
    'ch1_side_anning_intel',
    'ch1_side_yuna_name',
    'ch1_black_014',
    'chapter2_start',
  ];

  for (const sceneId of requiredCoreScenes) {
    assert(sceneIds.has(sceneId), `Required chapter-1 scene is missing: ${sceneId}`);
  }

  const battlesSource = game.slice(battlesStart);

  // Optional fog patrol still resolves into the same Platform-7 confrontation.
  assert(
    scenesSource.includes('startBattle("ch1_fog_patrol"'),
    'ch1_black_004 must still be able to start ch1_fog_patrol',
  );
  assert(
    battlesSource.includes('showScene("ch1_black_005")'),
    'ch1_fog_patrol must still return to ch1_black_005',
  );

  // Sequence-04 is a hard battle boundary: every authored result returns to the
  // investigation scene, which exploration may wrap but never replace.
  assert(
    scenesSource.includes('startBattle("ch1_silent_sequence_04"'),
    'ch1_black_005 must still start ch1_silent_sequence_04',
  );
  assert(
    battlesSource.includes('showScene("ch1_black_006")'),
    'ch1_silent_sequence_04 must still return to ch1_black_006',
  );
  graph.get('ch1_black_005')?.add('ch1_black_006');

  // Seluomi's authored boss outcome can resolve into any of the three ending scenes.
  assert(
    scenesSource.includes('startBattle("ch1_seluomi_trial"'),
    'ch1_black_012 must still start ch1_seluomi_trial',
  );
  for (const outcome of ['ch1_black_010_a', 'ch1_black_010_b', 'ch1_black_010_c']) {
    assert(
      battlesSource.includes(`showScene("${outcome}")`),
      `ch1_seluomi_trial must preserve authored outcome ${outcome}`,
    );
    graph.get('ch1_black_012')?.add(outcome);
  }

  const reachable = new Set();
  const queue = ['chapter1_start'];
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
      `Core chapter-1 scene is unreachable from chapter1_start: ${sceneId}`,
    );
  }

  assert(
    reachable.has('ch1_black_014'),
    'Chapter 1 must retain a forward path from chapter1_start to ch1_black_014',
  );
  assert(
    reachable.has('chapter2_start'),
    'Chapter 1 broadcast choices must retain a path into chapter2_start',
  );

  const requiredEdges = [
    ['chapter1_start', 'ch1_black_000'],
    ['ch1_black_000', 'ch1_black_001'],
    ['ch1_black_001', 'ch1_black_002'],
    ['ch1_black_002', 'ch1_minigame_intel_trade'],
    ['ch1_black_002', 'ch1_black_003'],
    ['ch1_minigame_intel_trade', 'ch1_black_003'],
    ['ch1_black_003', 'ch1_black_004'],
    ['ch1_black_004', 'ch1_minigame_track_ruts'],
    ['ch1_black_004', 'ch1_minigame_cipher'],
    ['ch1_black_004', 'ch1_black_005'],
    ['ch1_minigame_track_ruts', 'ch1_black_005'],
    ['ch1_minigame_cipher', 'ch1_black_005'],
    ['ch1_black_006', 'ch1_black_007'],
    ['ch1_black_006', 'ch1_minigame_ensemble'],
    ['ch1_minigame_ensemble', 'ch1_black_007'],
    ['ch1_black_007', 'ch1_black_008'],
    ['ch1_black_008', 'ch1_black_009'],
    ['ch1_black_008', 'ch1_black_012'],
    ['ch1_black_009', 'ch1_minigame_escort_yuna'],
    ['ch1_black_009', 'ch1_black_012'],
    ['ch1_minigame_escort_yuna', 'ch1_black_012'],
    ['ch1_black_010_a', 'ch1_black_013'],
    ['ch1_black_010_b', 'ch1_black_013'],
    ['ch1_black_010_c', 'ch1_black_013'],
    ['ch1_side_atya_dinner', 'ch1_black_013'],
    ['ch1_side_milo_score', 'ch1_black_013'],
    ['ch1_side_anning_intel', 'ch1_black_013'],
    ['ch1_side_yuna_name', 'ch1_black_013'],
    ['ch1_black_013', 'ch1_black_014'],
    ['ch1_black_014', 'chapter1_start'],
    ['ch1_black_014', 'chapter2_start'],
  ];

  for (const [from, to] of requiredEdges) {
    assert(
      graph.get(from)?.has(to),
      `Canonical chapter-1 edge must remain intact: ${from} -> ${to}`,
    );
  }
}

if (failures.length) {
  console.error('Chapter 1 route graph audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 1 route graph audit passed.');
