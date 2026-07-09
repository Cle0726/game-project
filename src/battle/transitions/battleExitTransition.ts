import gsap from 'gsap';

export function createBattleExitTransition(root: HTMLElement): gsap.core.Timeline {
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

  gsap.set([topCurtain, bottomCurtain], { autoAlpha: 1 });
  gsap.set(topCurtain, { yPercent: -100 });
  gsap.set(bottomCurtain, { yPercent: 100 });
  gsap.set(spotlight, { autoAlpha: 0 });
  gsap.set(title, { autoAlpha: 0 });

  timeline
    .to(skillButtons, {
      autoAlpha: 0,
      y: 18,
      duration: 0.16,
      stagger: 0.03,
      ease: 'power1.in',
    }, 0)
    .to(command, {
      autoAlpha: 0,
      y: 28,
      duration: 0.18,
      ease: 'power1.in',
    }, 0.04)
    .to(bottomCurtain, {
      yPercent: 0,
      duration: 0.18,
      ease: 'power2.out',
    }, 0.04)
    .to(portraits[0] ? [portraits[0]] : [], {
      autoAlpha: 0,
      x: '-14vw',
      duration: 0.22,
      ease: 'power2.in',
    }, 0.18)
    .to(portraits[1] ? [portraits[1]] : [], {
      autoAlpha: 0,
      x: '14vw',
      duration: 0.22,
      ease: 'power2.in',
    }, 0.24)
    .to(enemy, {
      autoAlpha: 0,
      scale: 0.86,
      duration: 0.22,
      ease: 'back.in(1.4)',
    }, 0.24)
    .to(topCurtain, {
      yPercent: 0,
      duration: 0.18,
      ease: 'power2.out',
    }, 0.3)
    .to(arena, {
      autoAlpha: 0,
      duration: 0.16,
      ease: 'power1.in',
    }, 0.42)
    .to([topCurtain, bottomCurtain], {
      autoAlpha: 0,
      duration: 0.1,
      ease: 'power1.out',
    }, 0.56);

  return timeline;
}
