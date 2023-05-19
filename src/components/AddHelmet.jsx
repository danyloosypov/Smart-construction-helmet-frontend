import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Service from '../API/Service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";

const AddHelmet = ({ showAddHelmetModal, closeAddHelmetModal }) => {
  const [workersWithoutHelmets, setWorkersWithoutHelmets] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workerId, setWorker] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    fetchWorkersWithoutHelmets();
  }, []);

  const fetchWorkersWithoutHelmets = () => {
    Service.getWorkersWithoutHelmets()
      .then((response) => {
        console.log(response);
        setWorkersWithoutHelmets(response.data);
      })
      .catch((error) => {
        notify(error.message);
        console.log(error);
      });
  };

  const notify = (message) => toast(message);

  function handleAddHelmetSubmit() {
    Service.addHelmet({name: name, description: description, worker_id: workerId})
    .then((response) => {
      console.log(response.message);
      
      notify(response.message);

      setName('');
      setDescription('');
      setWorker(null);
      closeAddHelmetModal();
      fetchWorkersWithoutHelmets();
    })
    .catch((error) => {
      notify(error.message);
      console.log(error);
    });
    
  }

  const handleCloseModal = () => {
    closeAddHelmetModal();
    fetchWorkersWithoutHelmets(); // Fetch helmetsWithoutWorkers again after modal is closed
  };
  
  const handleWorkerChange = (event) => {
    if(event.target.value != 0) {
      setWorker(parseInt(event.target.value, 10));
    } else {
      setWorker(null);
    }
    

  };

  return (
    <Modal show={showAddHelmetModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('helmetform')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label htmlFor="name">{t('helmetname')}:</label>
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
          <label htmlFor="description">{t('helmetdescription')}:</label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
            <label htmlFor="worker">{t('worker')}</label>
            <select id="worker" name="worker" className="form-control" value={workerId} onChange={handleWorkerChange}>
                <option key={0} value={0}>{t('dontassign')}</option>
                {workersWithoutHelmets && workersWithoutHelmets.map(worker => (
                <option key={worker.id} value={worker.id}>{worker.name + " " + worker.id}</option>
                ))}
            </select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
        {t('closebtn')}
        </Button>
        <Button variant="primary" onClick={handleAddHelmetSubmit}>
        {t('submitbtn')}
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
};

export default AddHelmet;
