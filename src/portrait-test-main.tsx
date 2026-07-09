import React from 'react';
import { createRoot } from 'react-dom/client';
import { PortraitStackTestPage } from './pages/PortraitStackTestPage';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PortraitStackTestPage />
  </React.StrictMode>,
);
