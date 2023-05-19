import React from 'react'
import Service from '../API/Service';
import { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "axios";
import Sidebar from '../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";

function Readings() {
  const notify = (message) => toast(message);

  const [readings, setReadings] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [sensors, setSensors] = useState([]);
  const [helmets, setHelmets] = useState([]);
  const { t } = useTranslation();

  const [selectedReadings, setselectedReadings] = useState([]);
  const [isHeaderCheckboxChecked, setIsHeaderCheckboxChecked] = useState(false);

  const handleSelectReading = (id) => {
    if (selectedReadings.includes(id)) {
      setselectedReadings(selectedReadings.filter((readingId) => readingId !== id));
      setIsHeaderCheckboxChecked(false);
    } else {
      setselectedReadings([...selectedReadings, id]);
      setIsHeaderCheckboxChecked(selectedReadings.length + 1 === readings.length);
    }
  };

  const handleSelectAll = (event) => {
    setselectedReadings(
      event.target.checked ? readings.map((reading) => reading.id) : []
    );
    setIsHeaderCheckboxChecked(event.target.checked);
  };
  
  const handleDeleteSelected = () => {
    if (window.confirm("Are you sure you want to delete the selected readings?")) {
      Promise.all(selectedReadings.map((id) => deleteReading(id)))
      .then(() => {
        setselectedReadings([]);
        setIsHeaderCheckboxChecked(false);
      })
      .catch((error) => {
        notify(error);
        console.log(error);
      });
    }
  };

  function deleteReading(id) {
    Service.deleteReading(id)
    .then(response => {
      if(response.status === "success") {
        const index = readings.findIndex(reading => reading.id === id);
        readings.splice(index, 1);
        setReadings([...readings]);
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


  useEffect(() => {
      Service.getReadings(currentPage, filters)
      .then(response => {
        setReadings(response.data.data);
        setLastPage(response.data.last_page);
        console.log("readings", response.data)
      })
      .catch(error => {
        console.log(error);
      });

      Service.getAllSensors()
      .then(response => {
        setSensors(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  
      Service.getAllHelmets()
      .then(response => {
        setHelmets(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [currentPage, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filters) => {
    setFilters(filters); // Update the filters state
    console.log(filters);
  };


  return (
    <div className='d-flex'>
      <Sidebar onFilterChange={handleFilterChange}/>
      <div className='container mt-5' style={{ width: '80%' }}>
        <h1>{t('readings')}</h1>
        <Button variant="danger" disabled={selectedReadings.length === 0} onClick={handleDeleteSelected} style={{ marginBottom: '10px' }}>Delete Selected</Button>
        <Table striped bordered hover className='mt-3'>
          <thead>
            <tr>
              <th><input
                type='checkbox'
                checked={isHeaderCheckboxChecked}
                onChange={handleSelectAll}
              /></th>
              <th>ID</th>
              <th>Value</th>
              <th>Sensor</th>
              <th>Helmet</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => (
              <tr key={reading.id}>
                <td><input
                  type='checkbox'
                  checked={selectedReadings.includes(reading.id)}
                  onChange={() => handleSelectReading(reading.id)}
                /></td>
                <td>{reading.id}</td>
                <td>{reading.sensor_value}</td>
                <td>{sensors.find(sensor => sensor.id === reading.sensor_id)?.name}</td>
                <td>{helmets.find(helmet => helmet.id === reading.helmet_id)?.name + " " + reading.helmet_id}</td>
                <td>{reading.created_at}</td>
                <td style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button variant="danger" onClick={() => deleteReading(reading.id)} style={{marginRight:'10px'}}>{t('deletebtn')}</Button>{' '}
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


      </div>
      <ToastContainer />
    </div>
    
  );
}

export default Readings
