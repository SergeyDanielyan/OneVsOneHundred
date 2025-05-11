import './GameBoard.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function OnePlayer() {
    const [roundNumber, setRoundNumber] = useState(1)
    const [gameWon, setGameWon] = useState(false)
    const [currentTask, setCurrentTask] = useState(null)
    const [message, setMessage] = useState("")
    const [answer1, setAnswer1] = useState("")
    const [answer2, setAnswer2] = useState("")
    const [answer3, setAnswer3] = useState("")
    const [disabledButton, setDisabledButton] = useState(false)
    const [finished, setFinished] = useState(false)
    const [roundWon, setRoundWon] = useState(false)
    const [playerIndicatorState, setPlayerIndicatorState] = useState([
        "yellow", "yellow", "yellow", "yellow", "yellow",
        "yellow", "yellow", "yellow", "yellow", "yellow",
        "yellow", "yellow", "yellow", "yellow", "yellow",
        "yellow", "yellow", "yellow", "yellow", "yellow",
        "yellow", "yellow", "yellow", "yellow", "yellow"])
    const [buttonType, setButtonType] = useState(["answer", "answer", "answer"])
    const [messageMoment, setMessageMoment] = useState(false)
    const [finishedBeginning, setFinishedBeginning] = useState(false)
    const navigate = useNavigate()

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8085/api/one-player/random-task', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const task = await response.json();
                setCurrentTask(task);
                setMessage(task.question)
                let numbers = [0, 1, 2];
                shuffle(numbers);
                console.log('Задание: ', task)
                let myAnswersArray = [task.correctAnswer, task.firstWrongAnswer, task.secondWrongAnswer]
                let mixedAnswersArray = [myAnswersArray[numbers[0]], myAnswersArray[numbers[1]], myAnswersArray[numbers[2]]]
                setAnswer1(mixedAnswersArray[0])
                setAnswer2(mixedAnswersArray[1])
                setAnswer3(mixedAnswersArray[2])
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [roundNumber]);

    useEffect(() => {
        if (!gameWon) {
            return
        }
        setFinished(true)
        setMessageMoment(true)
        setMessage("Вы выиграли! Можете забрать свою награду!")

    }, [gameWon])

    function won() {
        if (roundNumber <= 5) {
            return Math.random() < 0.8;
        } else if (roundNumber <= 10) {
            return Math.random() < 0.4;
        } else {
            return Math.random() < 0.2;
        }
    }

    function handleRivalsAnswers() {
        let tempRivalsAnswers = [
            "yellow", "yellow", "yellow", "yellow", "yellow",
            "yellow", "yellow", "yellow", "yellow", "yellow",
            "yellow", "yellow", "yellow", "yellow", "yellow",
            "yellow", "yellow", "yellow", "yellow", "yellow",
            "yellow", "yellow", "yellow", "yellow", "yellow"]
        for (let i = 0; i < 25; ++i) {
            if (playerIndicatorState[i] === "black") {
                tempRivalsAnswers[i] = "black"
            } else {
                tempRivalsAnswers[i] = won() ? "green" : "red"
            }
        }
        setPlayerIndicatorState(tempRivalsAnswers)
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
        switch (currentTask.correctAnswer) {
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

        handleRivalsAnswers()


        setMessageMoment(true)
        if (chosenAnswer === currentTask.correctAnswer) {
            console.log("correct answer")
            if (roundNumber <= 2) {
                setFinishedBeginning(true)
                setMessage("Это правильный ответ.")
            } else {
                setRoundWon(true)
                setMessage("Это правильный ответ. Вы можете продолжить игру или закончить.")
            }
        } else {
            setMessage("Это неправильный ответ. К сожалению, вы проиграли.")
            setFinished(true)
        }
    }

    function goToMenu() {
        navigate("/")
    }

    function handleRoundChangeRivalsAnswers() {
        let cnt = 0;
        let tempRivalsAnswers = [
            "yellow", "yellow", "yellow", "yellow", "yellow",
            "yellow", "yellow", "yellow", "yellow", "yellow",
            "yellow", "yellow", "yellow", "yellow", "yellow",
            "yellow", "yellow", "yellow", "yellow", "yellow",
            "yellow", "yellow", "yellow", "yellow", "yellow"]
        for (let i = 0; i < 25; ++i) {
            if (playerIndicatorState[i] === "red" || playerIndicatorState[i] === "black") {
                tempRivalsAnswers[i] = "black"
            } else {
                cnt++
            }
        }
        setPlayerIndicatorState(tempRivalsAnswers)
        return cnt === 0
    }

    function nextRound() {
        setRoundWon(false)
        setFinishedBeginning(false)
        setButtonType(["answer", "answer", "answer"])
        setMessageMoment(false)
        setDisabledButton(false)
        let isWon = handleRoundChangeRivalsAnswers()
        if (isWon) {
            setGameWon(true)
            return
        }
        setRoundNumber(roundNumber + 1)
    }

    if (currentTask != null) {
        return (
            <>
                <svg className="player1" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[0]} rx="10" ry="10"/>
                </svg>
                <svg className="player2" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[1]} rx="10" ry="10"/>
                </svg>
                <svg className="player3" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[2]} rx="10" ry="10"/>
                </svg>
                <svg className="player4" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[3]} rx="10" ry="10"/>
                </svg>
                <svg className="player5" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[4]} rx="10" ry="10"/>
                </svg>
                <svg className="player6" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[5]} rx="10" ry="10"/>
                </svg>
                <svg className="player7" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[6]} rx="10" ry="10"/>
                </svg>
                <svg className="player8" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[7]} rx="10" ry="10"/>
                </svg>
                <svg className="player9" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[8]} rx="10" ry="10"/>
                </svg>
                <svg className="player10" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[9]} rx="10" ry="10"/>
                </svg>
                <svg className="player11" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[10]} rx="10" ry="10"/>
                </svg>
                <svg className="player12" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[11]} rx="10" ry="10"/>
                </svg>
                <svg className="player13" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[12]} rx="10" ry="10"/>
                </svg>
                <svg className="player14" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[13]} rx="10" ry="10"/>
                </svg>
                <svg className="player15" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[14]} rx="10" ry="10"/>
                </svg>
                <svg className="player16" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[15]} rx="10" ry="10"/>
                </svg>
                <svg className="player17" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[16]} rx="10" ry="10"/>
                </svg>
                <svg className="player18" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[17]} rx="10" ry="10"/>
                </svg>
                <svg className="player19" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[18]} rx="10" ry="10"/>
                </svg>
                <svg className="player20" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[19]} rx="10" ry="10"/>
                </svg>
                <svg className="player21" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[20]} rx="10" ry="10"/>
                </svg>
                <svg className="player22" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[21]} rx="10" ry="10"/>
                </svg>
                <svg className="player23" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[22]} rx="10" ry="10"/>
                </svg>
                <svg className="player24" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[23]} rx="10" ry="10"/>
                </svg>
                <svg className="player25" width="90" height="60">
                    <rect width="100%" height="100%" fill={playerIndicatorState[24]} rx="10" ry="10"/>
                </svg>
                <div className="question-field">
                    <p className={"question-label"}>{message}</p>
                </div>
                {!messageMoment ? <div className="answer-container">
                    <button className={buttonType[0]} disabled={disabledButton}
                            onClick={() => onAnswerClick(1)}>{answer1}</button>
                    <button className={buttonType[1]} disabled={disabledButton}
                            onClick={() => onAnswerClick(2)}>{answer2}</button>
                    <button className={buttonType[2]} disabled={disabledButton}
                            onClick={() => onAnswerClick(3)}>{answer3}</button>
                </div> : <></>}
                {finished ?
                    <button className={"lost-game"}
                            onClick={() => goToMenu()}>Выйти</button>
                    : <></>}
                {
                    roundWon ?
                        <div className={"win-container"}>
                            <button className={"answer"} onClick={() => nextRound()}>Продолжить</button>
                            <button className={"answer"} onClick={() => goToMenu()}>Выйти</button>
                        </div> :
                        <></>
                }
                {
                    finishedBeginning ? <button className={"lost-game"}
                                                onClick={() => nextRound()}>Продолжить</button>
                        : <></>

                }
            </>
        )
    }
    return (<></>
    )
}

export default OnePlayer