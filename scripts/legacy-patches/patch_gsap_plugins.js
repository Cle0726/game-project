const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add EasePack for rough() ease support
if (!html.includes('EasePack')) {
    html = html.replace(
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>',
        `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/EasePack.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CustomEase.min.js"></script>`
    );
    fs.writeFileSync('index.html', html);
    console.log('Added EasePack and CustomEase to index.html');
} else {
    console.log('EasePack already loaded');
}
