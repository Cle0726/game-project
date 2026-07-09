const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

if (!code.includes('vfx_boss.js')) {
    code = code.replace(
        '<script src="vfx_dysregulation.js"></script>',
        `<script src="vfx_dysregulation.js"></script>
  <script src="vfx_boss.js"></script>`
    );
    fs.writeFileSync('index.html', code);
    console.log('index.html updated with vfx_boss.js');
} else {
    console.log('vfx_boss.js already added');
}
