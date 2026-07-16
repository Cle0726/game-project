import fs from 'node:fs';

function assertFileContains(path, expected, message) {
  const text = fs.readFileSync(path, 'utf8');
  if (!text.includes(expected)) {
    throw new Error(message);
  }
}

function assertFileDoesNotContain(path, forbidden, message) {
  const text = fs.readFileSync(path, 'utf8');
  if (text.includes(forbidden)) {
    throw new Error(message);
  }
}

assertFileContains(
  'server/main.py',
  'settings.validate_runtime_security()',
  'FastAPI startup must validate runtime security settings before serving requests.'
);

assertFileContains(
  'server/config.py',
  'environment:',
  'Backend settings must expose ENVIRONMENT so production can be detected.'
);

assertFileContains(
  'server/config.py',
  'validate_runtime_security',
  'Backend settings must define validate_runtime_security().' 
);

assertFileContains(
  'index.html',
  '服务器环境变量',
  'AI settings copy must tell users to configure DeepSeek on the backend, not in browser localStorage.'
);

assertFileDoesNotContain(
  'index.html',
  '密钥仅保存在本地浏览器中，不会上传到任何服务器',
  'AI settings copy must not encourage storing DeepSeek API keys in browser localStorage.'
);

assertFileContains(
  'game.js',
  'function isDeepSeekEnabled() {\n  return true;\n}',
  'Frontend AI enablement must rely on the backend proxy/fallback instead of a browser-stored API key.'
);

assertFileDoesNotContain(
  'game.js',
  'localStorage.setItem(DEEPSEEK_CONFIG.storageKey, key)',
  'Frontend must not persist DeepSeek API keys in browser localStorage.'
);

console.log('Production security guard passed.');
