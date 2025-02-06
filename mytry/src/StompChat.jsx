import React, {useEffect, useState} from "react";
import SockJS from "sockjs-client";
import {Client, Stomp} from "@stomp/stompjs";
import error from "eslint-plugin-react/lib/util/error.js";

const StompChat = () => {
        const [messages, setMessages] = useState([]);
        const [inputValue, setInputValue] = useState("");
        const [stompClient, setStompClient] = useState(null);

        useEffect(() => {
                const socket = new SockJS("http://localhost:8086/ws");
                const stompClient = Stomp.over(socket);
                stompClient.connect({}, () => {
                    console.log('Connected to STOMP')
                    stompClient.subscribe('topic/messages', message => {
                        const newMessage = JSON.parse(message.body)
                        setMessages(prevMessages => [...prevMessages, newMessage])
                    });
                }, error => {
                    console.error('Error connecting')
                })
                return () => stompClient.disconnect()


                // const client = new Client({
                //     webSocketFactory: () => socket,
                //     reconnectDelay: 5000,
                //     onConnect: () => {
                //         console.log("Connected to STOMP server");
                //
                //         // Подписываемся на канал
                //         client.subscribe("/topic/messages", (message) => {
                //             const newMessage = JSON.parse(message.body);
                //             setMessages((prevMessages) => [...prevMessages, newMessage]);
                //         });
                //     },
                // });
                //
                // client.activate();
                // setStompClient(client);
                //
                // return () => {
                //     client.deactivate();
                // };
            }, []
        )
        ;

        const sendMessage = () => {
            if (stompClient && inputValue.trim()) {
                const message = {
                    content: inputValue,
                    sender: "User",
                    timestamp: new Date().toISOString(),
                };

                // Отправляем сообщение на сервер
                stompClient.publish({
                    destination: "/app/chat",
                    body: JSON.stringify(message),
                });

                setInputValue("");
            }
        };

        return (
            <div>
                <h1>STOMP Chat</h1>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>
                            <strong>{msg.sender}:</strong> {msg.content}
                        </li>
                    ))}
                </ul>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        );
    }
;

export default StompChat;
