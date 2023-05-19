import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthContext from "../context/AuthContext"
import  axios from '.././API/axios';
import { useEffect } from 'react';


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null);
    const [errors, setErrors] = useState([]);
    const {csrf} = useAuthContext();
    const notify = (message) => toast(message);

    useEffect(() => {
        if (errors.email) {
            notify(errors.email[0]);
        }

    }, [errors]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await csrf();
        setStatus(null);
        try {
            const response = await axios.post("/forgot-password", {email});
            setStatus(response.data.status);
        } catch (e) {
            if(e.response.status === 422) {
                setErrors(e.response.data.errors);
                console.log(e.response.data.errors);
            }
        }
    }


  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-6">
            <h1>Forgot password</h1>
            {status && <div className='alert alert-success'>{status}</div>}
            <form onSubmit={handleSubmit}>
                <hr />
                <br />
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" onChange={e => setEmail(e.target.value)} />
                </div>
                <br />
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
            <br />
            <p>Don't have an account? <Link to="/register">Register</Link></p>
            <p>Already have an account? <Link to="/login">Log in</Link></p>

            <ToastContainer />
        </div>
    </div>
  )
}

export default ForgotPassword;
