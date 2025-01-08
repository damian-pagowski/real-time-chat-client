import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  // double rendering issue - supposed to be issue only in dev mode
      <App />
  // </React.StrictMode>
);