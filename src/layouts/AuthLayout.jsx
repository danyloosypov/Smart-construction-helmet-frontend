import { Navigate, Outlet, Link } from "react-router-dom"
import useAuthContext from "../context/AuthContext"
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import Header from "../components/Header";

const AuthLayout = () => {
    const {user, logout} = useAuthContext();
  return  user ? (<div>
      <Header/>
      <Outlet/>
  </div> ) : (<Navigate to="/login"/>)

  
  
}

export default AuthLayout
