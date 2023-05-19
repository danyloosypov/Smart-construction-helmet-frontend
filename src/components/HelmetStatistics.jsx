import React, { useState, useEffect, useRef } from 'react';
import Service from '../API/Service';
import { Form, FormControl, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import LineChart from './LineChart';
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Chart.register(CategoryScale);

const HelmetStatistics = ({helmet}) => {

    const [sensors, setSensors] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minValue, setMinValue] = useState('');
    const [selectedSensor, setSelectedSensor] = useState();
    const [maxValue, setMaxValue] = useState('');
    const [statistics, setStatistics] = useState([]);
    const { t } = useTranslation();

    const notify = (message) => toast(message);

    const fetchData = () => {
        const filters = {
          start_date: startDate,
          end_date: endDate,
          sensor_id: selectedSensor,
          helmet_id: helmet.id,
          min_value: minValue,
          max_value: maxValue,
        };
    
        Service.getStatistics(startDate, endDate, selectedSensor, helmet.id, minValue, maxValue)
          .then(response => {
            console.log("response", response);
              notify(response.message);
            setStatistics(response.data);
            console.log('Statistics: ' + selectedSensor + ' ' + helmet.id, response.data);
          })
          .catch(error => {
            // Handle the error
            notify(error.message);
            console.log(error);
          });
      };
    
      const handleFilterApply = () => {
        fetchData();
      };
    
      const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        setMinValue('');
        setMaxValue('');
    
        fetchData();
      };
    
    useEffect(() => {
        Service.getAllSensors()
        .then(response => {
          setSensors(response.data);
          console.log("sensors", response.data);
        })
        .catch(error => {
          notify(error.message);
          console.log(error);
        });

    }, []);

      
      
    const handleSensorChange = event => {
        const selectedSensorId = event.target.value;
        setSelectedSensor(selectedSensorId);
    };


    const chartData = {
        labels: statistics.map((data) => data.created_at),
        datasets: [
          {
            label: "Sensor Value",
            data: statistics.map((data) => data.sensor_value),
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 2,
          },
        ],
      };
    
      

  return (
    <div>
      {helmet && sensors && (
        <div>
            <Form className='mt-5'>
                <h1>{t('helmetinfo')}</h1>
              <Form.Group controlId="helmetName">
                <Form.Label>{t('helmetname')}</Form.Label>
                <Form.Control type="text" value={helmet.name} disabled />
              </Form.Group>
              <Form.Group controlId="helmetDescription">
                <Form.Label>{t('helmetdescription')}</Form.Label>
                <Form.Control type="text" value={helmet.description} disabled />
              </Form.Group>
              
            </Form>
            <h1 className='mt-4'>{t('statistics')}</h1>
            <div className="d-flex">
                <Form>
                    <Form.Group controlId="sensorSelect">
                        <Form.Label>{t('selectsensor')}</Form.Label>
                        <FormControl as="select" value={selectedSensor || ''} onChange={handleSensorChange}>
                            <option value="">{t('allsensors')}</option>
                            {sensors.map(sensor => (
                            <option key={sensor.id} value={sensor.id}>
                                {sensor.name}
                            </option>
                            ))}
                        </FormControl>
                    </Form.Group>
                    <Form.Group controlId="maxValue" className="mr-2">
                        <Form.Label>{t('maxvalue')}</Form.Label>
                        <Form.Control
                            type="text"
                            value={maxValue}
                            onChange={e => setMaxValue(e.target.value)}
                            size="sm"
                        />
                    </Form.Group>
                    <Form.Group controlId="minValue" className="mr-2">
                        <Form.Label>{t('minvalue')}</Form.Label>
                        <Form.Control
                        type="text"
                        value={minValue}
                        onChange={e => setMinValue(e.target.value)}
                        size="sm"
                        />
                    </Form.Group>
                    <Form.Group controlId="startDate" className="mr-2">
                        <Form.Label>{t('startdate')}</Form.Label>
                        <Form.Control
                        type="datetime-local"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        size="sm"
                        />
                    </Form.Group>
                    <Form.Group controlId="endDate" className="mr-2">
                        <Form.Label>{t('enddate')}</Form.Label>
                        <Form.Control
                        type="datetime-local"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        size="sm"
                        />
                    </Form.Group>
                    <Form.Group controlId="applyBtn">
                        <Form.Label>{t('apply')}</Form.Label>
                        <Form.Control
                        type="button"
                        value={t('apply')}
                        size="sm"
                        onClick={handleFilterApply}
                        />
                    </Form.Group>
                    <Form.Group controlId="resetBtn">
                        <Form.Label>{t('reset')}</Form.Label>
                        <Form.Control
                        type="button"
                        value={t('reset')}
                        size="sm"
                        onClick={resetFilters}
                        />
                    </Form.Group>
                </Form>
                
                <LineChart chartData={chartData} />
                
            </div>
        </div>
        )}
              <ToastContainer />
    </div>
  )
}

export default HelmetStatistics
