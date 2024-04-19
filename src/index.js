import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// App bileşenini render etmek için createRoot kullan
const root = createRoot(document.getElementById('root'));
root.render(<App />);
