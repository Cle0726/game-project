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
      assert(sceneIds.has(target), `Scene ${header.id} points to missing nextScene ${target}`);
    }
  }

  const requiredCoreScenes = [
    'chapter2_start',
    'ch2_snow_000',
    'ch2_snow_001',
    'ch2_snow_002',
    'ch2_snow_003',
    'ch2_snow_004',
    'ch2_snow_005',
    'ch2_minigame_silent_step',
    'ch2_minigame_archive_puzzle',
    'ch2_snow_006',
    'ch2_snow_007',
    'ch2_snow_008',
    'ch2_snow_009',
    'ch2_snow_010',
    'ch2_snow_010_a',
    'ch2_snow_010_b',
    'ch2_snow_010_c',
    'ch2_snow_011',
    'ch2_minigame_echo_calibration',
    'ch2_snow_012',
    'ch2_snow_013',
    'ch2_snow_014',
    'ch2_side_atya_nameless',
    'ch2_side_milo_origin',
    'ch2_side_anning_father',
    'ch2_side_ningsu_camp',
    'ch2_minigame_frost_ensemble',
    'ch2_snow_015',
    'chapter3_archive_start',
    'chapter3_white_start',
  ];

  for (const sceneId of requiredCoreScenes) {
    assert(sceneIds.has(sceneId), `Required chapter-2 scene is missing: ${sceneId}`);
  }

  const battlesSource = game.slice(battlesStart);

  assert(
    scenesSource.includes('startBattle("ch2_scoreheart_guardian"'),
    'ch2_snow_007 must still start ch2_scoreheart_guardian',
  );
  assert(
    battlesSource.includes('showScene("ch2_snow_008")'),
    'ch2_scoreheart_guardian must still return to ch2_snow_008',
  );
  graph.get('ch2_snow_007')?.add('ch2_snow_008');

  assert(
    scenesSource.includes('startBattle("ch2_ningsu_guardian"'),
    'Ningsu forced route must still start ch2_ningsu_guardian',
  );
  assert(
    battlesSource.includes('showScene("ch2_snow_010_c")'),
    'ch2_ningsu_guardian must still resolve to ch2_snow_010_c',
  );
  graph.get('ch2_snow_009')?.add('ch2_snow_010_c');

  const resolutionSourceStart = game.indexOf('function resolveCh2NingsuStandoff()');
  assert(resolutionSourceStart >= 0, 'resolveCh2NingsuStandoff() must exist');
  if (resolutionSourceStart >= 0) {
    const resolutionSource = game.slice(resolutionSourceStart, resolutionSourceStart + 2500);
    for (const outcome of ['ch2_snow_010_a', 'ch2_snow_010_b', 'ch2_snow_010_c']) {
      assert(
        resolutionSource.includes(`showScene("${outcome}")`),
        `resolveCh2NingsuStandoff() must preserve ${outcome}`,
      );
      graph.get('ch2_snow_010')?.add(outcome);
    }
  }

  const requiredEdges = [
    ['chapter2_start', 'ch2_snow_000'],
    ['ch2_snow_000', 'ch2_snow_001'],
    ['ch2_snow_001', 'ch2_snow_002'],
    ['ch2_snow_002', 'ch2_snow_003'],
    ['ch2_snow_003', 'ch2_snow_004'],
    ['ch2_snow_004', 'ch2_snow_005'],
    ['ch2_snow_005', 'ch2_minigame_silent_step'],
    ['ch2_snow_005', 'ch2_minigame_archive_puzzle'],
    ['ch2_snow_005', 'ch2_snow_006'],
    ['ch2_minigame_silent_step', 'ch2_snow_006'],
    ['ch2_minigame_archive_puzzle', 'ch2_snow_006'],
    ['ch2_snow_006', 'ch2_snow_007'],
    ['ch2_snow_008', 'ch2_snow_009'],
    ['ch2_snow_009', 'ch2_snow_010'],
    ['ch2_snow_010_a', 'ch2_snow_011'],
    ['ch2_snow_010_b', 'ch2_snow_011'],
    ['ch2_snow_010_c', 'ch2_snow_011'],
    ['ch2_snow_011', 'ch2_minigame_echo_calibration'],
    ['ch2_snow_011', 'ch2_snow_012'],
    ['ch2_minigame_echo_calibration', 'ch2_snow_012'],
    ['ch2_snow_012', 'ch2_snow_013'],
    ['ch2_snow_013', 'ch2_snow_014'],
    ['ch2_snow_014', 'ch2_snow_015'],
    ['ch2_snow_014', 'ch2_side_atya_nameless'],
    ['ch2_snow_014', 'ch2_side_milo_origin'],
    ['ch2_snow_014', 'ch2_side_anning_father'],
    ['ch2_snow_014', 'ch2_side_ningsu_camp'],
    ['ch2_snow_014', 'ch2_minigame_frost_ensemble'],
    ['ch2_side_atya_nameless', 'ch2_snow_014'],
    ['ch2_side_milo_origin', 'ch2_snow_014'],
    ['ch2_side_anning_father', 'ch2_snow_014'],
    ['ch2_side_ningsu_camp', 'ch2_snow_014'],
    ['ch2_minigame_frost_ensemble', 'ch2_snow_014'],
    ['ch2_snow_015', 'chapter3_archive_start'],
    ['ch2_snow_015', 'chapter3_white_start'],
  ];

  for (const [from, to] of requiredEdges) {
    assert(
      graph.get(from)?.has(to),
      `Canonical chapter-2 edge must remain intact: ${from} -> ${to}`,
    );
  }

  const reachable = new Set();
  const queue = ['chapter2_start'];
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
      `Core chapter-2 scene is unreachable from chapter2_start: ${sceneId}`,
    );
  }

  assert(reachable.has('ch2_snow_015'), 'Chapter 2 must retain a forward path to ch2_snow_015');
  assert(
    reachable.has('chapter3_archive_start') && reachable.has('chapter3_white_start'),
    'Chapter 2 must retain both archive-route and White Academy exits',
  );
}

if (failures.length) {
  console.error('Chapter 2 route graph audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 2 route graph audit passed.');
