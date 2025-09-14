import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import Home2 from './components/Home.jsx'
import './index.css'
import HomePage from './components/HomePage.jsx'
import BottomSwiper from './components/BottomSwiper.jsx'
import  Search  from './components/Search.jsx'
import App2 from './App2.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App2 />
    </HashRouter>
  </React.StrictMode>
)
