import React, {useContext, useEffect, useState} from 'react';
import './Header.css'
import AuthContext from "./AuthContext.js";

function Header() {
    const { userToken } = useContext(AuthContext);

    // const [userToken, setUserToken] = useState(localStorage.getItem('user_token'));
    //
    //
    // useEffect(() => {
    //     // Обработчик события для обновления состояния при изменении localStorage
    //     const handleStorageChange = (event) => {
    //         if (event.key === 'user_token') {
    //             setUserToken(event.newValue); // Обновляем состояние с новым значением токена
    //         }
    //     };
    //
    //     // Привязываем обработчик события к window
    //     window.addEventListener('storage', handleStorageChange);
    //
    //     // Проверим значение при монтировании компонента
    //     const tokenFromLocalStorage = localStorage.getItem('user_token');
    //     //if (tokenFromLocalStorage !== userToken) {
    //         setUserToken(tokenFromLocalStorage);
    //     //}
    //
    //     // Очистка эффекта при размонтировании
    //     return () => {
    //         window.removeEventListener('storage', handleStorageChange);
    //     };
    // }, [userToken]);
    //
    // // const handleTokenChange = (newToken) => {
    // //     // Функция для установки нового токена
    // //     if (newToken) {
    // //         localStorage.setItem('user_token', newToken);
    // //     } else {
    // //         localStorage.removeItem('user_token'); // Используем removeItem для удаления
    // //     }
    // //     setUserToken(newToken); // Обновим состояние
    // // };
    //
    //
    //
    // // if (localStorage.getItem('user_token') != null) {
    if (userToken != null) {
        const url = 'http://localhost:8085/api/user/name?token=' + userToken
        var username
        fetch(url).then((response) => response.text()).then((text) => username = text)
        console.log("Token " + userToken)
        return (
            <header>
                <nav>
                    <ul>
                        <li id="main_page_link"><a href="/">1 vs 100</a></li>
                    </ul>
                </nav>
                <nav>
                    <ul>
                        <li>{username}</li>
                        <li><a href="/logout">Выйти</a></li>
                    </ul>
                </nav>
            </header>
        )
    } else {
        return (
            <header>
                <nav>
                    <ul>
                        <li id="main_page_link"><a href="/">1 vs 100</a></li>
                    </ul>
                </nav>
                <nav>
                    <ul>
                        <li><a href="/registration">Sign up</a></li>
                        <li><a href="/authorization">Sign in</a></li>
                    </ul>
                </nav>
            </header>
        )
    }
}

export default Header

window.addEventListener('storage', (event) => {
    // event.key: имя ключа, который изменился
    // event.newValue: новое значение ключа
    // event.oldValue: старое значение ключа
    // event.storageArea: хранилище, которое изменилось (localStorage или sessionStorage)

    if (event.key === 'myKey') { // Проверяем, изменился ли нужный ключ
        location.reload(); // Обновление страницы
    }
});