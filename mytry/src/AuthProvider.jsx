import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';

function AuthProvider({ children }) {
    const [userToken, setUserToken] = useState(() => localStorage.getItem('user_token')); // Инициализация из localStorage

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'user_token') {
                setUserToken(event.newValue); // Обновление состояния при изменении в localStorage (из другой вкладки)
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const updateUserToken = (newToken) => {
        if (newToken) {
            localStorage.setItem('user_token', newToken);
        } else {
            localStorage.removeItem('user_token');
        }
        setUserToken(newToken); // Обновление локального состояния и Context
    };

    const authContextValue = {
        userToken: userToken,
        updateUserToken: updateUserToken,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
