import React from 'react';
import './Header.css'

function Header() {
    if (localStorage.getItem('token') != null) {
        const url = 'http://localhost:8085/api/user/name?token=' + localStorage.getItem('token')
        var username
        fetch(url).then((response) => response.text()).then((text) => username = text)
        console.log("Token " + localStorage.getItem('token'))
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