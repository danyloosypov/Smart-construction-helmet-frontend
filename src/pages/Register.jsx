import React from 'react'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import Service from '.././API/Service';
import  axios from '.././API/axios';
import { Link, useNavigate } from 'react-router-dom';
import useAuthContext from '../context/AuthContext';


function Register() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [password_confirmation, setPasswordConfirmation] = useState();
   // const navigate = useNavigate();
    const {register, errors} = useAuthContext();
    const csrf = () => axios.get('/sanctum/csrf-cookie');

    console.log(errors)

    useEffect(() => {
        if (errors.email) {
            notify(errors.email[0]);
        }

        if (errors.password) {
            notify(errors.password[0]);
        }

        if (errors.name) {
          notify(errors.name[0]);
        }
    }, [errors]);


    const handleRegister = async (event) => {
        event.preventDefault();
        register({name, email, password, password_confirmation});
    }


    const notify = (message) => toast(message);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="mb-4 text-center">Registration Form</h1>
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className="form-control" id="name" onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
                  <input type="password" className="form-control" id="password_confirmation" onChange={e => setPasswordConfirmation(e.target.value)} />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
                <p className="mb-0" style={{marginTop:'10px'}}>Already have an account? <Link to="/login">Login</Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Register
