import { createContext, useContext, useState } from "react";
import axios from "../API/axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const getUser = async () => {
        const {data} = await axios.get('/api/user');
        //console.log(data);
        setUser(data);
    }

    const login = async ({...data}) => {
        await csrf();

        try {
            await axios.post('/login', data);
            await getUser();
            navigate("/");
        } catch (error) {   
            if(error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
            console.log(error);
        }
    }

    const register = async ({...data}) => {
        await csrf();

        try {
            await axios.post('/register', data);
            await getUser();  
            navigate("/");
        } catch (error) {   
            if(error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
            console.log(error);
        }
    }

    const logout = () => {
        axios.post('/logout').then(() => {
            setUser(null);
        });
    }

    useEffect(() => {
        if(!user) {
            getUser();
        }
        
    }, []);



    return <AuthContext.Provider value={{user, errors, getUser, login, register, logout, csrf}}>
        {children}
    </AuthContext.Provider>

    
}

export default function useAuthContext() {
    return useContext(AuthContext);
}