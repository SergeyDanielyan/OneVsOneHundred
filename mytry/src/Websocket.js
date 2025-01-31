import {over} from 'stompjs';
import SockJS from 'sockjs-client';

const connectClient = (setIsConnected, setError) => {
    console.log("connecting")
    var socket = new SockJS("http://localhost:8086/ws") // Буду менять порт возможно
    let stompClient = over(socket)
    stompClient.connect({}, () => setIsConnected(true), (err) => setError(String(err)))
    return stompClient
}

export {connectClient}