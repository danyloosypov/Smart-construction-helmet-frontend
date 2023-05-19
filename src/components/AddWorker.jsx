import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Service from '../API/Service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";

const AddWorker = ({ showAddWorkerModal, closeAddWorkerModal }) => {
  const [helmetsWithoutWorkers, setHelmetsWithoutWorkers] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [helmetId, setHelmet] = useState('');

  const { t } = useTranslation();

  useEffect(() => {
    fetchHelmetsWithoutWorkers();
  }, []);

  const fetchHelmetsWithoutWorkers = () => {
    Service.getHelmetsWithoutWorkers()
      .then((response) => {
        console.log(response);
        setHelmetsWithoutWorkers(response.data);
      })
      .catch((error) => {
        notify(error.message);
        console.log(error);
      });
  };

  const notify = (message) => toast(message);

  function handleAddWorkerSubmit() {
    Service.addWorker({name: name, username: username, password: password})
    .then((response) => {
      console.log(response.message);
      const workerId = response.data.id; // Get the ID of the newly created worker
      
      notify(response.message);

      if (helmetId !== '') {
        Service.setHelmetWorker(workerId, helmetId)
          .then((response) => {
            notify(response.message);
            console.log(response);
          })
          .catch((error) => {
            notify(error.message);
            console.log(error);
          });
      }
      setName('');
      setUsername('');
      setPassword('');
      setHelmet('');
      closeAddWorkerModal();
      fetchHelmetsWithoutWorkers();
    })
    .catch((error) => {
      notify(error.message);
      console.log(error);
    });
    
  }

  const handleCloseModal = () => {
    closeAddWorkerModal();
    fetchHelmetsWithoutWorkers(); // Fetch helmetsWithoutWorkers again after modal is closed
  };
  
  const handleHelmetChange = (event) => {
    setHelmet(event.target.value);
  };

  return (
    <Modal show={showAddWorkerModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('workerform')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label htmlFor="name">{t('fullname')}:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">{t('username')}:</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">{t('password')}:</label>
          <input
            type="text"
            className="form-control"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
            <label htmlFor="helmet">{t('helmet')}</label>
            <select id="helmet" name="helmet" className="form-control" value={helmetId} onChange={handleHelmetChange}>
                <option key={0} value={0}>{t('dontassign')}</option>
                {helmetsWithoutWorkers && helmetsWithoutWorkers.map(helmet => (
                <option key={helmet.id} value={helmet.id}>{helmet.name + " " + helmet.id}</option>
                ))}
            </select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
        {t('closebtn')}
        </Button>
        <Button variant="primary" onClick={handleAddWorkerSubmit}>
        {t('submitbtn')}
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
};

export default AddWorker;
