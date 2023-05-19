import React from 'react'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import Service from '.././API/Service';
import  axios from '.././API/axios';
import { Link, useNavigate } from 'react-router-dom';
import useAuthContext from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    //const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const {login, errors} = useAuthContext();
    const notify = (message) => toast(message);

    useEffect(() => {
        if (errors.email) {
            notify(errors.email[0]);
        }

        if (errors.password) {
            notify(errors.password[0]);
        }
    }, [errors]);

    const handleLogin = async (event) => {
        event.preventDefault();
        login({email, password});
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="border p-5">
                        <h1 className="mb-4">Please Log In</h1>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" onChange={e => setEmail(e.target.value)} />
                            </div>
                            <br />
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" onChange={e => setPassword(e.target.value)} />
                            </div>
                            <br />
                            <div className="d-flex justify-content-between align-items-center">
                                <button type="submit" className="btn btn-primary">Submit</button>
                                <p className="mb-0">Don't have an account? <Link to="/register">Register</Link></p>
                            </div>
                        </form>
                        <p> <Link to="/forgot-password">Forgot password?</Link></p>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login
