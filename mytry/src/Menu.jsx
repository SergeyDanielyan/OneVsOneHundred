import React, {useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom';

function Menu() {
    const navigate = useNavigate();


    if (localStorage.getItem('user_token') != null) {
        return (
            <div>
                <div>
                    <h1>Welcome to the game 1 vs 100!</h1>
                </div>

                <div>
                    <button onClick={() => {
                        navigate("/one-player")
                    }}>Single Player
                    </button>
                    <button onClick={() => {
                        navigate("/room-connect")
                    }}>
                        Multi Player
                    </button>
                </div>
            </div>
        )
    }
    return (
        <div>
            <div>
                <h1>Welcome to the game 1 vs 100!</h1>
            </div>

            <div>
                <button onClick={() => {
                    navigate("/one-player")
                }}>Single Player
                </button>
            </div>
        </div>
    )
}

export default Menu