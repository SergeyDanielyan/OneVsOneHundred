import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import AuthContext from "./AuthContext.js";

function Logout() {
    const navigate = useNavigate();
    const { updateUserToken } = useContext(AuthContext);

    useEffect(() => { // Используйте хук useEffect
        localStorage.removeItem('user_token');
        updateUserToken(null)
        navigate("/");
    }, []);
}

export default Logout;