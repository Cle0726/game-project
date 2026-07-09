import gsap from 'gsap';

export function createBattleEnterTransition(root: HTMLElement): gsap.core.Timeline {
  const topCurtain = root.querySelector<HTMLElement>('.battle-transition-curtain--top');
  const bottomCurtain = root.querySelector<HTMLElement>('.battle-transition-curtain--bottom');
  const spotlight = root.querySelector<HTMLElement>('.battle-transition-spotlight');
  const title = root.querySelector<HTMLElement>('.battle-transition-title');
  const arena = root.querySelector<HTMLElement>('.battle-arena');
  const enemy = root.querySelector<HTMLElement>('.enemy-display');
  const command = root.querySelector<HTMLElement>('.battle-hud__command');
  const portraits = Array.from(root.querySelectorAll<HTMLElement>('.battle-arena__portrait'));
  const skillButtons = Array.from(root.querySelectorAll<HTMLElement>('.skill-button'));

  const timeline = gsap.timeline({
    defaults: { overwrite: 'auto' },
  });

  gsap.set([topCurtain, bottomCurtain, spotlight, title].filter(Boolean), {
    pointerEvents: 'none',
  });
  gsap.set(topCurtain, { autoAlpha: 1, yPercent: -100 });
  gsap.set(bottomCurtain, { autoAlpha: 1, yPercent: 100 });
  gsap.set(spotlight, { autoAlpha: 0, xPercent: -18, scale: 0.84 });
  gsap.set(title, { autoAlpha: 0, y: 18 });
  gsap.set(arena, { autoAlpha: 0 });
  gsap.set(enemy, { autoAlpha: 0, scale: 0.78, transformOrigin: '58% 42%' });
  gsap.set(command, { autoAlpha: 0, y: 30 });
  gsap.set(skillButtons, { autoAlpha: 0, y: 24 });

  if (portraits[0]) {
    gsap.set(portraits[0], { autoAlpha: 0, x: '-18vw' });
  }
  if (portraits[1]) {
    gsap.set(portraits[1], { autoAlpha: 0, x: '18vw' });
  }

  timeline
    .to(topCurtain, {
      yPercent: 0,
      duration: 0.2,
      ease: 'power2.out',
    }, 0)
    .to(bottomCurtain, {
      yPercent: 0,
      duration: 0.2,
      ease: 'power2.out',
    }, 0)
    .to(arena, {
      autoAlpha: 1,
      duration: 0.12,
      ease: 'power1.out',
    }, 0.2)
    .to(spotlight, {
      autoAlpha: 1,
      xPercent: 16,
      scale: 1.08,
      duration: 0.3,
      ease: 'power2.inOut',
    }, 0.2)
    .to(spotlight, {
      autoAlpha: 0,
      duration: 0.18,
      ease: 'power1.out',
    }, 0.46)
    .to(title, {
      autoAlpha: 0.86,
      y: 0,
      duration: 0.18,
      ease: 'power2.out',
    }, 0.26)
    .to(title, {
      autoAlpha: 0,
      y: -12,
      duration: 0.2,
      ease: 'power1.in',
    }, 0.58)
    .to(enemy, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.7)',
    }, 0.4)
    .to(portraits, {
      autoAlpha: 1,
      x: 0,
      duration: 0.4,
      stagger: 0.15,
      ease: 'power3.out',
    }, 0.7)
    .to(bottomCurtain, {
      yPercent: 100,
      duration: 0.3,
      ease: 'power2.inOut',
    }, 1)
    .to(command, {
      autoAlpha: 1,
      y: 0,
      duration: 0.22,
      ease: 'power2.out',
    }, 1)
    .to(skillButtons, {
      autoAlpha: 1,
      y: 0,
      duration: 0.22,
      stagger: 0.08,
      ease: 'power2.out',
    }, 1.04)
    .to(topCurtain, {
      autoAlpha: 0,
      duration: 0.12,
      ease: 'power1.out',
    }, 1.18);

  return timeline;
}
