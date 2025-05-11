import {useEffect, useRef, useState} from "react";
import {connectClient} from "./Websocket.js";
import {useNavigate} from "react-router-dom";

function TwoPlayers() {
    const [roundNumber, setRoundNumber] = useState(1)
    const [answer1, setAnswer1] = useState("")
    const [answer2, setAnswer2] = useState("")
    const [answer3, setAnswer3] = useState("")
    const websocketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [websocketError, setWebsocketError] = useState(null);
    const [messages, setMessages] = useState([])
    const [mess, setMess] = useState("")
    const [idInRoom, setIdInRoom] = useState(0)

    const [currentTaskQuestion, setCurrentTaskQuestion] = useState("")
    const [currentTaskCorrectAnswer, setCurrentTaskCorrectAnswer] = useState("")

    const [hasSentRequest, setHasSentRequest] = useState(false); // Переменная состояния

    const [playersIndicatorsIndexes, setPlayersIndicatorsIndexes] = useState([])

    const [playerIndicatorState, setPlayerIndicatorState] = useState([
        "yellow", "yellow", "yellow", "yellow", "yellow",
        "yellow", "yellow", "yellow", "yellow", "yellow",
        "yellow", "yellow", "yellow", "yellow", "yellow",
        "yellow", "yellow", "yellow", "yellow", "yellow",
        "yellow", "yellow", "yellow", "yellow", "yellow",
        "yellow"])
    const [labelMessage, setLabelMessage] = useState("")
    const [fullGameRoom, setFullGameRoom] = useState(false)

    const [messageMoment, setMessageMoment] = useState(false)
    const [disabledButton, setDisabledButton] = useState(false)
    const [buttonType, setButtonType] = useState(["answer", "answer", "answer"])
    const [heroMessage, setHeroMessage] = useState(false)

    const [finished, setFinished] = useState(false)
    const [finishedBeginning, setFinishedBeginning] = useState(false)

    const navigate = useNavigate()

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    useEffect(() => {
        websocketRef.client = connectClient(setIsConnected, setWebsocketError, setMessages, "answers")
        return () => {
            console.log("client disconnecting")
            websocketRef.client.disconnect()
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:8085/api/rest-game/user-id?room=' + localStorage.getItem('room_id') + "&email=" + localStorage.getItem('user_email'), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const myId = await response.json()
            setIdInRoom(myId)
            console.log("my id: ", myId)
        }
        fetchData()
    }, [])

    useEffect(() => {
        setPlayersIndicatorsIndexes([
            0, 1, 2, 3, 4,
            5, 6, 7, 8, 9,
            10, 11, 12, 13, 14,
            15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25].filter(num => num !== idInRoom))
    }, [idInRoom])

    useEffect(() => {
        if (isConnected && !hasSentRequest) {
            console.log("sent connect request")
            websocketRef.client.send("/app/get-answer", {}, "connect:" + localStorage.getItem('room_id'));
            setHasSentRequest(true);
        }
    }, [isConnected, hasSentRequest])

    useEffect(() => {
        if (!isConnected || !fullGameRoom) {
            return
        }

        if (localStorage.getItem('hero_email') === localStorage.getItem('user_email')) {
            websocketRef.client.send("/app/get-answer", {}, "task:" + localStorage.getItem('room_id'))
        }
    }, [roundNumber, isConnected, fullGameRoom]);

    useEffect(() => {
        console.log(messages)
        setMess(messages[messages.length - 1])
    }, [messages])

    useEffect(() => {
        const func = async () => {
            if (mess == null) {
                return
            }
            // TODO handle mess
            const splitted_mess = mess.split(':');
            switch (splitted_mess[0]) {
                case "full": {
                    if (splitted_mess[1] === localStorage.getItem('room_id')) {
                        setFullGameRoom(true)
                    }
                    break
                }
                case "task": {

                    const currentRoomId = splitted_mess[1];
                    const currentQuestion = splitted_mess[2];
                    const currentCorrectAnswer = splitted_mess[3];
                    const currentWrongAnswer1 = splitted_mess[4];
                    const currentWrongAnswer2 = splitted_mess[5];
                    const playersResult = splitted_mess.slice(6, splitted_mess.length);

                    setPlayerIndicatorState(playersResult)

                    if (currentRoomId !== localStorage.getItem('room_id')) {
                        break
                    }

                    console.log("playerIndicatorState[idInRoom] ", playerIndicatorState[idInRoom])

                    if (playersResult[idInRoom] === "black") {
                        setMessageMoment(true)
                        setFinished(true)
                        setCurrentTaskQuestion("Вы проиграли.")
                        break
                    }

                    console.log("Not black")

                    setMessageMoment(false)
                    setFinishedBeginning(false)
                    setHeroMessage(false)
                    setFinished(false)
                    setCurrentTaskQuestion(currentQuestion);
                    setCurrentTaskCorrectAnswer(currentCorrectAnswer)
                    setDisabledButton(false)
                    setButtonType(["answer", "answer", "answer"])
                    let numbers = [0, 1, 2];
                    shuffle(numbers);
                    console.log('Вопрос: ', currentQuestion)
                    let myAnswersArray = [currentCorrectAnswer, currentWrongAnswer1, currentWrongAnswer2]
                    let mixedAnswersArray = [myAnswersArray[numbers[0]], myAnswersArray[numbers[1]], myAnswersArray[numbers[2]]]
                    setAnswer1(mixedAnswersArray[0])
                    setAnswer2(mixedAnswersArray[1])
                    setAnswer3(mixedAnswersArray[2])
                    break
                }
                case "change": {
                    const slice = splitted_mess.slice(1, splitted_mess.length)
                    console.log("splitted_mess {}", slice)
                    setPlayerIndicatorState(slice)
                    break
                }
                case "finished": {
                    const slice = splitted_mess.slice(1, splitted_mess.length)
                    console.log("splitted_mess {}", slice)
                    setPlayerIndicatorState(slice)
                    if (localStorage.getItem('hero_email') === localStorage.getItem('user_email')) {
                        setMessageMoment(true)
                        if (roundNumber <= 2) {
                            setFinishedBeginning(true)
                        } else {
                            setHeroMessage(true)
                        }
                        if (slice[idInRoom] === "green" || slice[idInRoom] === "yellow") {
                            if (roundNumber <= 2) {
                                setCurrentTaskQuestion("Вы ответили правильно или все ответили неправильно!")
                            } else {
                                setCurrentTaskQuestion("Вы ответили правильно или все ответили неправильно! Хотите продолжить игру или завершить?")
                            }
                        }
                    } else {
                        setMessageMoment(true)
                        setCurrentTaskQuestion(slice[idInRoom] === "green" || slice[idInRoom] === "yellow" ? "Вы ответили правильно или все ответили неправильно!" : "Вы проиграли.")
                    }
                    break
                }
                case "hero-left": {
                    const roomId = splitted_mess[1]
                    if (roomId === localStorage.getItem('room_id')) {
                        if (localStorage.getItem('hero_email') === localStorage.getItem('user_email')) {
                            goToMenu()
                        } else {
                            setMessageMoment(true)
                            setFinished(true)
                            if (currentTaskQuestion === "Вы ответили правильно!") {
                                setCurrentTaskQuestion("Вы выиграли!")
                            }
                        }
                    }
                    break
                }
                case "hero-lost": {
                    const roomId = splitted_mess[1]
                    if (roomId === localStorage.getItem('room_id')) {
                        if (localStorage.getItem('hero_email') === localStorage.getItem('user_email')) {
                            setMessageMoment(true)
                            setFinished(true)
                            setCurrentTaskQuestion("Вы проиграли.")
                        } else {
                            setMessageMoment(true)
                            setFinished(true)
                            setCurrentTaskQuestion(playerIndicatorState[idInRoom] === "green" || playerIndicatorState[idInRoom] === "yellow" ? "Вы выиграли!" : "Вы проиграли.")
                        }
                    }
                    break
                }
                case "hero-won": {
                    const roomId = splitted_mess[1]
                    if (roomId === localStorage.getItem('room_id')) {
                        setMessageMoment(true)
                        setFinished(true)
                        if (localStorage.getItem('hero_email') === localStorage.getItem('user_email')) {
                            setCurrentTaskQuestion("Вы выиграли!")
                        } else {
                            setCurrentTaskQuestion("Вы проиграли.")
                        }
                    }
                    break
                }
            }
        }
        func()
    }, [mess])

    function handleAnswer(isCorrect) {
        console.log("handle answer: room id", localStorage.getItem('room_id'))
        websocketRef.client.send("/app/get-answer", {}, "answer:" + localStorage.getItem('room_id') + ":" + localStorage.getItem('user_token') + ":" + (isCorrect ? "green" : "red"))
    }

    function nextRound() {
        setRoundNumber(roundNumber + 1)
    }

    function onAnswerClick(answerNumber) {
        setDisabledButton(true)
        let chosenAnswer
        switch (answerNumber) {
            case 1:
                chosenAnswer = answer1
                break
            case 2:
                chosenAnswer = answer2
                break
            case 3:
                chosenAnswer = answer3
                break
        }

        let tempButtonType = ["wrong-answer", "wrong-answer", "wrong-answer"]
        switch (currentTaskCorrectAnswer) {
            case answer1:
                console.log("first correct")
                tempButtonType[0] = "correct-answer"
                break
            case answer2:
                console.log("second correct")
                tempButtonType[1] = "correct-answer"
                break
            case answer3:
                console.log("third correct")
                tempButtonType[2] = "correct-answer"
        }
        setButtonType(tempButtonType)

        handleAnswer(chosenAnswer === currentTaskCorrectAnswer)
    }

    function sendExitQuery() {
        if (localStorage.getItem('hero_email') === localStorage.getItem('user_email')) {
            websocketRef.client.send("/app/get-answer", {}, "finish:" + localStorage.getItem('room_id'));
        }
    }

    function goToMenu() {
        navigate("/")
    }


    if (currentTaskQuestion === "") {
        return <>fdsafd</>
    }


    return (
        <>
            <svg className="player1" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[0]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player2" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[1]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player3" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[2]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player4" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[3]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player5" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[4]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player6" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[5]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player7" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[6]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player8" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[7]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player9" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[8]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player10" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[9]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player11" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[10]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player12" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[11]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player13" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[12]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player14" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[13]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player15" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[14]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player16" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[15]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player17" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[16]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player18" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[17]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player19" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[18]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player20" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[19]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player21" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[20]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player22" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[21]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player23" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[22]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player24" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[23]]} rx="10"
                      ry="10"/>
            </svg>
            <svg className="player25" width="90" height="60">
                <rect width="100%" height="100%" fill={playerIndicatorState[playersIndicatorsIndexes[24]]} rx="10"
                      ry="10"/>
            </svg>
            <div className="question-field">
                <p className={"question-label"}>{currentTaskQuestion}</p>
            </div>

            {!messageMoment ? <div className="answer-container">
                <button className={buttonType[0]} disabled={disabledButton}
                        onClick={() => onAnswerClick(1)}>{answer1}</button>
                <button className={buttonType[1]} disabled={disabledButton}
                        onClick={() => onAnswerClick(2)}>{answer2}</button>
                <button className={buttonType[2]} disabled={disabledButton}
                        onClick={() => onAnswerClick(3)}>{answer3}</button>
            </div> : <></>}

            {heroMessage ? <div className={"win-container"}>
                    <button className={"answer"} onClick={() => nextRound()}>Продолжить</button>
                    <button className={"answer"} onClick={() => sendExitQuery()}>Выйти</button>
                </div> :
                <></>}
            {finished ?
                <button className={"lost-game"}
                        onClick={() => goToMenu()}>Выйти</button>
                : <></>}
            {finishedBeginning ? <button className={"lost-game"}
                                         onClick={() => nextRound()}>Продолжить</button>
                : <></>}
        </>)

}

export default TwoPlayers