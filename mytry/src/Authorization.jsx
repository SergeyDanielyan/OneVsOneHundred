import React, {useContext} from 'react';
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import AuthContext from "./AuthContext.js";

function Authorization() {
    const navigate = useNavigate();
    const { updateUserToken } = useContext(AuthContext);
    const [formData, setFormData] = useState({
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
            const url = 'http://localhost:8085/api/user/auth'
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
                console.log("User ", formData, " is authorized")
                //var token = response.text()
                var token = await response.text()
                console.log("Token: " + token)

                localStorage.setItem("user_token", token)
                updateUserToken(token)
                navigate('/')
            } else {
                const errorData = await response.text()
                console.log(errorData || 'Ошибка авторизации/регистрации')
            }
        } catch (error) {
            console.log('Произошла ошибка: ' + error.message)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Авторизация</h2>
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
            <button type="submit">Войти</button>
        </form>
    );
}

export default Authorization