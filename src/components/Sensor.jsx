import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Service from '../API/Service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useTranslation } from "react-i18next";

const Sensor = ({ showSensorModal, closeSensorModal }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { t } = useTranslation();

  const notify = (message) => toast(message);

  function handleSensorSubmit() {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    Service.addSensor(formData)
    .then(response => {
      
      console.log(response.message);
      setName('');
      setDescription('');
      closeSensorModal();
      notify(response.message)
    })
    .catch(error => {
      notify(error);
      console.log(error);
    });
    
    
  }

  return (
    <Modal show={showSensorModal} onHide={closeSensorModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('sensorform')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="form-group">
        <label htmlFor="name">{t('sensorname')}:</label>
        <input type="text" className="form-control" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="description">{t('sensordescription')}:</label>
        <input type="text" className="form-control" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeSensorModal}>
        {t('closebtn')}
        </Button>
        <Button variant="primary" onClick={handleSensorSubmit}>
        {t('submitbtn')}
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  )
}

export default Sensor
