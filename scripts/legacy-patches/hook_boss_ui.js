const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

const targetFunctionRegex = /function revealStaggeredItems\(items\) \{[\s\S]*?\}\)/;

const newFunction = `function revealStaggeredItems(items) {
  const container = document.getElementById("game-container");
  const isBossMode = container && container.classList.contains('boss-combat-ui-active');

  if (isBossMode && typeof gsap !== "undefined") {
      // Custom GSAP entrance for Boss Combat UI
      gsap.fromTo(items, 
          { y: 30, scale: 0.95, opacity: 0 },
          { 
              y: 0, 
              scale: 1, 
              opacity: 1, 
              duration: 0.6, 
              stagger: 0.1, 
              ease: "back.out(1.5)",
              onComplete: () => {
                  items.forEach(item => item.classList.add("is-visible"));
              }
          }
      );
  } else {
      // Normal CSS entrance
      requestAnimationFrame(() => {
        items.forEach((item) => {
          item.classList.add("is-visible");
        });
      });
  }
}`;

code = code.replace(targetFunctionRegex, newFunction);
fs.writeFileSync('game.js', code);
console.log('game.js hooked for boss combat UI entrance');
