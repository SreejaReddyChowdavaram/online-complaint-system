/**
 * main.jsx - Application Entry Point
 * 
 * This is the entry point of our React application.
 * It renders the App component into the DOM.
 * 
 * Flow: main.jsx → App.jsx → Routes → Pages
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
