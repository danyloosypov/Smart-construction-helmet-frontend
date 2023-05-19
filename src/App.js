import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Greeting from './pages/Greeting';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Workers from './pages/Workers';
import ForgotPassword from './pages/ForgotPassword';
import Helmets from './pages/Helmets';
import Sensors from './pages/Sensors';
import Readings from './pages/Readings';
import { AuthProvider } from './context/AuthContext';
import { Suspense } from 'react';
import Loading from './components/Loading';
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import AuthLayout from './layouts/AuthLayout';
import GuestLayout from './layouts/GuestLayout';
import WorkerInfo from './pages/WorkerInfo';
import HelmetInfo from './pages/HelmetInfo';
import i18n from './i18n';
import LocaleContext from './LocaleContext';
import { useState } from 'react';

function App() {
  const [locale, setLocale] = useState(i18n.language);
  i18n.on('languageChanged', (lng) => setLocale(i18n.language));

  return (
    <BrowserRouter>
      <AuthProvider>
        <LocaleContext.Provider value={{locale, setLocale}}>
          <Routes>
            <Route element={<AuthLayout/>}>
              <Route path="/" element={<Greeting />}/>   
              <Route path="/workers" element={<Workers />}/> 
              <Route path="/helmets" element={<Helmets />}/> 
              <Route path="/sensors" element={<Sensors />}/> 
              <Route path="/readings" element={<Readings />}/> 
              <Route path="/worker/:id" element={<WorkerInfo />}/> 
              <Route path="/helmet/:id" element={<HelmetInfo />}/> 
            </Route>
            <Route element={<GuestLayout/>}>
              <Route path="/login" element={<Login />}></Route> 
              <Route path="/register" element={<Register />}></Route> 
              <Route path="/password-reset/:token" element={<ResetPassword />}></Route> 
              <Route path="/forgot-password" element={<ForgotPassword />}></Route> 
            </Route>
          </Routes>
        </LocaleContext.Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
