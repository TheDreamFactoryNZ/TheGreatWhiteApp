import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App configFile='https://map.sustainableoceansociety.co.nz/public/config/config.json' />
  </StrictMode>
);
