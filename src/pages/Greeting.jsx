import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import useAuthContext from '../context/AuthContext';
import { useTranslation } from "react-i18next";


function Greeting() {
    //const {user} = useAuthContext();
    const { t } = useTranslation();


    return (
        <div style={{margin: 'auto', height: '200px'}}>
            <h1 style={{textAlign: "center", paddingTop: "70px"}}>{t('welcome')}</h1>
            <p style={{color: 'lightgray', textAlign: "center"}}>{t('developed')}</p>
        </div>
    );
}

export default Greeting;
