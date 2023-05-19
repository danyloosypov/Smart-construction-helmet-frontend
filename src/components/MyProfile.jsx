import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Service from '../API/Service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";

const MyProfile = ({ showProfileModal, closeProfileModal }) => {
  const [id, setId] = useState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { t } = useTranslation();


  useEffect(() => {
    Service.getMyProfile()
    .then(response => {
      console.log(response);
      
      setId(response.id);
      setName(response.name);
      setEmail(response.email);
    })
    .catch(error => {
      notify(error.message);
      console.log(error);
    });
  }, []);

  const notify = (message) => toast(message);

  function handleProfileSubmit() {
    Service.updateMyProfile(id, {name: name, email: email})
      .then(response => {
        console.log(response.message);
        closeProfileModal();
        notify(response.message)
      })
      .catch(error => {
        notify(error.message);
        console.log(error);
      });
  }

  return (
    <Modal show={showProfileModal} onHide={closeProfileModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('profileform')}</Modal.Title>
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
          <label htmlFor="email">{t('email')}:</label>
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeProfileModal}>
        {t('closebtn')}
        </Button>
        <Button variant="primary" onClick={handleProfileSubmit}>
        {t('submitbtn')}
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
};

export default MyProfile;
