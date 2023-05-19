import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Service from '../API/Service';
import HelmetStatistics from '../components/HelmetStatistics'
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HelmetInfo = () => {
    const { id } = useParams();
    const [helmet, setHelmet] = useState(null);
    const { t } = useTranslation();
    const notify = (message) => toast(message);

    useEffect(() => {
        Service.getHelmet(id)
          .then(response => {
            setHelmet(response.data);
          })
          .catch(error => {
            notify(error.message);
            console.log(error);
          });
    
      }, [id]);

  return (
    <div className='container mt-5'>
      <HelmetStatistics helmet={helmet} />
      <ToastContainer />
    </div>
  )
}

export default HelmetInfo
