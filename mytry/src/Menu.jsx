import React, {useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom';

function Menu() {
    const navigate = useNavigate();



    if (localStorage.getItem('user_token') != null) {
        return (<div><p>nado pomenyat</p></div>
        )
    }
    return (
        <div>
            <div>
                <h1>Welcome to the game 1 vs 100!</h1>
            </div>

            <div>
                {/* eslint-disable-next-line no-undef */}
                <button /* className="my-button"*/ onClick={() => {
                    navigate("/one-player")
                }}>Single Player
                </button>
            </div>
        </div>
    )
    /*
    return (
        <div>
            <div>
                <h1>Welcome to the game 1 vs 100!</h1>
            </div>

            <div>
                <Link to="/">
                    <button className="my-button">Single Player</button>
</Link>
</div>
</div>
)
     */
}

export default Menu