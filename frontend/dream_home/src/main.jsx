import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import store from './store.jsx'
import {Provider} from 'react-redux'
import ChatProvider from '../context/chatProvider.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ChatProvider>
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
  </ChatProvider>   
  </Provider>
)
