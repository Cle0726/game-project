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
    'chapter0_start',
    'ch0_001_road_entrance',
    'ch0_002_silent_town',
    'ch0_003_old_piano',
    'ch0_004_silent_keys',
    'ch0_005_diner',
    'ch0_006_mother_dream',
    'ch0_007_voiceless_morning',
    'ch0_008_map_open',
    'ch0_009_silent_school',
    'ch0_010_record_shop',
    'ch0_011_backstage_dress',
    'ch0_012_clocktower',
    'ch0_013_forbidden_performance',
    'ch0_014_atya_awakening',
    'ch0_015_first_baton',
    'ch0_016_moth_swarm_tutorial',
    'ch0_017_stage_crawler',
    'ch0_018_teabreak_not_tiya',
    'ch0_019_charron_revealed',
    'ch0_020_sound_stripping_boss',
    'ch0_021_epilogue',
  ];

  for (const sceneId of requiredCoreScenes) {
    assert(sceneIds.has(sceneId), `Required chapter-0 scene is missing: ${sceneId}`);
  }

  // Battle choices leave SCENES through startBattle(), so add only the canonical
  // victory return edges that are authored in BATTLES. Loss/retry edges are checked
  // separately and are intentionally not needed to prove forward reachability.
  const canonicalBattleEdges = [
    {
      from: 'ch0_016_moth_swarm_tutorial',
      battleId: 'ch0_mute_score_moths',
      winTo: 'ch0_017_stage_crawler',
      loseTo: 'ch0_016_moth_swarm_tutorial',
    },
    {
      from: 'ch0_017_stage_crawler',
      battleId: 'ch0_stage_crawler',
      winTo: 'ch0_018_teabreak_not_tiya',
      loseTo: 'ch0_017_stage_crawler',
    },
    {
      from: 'ch0_020_sound_stripping_boss',
      battleId: 'ch0_sound_stripping_officer',
      winTo: 'ch0_021_epilogue',
      loseTo: 'ch0_020_sound_stripping_boss',
    },
  ];

  const battlesSource = game.slice(battlesStart);
  for (const edge of canonicalBattleEdges) {
    assert(
      scenesSource.includes(`startBattle("${edge.battleId}"`),
      `${edge.from} must still start battle ${edge.battleId}`,
    );
    assert(
      battlesSource.includes(`showScene("${edge.winTo}")`),
      `${edge.battleId} must still return to ${edge.winTo} on victory`,
    );
    assert(
      battlesSource.includes(`showScene("${edge.loseTo}")`),
      `${edge.battleId} must still return to ${edge.loseTo} on loss`,
    );
    graph.get(edge.from)?.add(edge.winTo);
  }

  const reachable = new Set();
  const queue = ['chapter0_start'];
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
      `Core chapter-0 scene is unreachable from chapter0_start: ${sceneId}`,
    );
  }

  assert(
    reachable.has('ch0_021_epilogue'),
    'Chapter 0 must retain a forward path from chapter0_start to ch0_021_epilogue',
  );

  // These nodes are presentation/battle boundaries and must remain direct canonical
  // story nodes, even though exploration is inserted around travel elsewhere.
  for (const edge of [
    ['ch0_013_forbidden_performance', 'ch0_014_atya_awakening'],
    ['ch0_014_atya_awakening', 'ch0_015_first_baton'],
    ['ch0_015_first_baton', 'ch0_016_moth_swarm_tutorial'],
    ['ch0_018_teabreak_not_tiya', 'ch0_019_charron_revealed'],
    ['ch0_019_charron_revealed', 'ch0_020_sound_stripping_boss'],
  ]) {
    assert(
      graph.get(edge[0])?.has(edge[1]),
      `Canonical chapter-0 edge must remain intact: ${edge[0]} -> ${edge[1]}`,
    );
  }
}

if (failures.length) {
  console.error('Chapter 0 route graph audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Chapter 0 route graph audit passed.');
