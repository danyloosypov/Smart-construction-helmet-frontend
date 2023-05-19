import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuthContext from "../context/AuthContext"
import  axios from '.././API/axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState([]);
  const { csrf } = useAuthContext();
  const { token } = useParams();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    setEmail(searchParams.get("email"));
    console.log(email);
  }, []);

  const notify = (message) => toast(message);

  useEffect(() => {
    if (errors.password) {
        notify(errors.password[0]);
    }

  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await csrf();
    setStatus(null);
    try {
      const response = await axios.post("/reset-password", {
        email,
        token,
        password,
        password_confirmation,
      });
      setStatus(response.data.status);
    } catch (e) {
      if(e.response.status === 422) {
        setErrors(e.response.data.errors);
        console.log(e.response.data.errors);
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h1 className="text-center mb-4">Reset password</h1>
          {status && (
            <div className="alert alert-success">
              {status}
              <Link to="/login" className="ms-3">
                Login
              </Link>
            </div>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPasswordConfirmation">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={password_confirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          <ToastContainer />
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
