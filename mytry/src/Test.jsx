// import * as Stomp from 'stompjs';
// import SockJS from 'sockjs-client';
// import currentUser from "sockjs-client/lib/transport/receiver/jsonp.js";
//
// function Test() {
//     let stompClient = null;
//
//     const connect = () => {
//         const SockJSInstance = new SockJS("http://localhost:8080/ws"); // Переименуйте переменную, чтобы не путать с импортом
//         stompClient = Stomp.over(SockJSInstance);
//         stompClient.connect({}, onConnected, onError);
//     };
//
//     const onConnected = () => {
//         console.log("connected");
//
//         stompClient.subscribe(
//             "/user/" + currentUser.id + "/queue/messages",
//             onMessageReceived
//         );
//     };
//
//     const onError = () => {
//         console.log("error websocket")
//     }
//
//     const sendMessage = (msg) => {
//         if (msg.trim() !== "") {
//             const message = {
//                 senderId: currentUser.id,
//                 recipientId: activeContact.id,
//                 senderName: currentUser.name,
//                 recipientName: activeContact.name,
//                 content: msg,
//                 timestamp: new Date(),
//             };
//
//             stompClient.send("/app/chat", {}, JSON.stringify(message));
//         }
//     };
// }
//
// export default Test;