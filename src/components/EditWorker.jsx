import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Service from '../API/Service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";

const EditWorker = ({ showEditWorkerModal, closeEditWorkerModal, worker, onUpdate }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (worker) {
      setName(worker.name);
      setUsername(worker.username);
      setPassword(worker.password);
    }
  }, [worker]);

  const notify = (message) => toast(message);

  function handleEditWorkerSubmit() {
    Service.updateWorker(worker.id, {name: name, username: username, password: password})
      .then(response => {
        console.log(response.message);
        onUpdate(worker.id, name, username, password);
        setName('');
        setUsername('');
        setPassword('');
        
        closeEditWorkerModal();
        notify(response.message)
      })
      .catch(error => {
        notify(error.message);
        console.log(error);
      });
  }

  return (
    <Modal show={showEditWorkerModal} onHide={closeEditWorkerModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('editworkerform')}</Modal.Title>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeEditWorkerModal}>
        {t('closebtn')}
        </Button>
        <Button variant="primary" onClick={handleEditWorkerSubmit}>
        {t('submitbtn')}
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
};

export default EditWorker;
