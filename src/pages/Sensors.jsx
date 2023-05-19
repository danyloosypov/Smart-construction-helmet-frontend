import React from 'react'
import Service from '../API/Service';
import { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditSensorModal from '../components/EditSensorModal';
import { useTranslation } from "react-i18next";

function Sensors() {
  const notify = (message) => toast(message);

  const { t } = useTranslation();

  const [sensors, setSensors] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedSensors, setselectedSensors] = useState([]);
  const [isHeaderCheckboxChecked, setIsHeaderCheckboxChecked] = useState(false);

  const [showSensorModal, setshowSensorModal] = useState(false);
  const [editSensor, setEditSensor] = useState();

  function openSensorModal(sensor) {
    setEditSensor(sensor);
    setshowSensorModal(true);
  }

  function closeSensorModal() {
    setshowSensorModal(false);
  }

  const handleSelectSensor = (id) => {
    if (selectedSensors.includes(id)) {
      setselectedSensors(selectedSensors.filter((sensorId) => sensorId !== id));
      setIsHeaderCheckboxChecked(false);
    } else {
      setselectedSensors([...selectedSensors, id]);
      setIsHeaderCheckboxChecked(selectedSensors.length + 1 === sensors.length);
    }
  };

  const handleSelectAll = (event) => {
    setselectedSensors(
      event.target.checked ? sensors.map((sensor) => sensor.id) : []
    );
    setIsHeaderCheckboxChecked(event.target.checked);
  };
  
  const handleDeleteSelected = () => {
    if (window.confirm("Are you sure you want to delete the selected sensors?")) {
      Promise.all(selectedSensors.map((id) => deleteSensor(id)))
      .then(() => {
        setselectedSensors([]);
        setIsHeaderCheckboxChecked(false);
      })
      .catch((error) => {
        notify(error);
        console.log(error);
      });
    }
  };


  function updateSensor(id, name, description) {
    setSensors(prevSensors => {
      const index = prevSensors.findIndex(sensor => sensor.id === id);
      const newSensors = [...prevSensors];
      newSensors[index] = {
        ...newSensors[index],
        name: name,
        description: description
      };
      return newSensors;
    });
  }
  


  useEffect(() => {
    Service.getSensors(currentPage)
    .then(response => {
      setSensors(response.data.data);
      setLastPage(response.data.last_page);
      console.log("sensors", response.data.data);
    })
    .catch(error => {
      console.log(error);
    });
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  function deleteSensor(id) {
    Service.deleteSensor(id)
    .then(response => {
      if(response.status === "success") {
        const index = sensors.findIndex(sensor => sensor.id === id);
        sensors.splice(index, 1);
        setSensors([...sensors]);
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
      <h1>{t('sensors')}</h1>
      <Button variant="danger" disabled={selectedSensors.length === 0} onClick={handleDeleteSelected} style={{ marginBottom: '10px' }}>{t('deleteselected')}</Button>
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
            <th>description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((sensor) => (
            <tr key={sensor.id}>
              <td><input
                  type='checkbox'
                  checked={selectedSensors.includes(sensor.id)}
                  onChange={() => handleSelectSensor(sensor.id)}
                /></td>
              <td>{sensor.id}</td>
              <td>{sensor.name}</td>
              <td>{sensor.description}</td>
              <td style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="danger" onClick={() => deleteSensor(sensor.id)} style={{marginRight:'10px'}}>{t('deletebtn')}</Button>{' '}
                <Link to="#" onClick={() => openSensorModal(sensor)} style={{marginRight:'10px'}}>
                  <Button variant="warning">{t('editbtn')}</Button>
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

      <EditSensorModal
        showSensorModal={showSensorModal} 
        closeSensorModal={closeSensorModal}
        sensor={editSensor}
        onUpdate={updateSensor}
      />


      <ToastContainer />

    </div>
  );
}

export default Sensors
