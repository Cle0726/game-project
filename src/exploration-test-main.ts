import { FreeRoamPrototype } from './exploration/FreeRoamPrototype';

const host = document.querySelector<HTMLElement>('#exploration-root');

if (!host) {
  throw new Error('Missing #exploration-root');
}

const prototype = new FreeRoamPrototype();
void prototype.mount(host);

if (import.meta.hot) {
  import.meta.hot.dispose(() => prototype.destroy());
}
