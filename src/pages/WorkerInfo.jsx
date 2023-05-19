import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Service from '../API/Service';
import { Form } from 'react-bootstrap';
import HelmetStatistics from '../components/HelmetStatistics';
import { useTranslation } from "react-i18next";
import MyMap from '../components/MyMap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const coordinates = {
  latitude: 49.959691,
  longitude: 36.3148342
}

const WorkerInfo = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [helmet, setHelmet] = useState(null);
  const notify = (message) => toast(message);

  
  const { t } = useTranslation();

  useEffect(() => {
    Service.getWorker(id)
      .then(response => {
        setWorker(response.data);
        console.log("worker", response.data);
      })
      .catch(error => {
        notify(error.message);
        console.log(error);
      });

      Service.getHelmetByWorkerId(id)
      .then(response => {
        setHelmet(response.data);
        
        console.log("helmet", response.data);
      })
      .catch(error => {
        notify(error.message);
        console.log(error);
      });

      


  }, [id]);

 

  return (
    <div className='container mt-5 mb-5'>
      <h1>{t('workerinfo')}</h1>
      {worker && (
        <Form>
          <Form.Group controlId="name">
            <Form.Label>{t('fullname')}</Form.Label>
            <Form.Control type="text" value={worker.name} disabled />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Label>{t('username')}</Form.Label>
            <Form.Control type="text" value={worker.username} disabled />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>{t('password')}</Form.Label>
            <Form.Control type="text" value={worker.password} disabled />
          </Form.Group>
          {helmet && (
            <div>
              <HelmetStatistics helmet={helmet} />
              <br />
              <br />
              <MyMap coordinates={coordinates} />
            </div>
            
          )}

          


        </Form>
      )}
            <ToastContainer />
    </div>
  );
};

export default WorkerInfo;
