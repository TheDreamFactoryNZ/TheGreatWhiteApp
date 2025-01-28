import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './App';
// import config from

render(
  <StrictMode>
    <App configFile='./config/config.json' />
  </StrictMode>,
  document.getElementById('root')
);
