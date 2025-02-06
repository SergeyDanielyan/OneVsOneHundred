import {useEffect, useRef, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './App.css'
import Menu from "./Menu.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
// import Header from "./Header.jsx";
import Registration from "./Registration.jsx";
import Authorization from "./Authorization.jsx";
import Logout from "./Logout.jsx";
import {connectClient} from "./Websocket.js";
// import StompChat from "./StompChat.jsx";
// import StompExample from "./StompExample.jsx";
//import useWebSocket from "react-use-websocket";
// import io from 'socket.io-client';
// import {connectClient} from "./Websocket.js";
// import Test from "./Test.jsx";

function App() {
    // const socket = io('http://localhost:8085');
    const websocketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [websocketError, setWebsocketError] = useState(null);

    useEffect(() => {
        // websocketRef.socket = io('http://localhost:8086');
        // return () => websocketRef.socket.disconnect()
        websocketRef.client = connectClient(setIsConnected, setWebsocketError)
        return () => websocketRef.client.disconnect()
    })


    // const [messageToSend, setMessageToSend] = useState('');
    // const [incomingMessage, setIncomingMessage] = useState('');
    // const { sendMessage, lastMessage, readyState } = useWebSocket('http://localhost:8086/ws', { // Изменение URL
    //     onOpen: () => console.log('WebSocket connection opened'),
    //     onClose: () => console.log('WebSocket connection closed'),
    //     onError: (error) => console.error('WebSocket error:', error),
    // });

    return (
        <>
            {/*<Header/>*/}
            {/*<StompExample />*/}
            {/*<StompChat />*/}
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Menu/>}/> {/* Menu отображается по умолчанию */}
                    <Route path="/registration" element={<Registration/>}/>
                    <Route path="/authorization" element={<Authorization/>}/>
                    <Route path="/logout" element={<Logout/>}/>
                    {/*<Route path="/test" element={<Test/>}/>*/}
                </Routes>
            </BrowserRouter>
        </>
    )
}

// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

export default App
