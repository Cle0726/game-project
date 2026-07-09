const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

if (!code.includes('vfx_teabreak.js')) {
    code = code.replace(
        '<script src="vfx_advanced.js"></script>',
        `<script src="vfx_advanced.js"></script>
  <script src="vfx_teabreak.js"></script>
  <script src="vfx_transition.js"></script>
  <script src="vfx_ultimate.js"></script>
  <script src="vfx_dysregulation.js"></script>`
    );
    fs.writeFileSync('index.html', code);
    console.log('index.html updated with new module scripts');
} else {
    console.log('Scripts already added');
}
