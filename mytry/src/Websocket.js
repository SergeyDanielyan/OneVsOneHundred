// import SockJS from 'sockjs-client';
import {Client, Stomp} from '@stomp/stompjs';
import {useState} from "react";

const connectClient = (setIsConnected, setError) => {
    // const [messages, setMessages] = useState([]);

    console.log("connecting")
    const socket = new SockJS("http://localhost:8085/ws"); // Буду менять порт возможно
    // const stompClient = new Client({
    //     webSocketFactory: () => socket,
    //     reconnectDelay: 5000, // Автоподключение при разрыве соединения
    //     onConnect: () => {
    //         console.log("Connected to STOMP server");stompClient.subscribe("/topic/messages", (message) => {
    //             const newMessage = JSON.parse(message.body);
    //             setMessages((prevMessages) => [...prevMessages, newMessage]);
    //         });
    //     },
    //     onStompError: (error) => {
    //         console.error("STOMP error:", error);
    //     },
    // });

    let stompClient = Stomp.over(socket)
    stompClient.connect({}, () => setIsConnected(true), (err) => setError(String(err)))
    return stompClient
}

export {connectClient}