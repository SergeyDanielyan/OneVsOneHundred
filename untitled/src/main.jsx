import React from 'react';
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
//import Menu from "./Menu.jsx";
import Header from "./Header.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        David
        <Header></Header>
        <App/>
    </StrictMode>,
)
/*
createRoot(document.getElementById('header')).render(
    <StrictMode>
        <Header/>
    </StrictMode>
)

 */