import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client"; // Библиотека для работы с WebSocket
import { Client } from "@stomp/stompjs"; // Библиотека для работы с STOMP

const StompExample = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Создаем WebSocket-соединение
        const socket = new SockJS("http://localhost:8086/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // Автоподключение при разрыве соединения
            onConnect: () => {
                console.log("Connected to STOMP server");

                // Подписываемся на канал "/topic/messages"
                stompClient.subscribe("/topic/messages", (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });
            },
            onStompError: (error) => {
                console.error("STOMP error:", error);
            },
        });

        // Активируем STOMP-клиент
        stompClient.activate();

        // Очистка при размонтировании компонента
        return () => {
            stompClient.deactivate();
        };
    }, []);

    return (
        <div>
            <h1>STOMP Messages</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.content}</li>
                ))}
            </ul>
        </div>
    );
};

export default StompExample;
