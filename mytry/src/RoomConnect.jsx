import React, {useEffect, useRef, useState} from 'react'
import {connectClient} from "./Websocket.js";
import {useNavigate} from "react-router-dom";

const RoomConnect = () => {
    const websocketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [websocketError, setWebsocketError] = useState(null);
    const [messages, setMessages] = useState([])
    const [mess, setMess] = useState("")
    const [isCreated, setIsCreated] = useState(false)
    const [isAssigned, setIsAssigned] = useState(false)
    const [roomId, setRoomId] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        websocketRef.client = connectClient(setIsConnected, setWebsocketError, setMessages, "join-room")
        return () => {
            console.log("client disconnecting")
            websocketRef.client.disconnect()
        }
    }, [])

    useEffect(() => {
        console.log(messages)
        setMess(messages[messages.length - 1])
    }, [messages])

    useEffect(() => {
        console.log("new room id: ", roomId)
    }, [roomId]);

    useEffect(() => {
        if (mess == null || !isConnected) {
            return
        }
        const func = async () => {
            console.log("message: ", mess)
            console.log("my room ", roomId)
            const splitted_mess = mess.split(':');
            switch (splitted_mess[0]) {
                case 'join':
                    if (splitted_mess.length === 3 && splitted_mess[1] === localStorage.getItem('user_email')) {
                        await setIsAssigned(true)
                        await setRoomId(parseInt(splitted_mess[2], 10))
                    }
                    break
                case 'join-start': {
                    let myRoomId = roomId;
                    if (splitted_mess.length === 4 && splitted_mess[1] === localStorage.getItem('user_email')) {
                        await setIsAssigned(true)
                        myRoomId = parseInt(splitted_mess[2], 10)
                        await setRoomId(myRoomId)
                    }
                    if (myRoomId === parseInt(splitted_mess[2], 10)) {
                        localStorage.setItem('room_id', myRoomId.toString())
                        localStorage.setItem('hero_email', splitted_mess[3])
                        navigate("/two-players")
                    }
                    break
                }
            }
        }

        func()

    }, [mess, roomId, isConnected])


    const createRoom = async () => {
        // // eslint-disable-next-line react/prop-types
        // websocketRef.send('app/createRoom', localStorage.getItem('user_token'))

        const response = await fetch('http://localhost:8085/api/rest-game/create-room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: localStorage.getItem('user_token')
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json()

        await setIsCreated(true)
        console.log("data", data)
        await setRoomId(data)
        console.log("roomId: ", roomId)
        console.log("data text int: ", data)
    }

    function joinRoom() {
        websocketRef.client.send('/app/join-room', {}, localStorage.getItem('user_token'))
    }

    return (
        <div>
            <div>
                <h1>Welcome to Multi Player!</h1>
            </div>

            {
                isCreated ? <p>Комната создана</p> : <></>
            }
            {
                isAssigned ? <p>Комната найдена</p> : <></>
            }
            {
                !isCreated && !isAssigned ? <>
                    <div>
                        <button onClick={() => createRoom()
                        }>Create a room
                        </button>
                        <button onClick={() =>
                            joinRoom()}>
                            Connect to an existing room
                        </button>
                    </div>
                    <div>Finding a room for you</div>
                </> : <></>
            }
        </div>
    )
}


export default RoomConnect