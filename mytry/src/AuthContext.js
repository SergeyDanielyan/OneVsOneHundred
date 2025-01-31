import { createContext } from 'react';

const AuthContext = createContext({
    userToken: null,
    updateUserToken: (token) => {}, // Пустая функция для обновления токена (будет переопределена в Provider)
});

export default AuthContext;