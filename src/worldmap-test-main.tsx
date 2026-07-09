import React from 'react';
import { createRoot } from 'react-dom/client';
import { WorldMapView } from './worldmap';

window.GameState = {
  当前场景ID: 'ch2_004',
  已触发事件: [],
  槐序共鸣: 48,
  洛温共鸣: 42,
  伊芙白共鸣: 36,
  明弦共鸣: 28
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WorldMapView />
  </React.StrictMode>,
);
