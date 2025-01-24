import React from 'react';
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function Registration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    })

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        console.log('Данные формы:', formData); // Заменяйте на отправку на сервер

        try {
            const url = 'http://localhost:8085/api/user/registr'
            // var email = formData.email
            // var username = formData.username
            // var password = formData.password
            var query_body = JSON.stringify(formData)
            console.log("query_body", formData)
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: query_body
            })

            if (response.ok) {
                console.log("User ", formData, " is registered")
                navigate('/authorization')
            } else {
                const errorData = await response.json()
                console.log(errorData.message || 'Ошибка авторизации/регистрации')
            }
        } catch (error) {
            console.log('Произошла ошибка: ' + error.message)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Регистрация</h2>
            <div>
                <label htmlFor="username">Имя пользователя:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Пароль:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Зарегистрироваться</button>
        </form>
    );

}

export default Registration