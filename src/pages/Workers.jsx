import React from 'react'
import Service from '../API/Service';
import { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditWorker from '../components/EditWorker';

import { useTranslation } from "react-i18next";



function Workers() {



  const notify = (message) => toast(message);
  const { t } = useTranslation();


  const [workers, setWorkers] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [isHeaderCheckboxChecked, setIsHeaderCheckboxChecked] = useState(false);

  const [showEditWorkerModal, setshowWorkerModal] = useState(false);
  const [editWorker, setEditWorker] = useState();

  function openEditWorkerModal(worker) {
    setEditWorker(worker);
    setshowWorkerModal(true);
  }

  function closeEditWorkerModal() {
    setshowWorkerModal(false);
  }

  const handleSelectWorker = (id) => {
    if (selectedWorkers.includes(id)) {
      setSelectedWorkers(selectedWorkers.filter((workerId) => workerId !== id));
      setIsHeaderCheckboxChecked(false);
    } else {
      setSelectedWorkers([...selectedWorkers, id]);
      setIsHeaderCheckboxChecked(selectedWorkers.length + 1 === workers.length);
    }
  };

  const handleSelectAll = (event) => {
    setSelectedWorkers(
      event.target.checked ? workers.map((worker) => worker.id) : []
    );
    setIsHeaderCheckboxChecked(event.target.checked);
  };
  
  const handleDeleteSelected = () => {
    if (window.confirm("Are you sure you want to delete the selected workers?")) {
      Promise.all(selectedWorkers.map((id) => deleteWorker(id)))
      .then(() => {
        setSelectedWorkers([]);
        setIsHeaderCheckboxChecked(false);
      })
      .catch((error) => {
        notify(error);
        console.log(error);
      });
    }
  };

  function updateWorker(id, name, username, password) {
    setWorkers(prevWorkers => {
      const index = prevWorkers.findIndex(worker => worker.id === id);
      const newWorkers = [...prevWorkers];
      newWorkers[index] = {
        ...newWorkers[index],
        name: name,
        username: username,
        password: password
      };
      return newWorkers;
    });
  }

  
  

  useEffect(() => {
    Service.getWorkers(currentPage)
      .then(response => {
        setWorkers(response.data.data);
        setLastPage(response.data.last_page);
        console.log("workers", response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [currentPage]);
  

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  function deleteWorker(id) {
    Service.deleteWorker(id)
    .then(response => {
      if(response.status === "success") {
        const index = workers.findIndex(worker => worker.id === id);
        workers.splice(index, 1);
        setWorkers([...workers]);
        console.log(response.message);
        notify(response.message);
        console.log(id);
      } else {
        console.log(response.message);
        notify(response.message);
      }
    })
    .catch(error => {
      notify(error.message)
      console.log(error);
    });   
  }

  return (
    <div className='container mt-5'>
      <h1>{t('workers')}</h1>
      <Button variant="danger" disabled={selectedWorkers.length === 0} onClick={handleDeleteSelected} style={{ marginBottom: '10px' }}>{t('deleteselected')}</Button>
      <Table striped bordered hover className='mt-3'>
        <thead>
          <tr>
            <th><input
                type='checkbox'
                checked={isHeaderCheckboxChecked}
                onChange={handleSelectAll}
              /></th>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker.id}>
              <td><input
                  type='checkbox'
                  checked={selectedWorkers.includes(worker.id)}
                  onChange={() => handleSelectWorker(worker.id)}
                /></td>
              <td>{worker.id}</td>
              <td>{worker.name}</td>
              <td>{worker.username}</td>
              <td>{worker.password}</td>
              <td style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="danger" onClick={() => deleteWorker(worker.id)} style={{marginRight:'10px'}}>{t('deletebtn')}</Button>{' '}
                <Link to="#" onClick={() => openEditWorkerModal(worker)} style={{marginRight:'10px'}}>
                  <Button variant="warning">{t('editbtn')}</Button>
                </Link>
                <Link to={`/worker/${worker.id}`}>
                  <Button variant="primary">{t('moreinfobtn')}</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {Array.from({ length: lastPage }, (_, i) => i + 1).map(page => (
          <Button key={page} variant="outline-primary" style={{ marginRight:'10px' }} onClick={() => handlePageChange(page)}>
            {page === currentPage ? <strong>{page}</strong> : page}
          </Button>
        ))}
      </div>

      



      <EditWorker
        showEditWorkerModal={showEditWorkerModal} 
        closeEditWorkerModal={closeEditWorkerModal}
        worker={editWorker}
        onUpdate={updateWorker}
      />


      <ToastContainer />
    </div>
  );
}

export default Workers
