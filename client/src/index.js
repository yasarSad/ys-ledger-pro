import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Assuming App includes Routes or main application structure
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root') // Attach React app to the DOM element
);