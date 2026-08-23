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
    'chapter3_white_start',
    'ch3_white_000',
    'ch3_white_001',
    'ch3_white_002',
    'ch3_white_003',
    'ch3_white_004',
    'ch3_white_005',
    'ch3_white_006',
    'ch3_white_007',
    'ch3_minigame_hearing_statement',
    'ch3_white_008',
    'ch3_white_008_high',
    'ch3_white_008_mid',
    'ch3_white_008_low',
    'ch3_white_009',
    'ch3_white_011',
    'ch3_side_juheng_room',
    'ch3_white_012',
    'ch3_minigame_file_sorting',
    'ch3_white_013',
    'ch3_white_014',
    'ch3_side_atya_form',
    'ch3_side_milo_old_place',
    'ch3_side_anning_letter',
    'ch3_side_juheng_first_walk',
    'chapter4_start',
  ];

  for (const sceneId of requiredCoreScenes) {
    assert(sceneIds.has(sceneId), `Required chapter-3 scene is missing: ${sceneId}`);
  }

  const hearingResolutionStart = game.indexOf('function resolveCh3WhiteHearing()');
  assert(hearingResolutionStart >= 0, 'resolveCh3WhiteHearing() must exist');
  if (hearingResolutionStart >= 0) {
    const hearingResolution = game.slice(hearingResolutionStart, hearingResolutionStart + 3000);
    for (const outcome of ['ch3_white_008_high', 'ch3_white_008_mid', 'ch3_white_008_low']) {
      assert(
        hearingResolution.includes(`showScene(\"${outcome}\")`),
        `resolveCh3WhiteHearing() must preserve ${outcome}`,
      );
      graph.get('ch3_white_008')?.add(outcome);
    }
  }

  const battlesSource = game.slice(battlesStart);
  assert(
    scenesSource.includes('startBattle(\"ch3_juheng_inspector\"'),
    'Low-hearing route must still start ch3_juheng_inspector',
  );
  const juhengBattleStart = battlesSource.indexOf('\"ch3_juheng_inspector\"');
  assert(juhengBattleStart >= 0, 'ch3_juheng_inspector battle definition must exist');
  if (juhengBattleStart >= 0) {
    const juhengBattle = battlesSource.slice(juhengBattleStart, juhengBattleStart + 9000);
    assert(
      juhengBattle.includes('showScene(\"ch3_white_011\")'),
      'ch3_juheng_inspector must return to ch3_white_011',
    );
    graph.get('ch3_white_009')?.add('ch3_white_011');
  }

  const requiredEdges = [
    ['chapter3_white_start', 'ch3_white_000'],
    ['ch3_white_000', 'ch3_white_001'],
    ['ch3_white_001', 'ch3_white_002'],
    ['ch3_white_002', 'ch3_white_003'],
    ['ch3_white_003', 'ch3_white_004'],
    ['ch3_white_004', 'ch3_white_005'],
    ['ch3_white_005', 'ch3_white_006'],
    ['ch3_white_006', 'ch3_white_007'],
    ['ch3_white_007', 'ch3_minigame_hearing_statement'],
    ['ch3_white_007', 'ch3_white_008'],
    ['ch3_minigame_hearing_statement', 'ch3_white_008'],
    ['ch3_white_008_high', 'ch3_white_012'],
    ['ch3_white_008_mid', 'ch3_white_012'],
    ['ch3_white_008_low', 'ch3_white_009'],
    ['ch3_white_011', 'ch3_white_012'],
    ['ch3_white_011', 'ch3_side_juheng_room'],
    ['ch3_side_juheng_room', 'ch3_white_014'],
    ['ch3_white_012', 'ch3_minigame_file_sorting'],
    ['ch3_white_012', 'ch3_white_013'],
    ['ch3_minigame_file_sorting', 'ch3_white_012'],
    ['ch3_white_013', 'ch3_white_014'],
    ['ch3_white_014', 'ch3_side_atya_form'],
    ['ch3_white_014', 'ch3_side_milo_old_place'],
    ['ch3_white_014', 'ch3_side_anning_letter'],
    ['ch3_white_014', 'ch3_side_juheng_first_walk'],
    ['ch3_side_atya_form', 'ch3_white_014'],
    ['ch3_side_milo_old_place', 'ch3_white_014'],
    ['ch3_side_anning_letter', 'ch3_white_014'],
    ['ch3_side_juheng_first_walk', 'ch3_white_014'],
    ['ch3_white_014', 'chapter4_start'],
  ];

  for (const [from, to] of requiredEdges) {
    assert(
      graph.get(from)?.has(to),
      `Canonical chapter-3 edge must remain intact: ${from} -> ${to}`,
    );
  }

  const reachable = new Set();
  const queue = ['chapter3_white_start'];
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
      `Core chapter-3 scene is unreachable from chapter3_white_start: ${sceneId}`,
    );
  }

  assert(
    reachable.has('chapter4_start'),
    'Chapter 3 must retain a forward path from chapter3_white_start to chapter4_start',
  );
}

if (failures.length) {
  console.error('Chapter 3 route graph audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 3 route graph audit passed.');
