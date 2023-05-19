import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Service from '../API/Service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";

const EditHelmet = ({ showEditHelmetModal, closeEditHelmetModal, helmet, onUpdate }) => {
  const [workersWithoutHelmets, setWorkersWithoutHelmets] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workerId, setWorker] = useState(null);
  const [worker_name, setWorkerName] = useState('');
  const { t } = useTranslation();


  useEffect(() => {
    console.log("asdasda", helmet)
    if(helmet !== undefined) {
        Service.getHelmet(helmet)
        .then((response) => {
          console.log("asdasda asd ", response.data.worker_id)
          setName(response.data.name);
          setDescription(response.data.description);
          setWorker(response.data.worker_id);
  
          if(response.data.worker_id !== null) {
              Service.getWorker(response.data.worker_id)
              .then((response) => {
                  setWorkerName(response.data.name);
                  console.log("worker", response.data)
              })
              .catch((error) => {
                  notify(error.message);
                  console.log(error);
              });
          }
        })
        .catch((error) => {
          notify(error.message);
          console.log(error);
        });
    }
    
    fetchWorkersWithoutHelmets();
  }, [helmet]);

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

  function handleEditHelmetSubmit() {
    Service.updateHelmet(helmet, {name: name, description: description, worker_id: workerId})
    .then((response) => {
      console.log(response.message);
      
      notify(response.message);
      onUpdate(helmet, name, description, workerId);
      setName('');
      setDescription('');
      setWorkerName('');
      setWorker(null);
      closeEditHelmetModal();
      fetchWorkersWithoutHelmets();
    })
    .catch((error) => {
      notify(error.message);
      console.log(error);
    });
    
  }

  const handleCloseModal = () => {
    closeEditHelmetModal();
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
    <Modal show={showEditHelmetModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('edithelmetform')}</Modal.Title>
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
            <select
            id="worker"
            name="worker"
            className="form-control"
            value={workerId}
            onChange={handleWorkerChange}
            defaultValue={workerId}
            >
            {!workerId && (
                <option key={0} value={0}>
                {t('dontassign')}
                </option>
            )}
            {workerId && (
                <option key={workerId} value={workerId}>
                {worker_name + " " + workerId}
                </option>
                
            )}
            {workerId && (
                <option key={0} value={0}>
                {t('dontassign')}
                </option>
                
            )}
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
        <Button variant="primary" onClick={handleEditHelmetSubmit}>
        {t('submitbtn')}
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
};

export default EditHelmet;
