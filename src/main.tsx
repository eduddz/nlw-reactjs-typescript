import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { AuthProvider } from './context/auth';

import './styles/global.css';

//renderiza através do reactDOM no id="root" do html
ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
    <App />

    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
