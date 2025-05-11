import {createContext} from 'react';

const AuthContext = createContext({
    userToken: null,
    updateUserToken: (token) => {
    },
});

export default AuthContext;