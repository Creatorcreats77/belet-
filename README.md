_______________________________________________to run react project locally install vite single file and change vite.config.js like :


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined // ensures everything is in one file
      }
    }
  },
  base: './' // ensures relative paths for file://
})


_______________________________________________In main.jsx use HashRouter

import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)

_______________________________________________then in app use Link

import { Link, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import "./App.css";

function App() {
  return (
    <div>
      <nav>
        <Link to="/a">Home</Link> |{" "}
      </nav>
      <Routes>
        <Route path="/a" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;

