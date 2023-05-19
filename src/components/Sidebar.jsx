import React, {useEffect, useState} from 'react'
import Service from '../API/Service';
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = ({ onFilterChange }) => 
{
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sensors, setSensors] = useState([]);
  const [helmets, setHelmets] = useState([]);
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [selectedHelmets, setSelectedHelmets] = useState([]);
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const { t } = useTranslation();
  const notify = (message) => toast(message);

  const handleSelectSensor = (id) => {
    if (selectedSensors.includes(id)) {
      setSelectedSensors(selectedSensors.filter((sensorId) => sensorId !== id));
    } else {
      setSelectedSensors([...selectedSensors, id]);
    }
  };

  const handleSelectHelmet = (id) => {
    if (selectedHelmets.includes(id)) {
      setSelectedHelmets(selectedHelmets.filter((helmetId) => helmetId !== id));
    } else {
      setSelectedHelmets([...selectedHelmets, id]);
    }
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

    Service.getAllHelmets()
    .then(response => {
      setHelmets(response.data);
      console.log("helmets", response.data);
    })
    .catch(error => {
      notify(error.message);
      console.log(error);
    });
  }, []);

  const handleFilterApply = () => {
    const filters = {
      start_date: startDate,
      end_date: endDate,
      sensor_id: selectedSensors,
      helmet_id: selectedHelmets,
      minValue: minValue,
      maxValue: maxValue,
    };

    // Pass the filters to the parent component
    onFilterChange(filters);
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedSensors([]);
    setSelectedHelmets([]);
    setMinValue('');
    setMaxValue('');

    const filters = {
      start_date: startDate,
      end_date: endDate,
      sensor_id: selectedSensors,
      helmet_id: selectedHelmets,
      minValue: minValue,
      maxValue: maxValue,
    };

    // Pass the filters to the parent component
    onFilterChange(filters);

  };
  

  return (
    <div className="sidebar bg-light p-4" style={{ width: '20%', height: '100%', minHeight: '100vh'  }}>
      <h2>{t('filters')}</h2>
      <br />
      <div className="form-group">
        <label htmlFor="startdate">{t('startdate')}:</label>
        <input type="datetime-local" id="startdate" name="startdate" className="form-control" value={startDate}
          onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <br />
      <div className="form-group">
        <label htmlFor="enddate">{t('enddate')}:</label>
        <input type="datetime-local" id="enddate" name="enddate" className="form-control" value={endDate}
          onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <br />
      <div className="form-group">
        <label htmlFor="">{t('sensors')}:</label>
        <br />
        {sensors && sensors.map((sensor) => (
          <React.Fragment key={sensor.id}>
            <input type="checkbox" name={sensor.name} id={sensor.id} checked={selectedSensors.includes(sensor.id)}
              onChange={() => handleSelectSensor(sensor.id)} /> {sensor.name}
            <br />
          </React.Fragment>
        ))}
      </div>
      <br />
      <div className="form-group">
        <label htmlFor="">{t('helmets')}:</label>
        <br />
        {helmets && helmets.map((helmet) => (
          <React.Fragment key={helmet.id}>
            <input type="checkbox" name={helmet.name} id={helmet.id} checked={selectedHelmets.includes(helmet.id)}
              onChange={() => handleSelectHelmet(helmet.id)} /> {helmet.name + " " + helmet.id}
            <br />
          </React.Fragment>
        ))}
      </div>
      <br />
      <div className="form-group">
        <label htmlFor="search">{t('minvalue')}:</label>
        <input type="text" id="mivValue" name="minValue" className="form-control" placeholder="Min. Value" value={minValue}
          onChange={(e) => setMinValue(e.target.value)} />
      </div>
      <br />
      <div className="form-group">
        <label htmlFor="maxValue">{t('maxvalue')}:</label>
        <input type="text" id="maxValue" name="maxValue" className="form-control" placeholder="Max Value" value={maxValue}
          onChange={(e) => setMaxValue(e.target.value)} />
      </div>
      <br />
      <button type="button" className="btn btn-primary" onClick={handleFilterApply}>{t('apply')}</button>
      <br />
      <br />
      <button type="button" className="btn btn-danger" onClick={resetFilters}>{t('reset')}</button>
      <ToastContainer />

    </div>
  );
};

export default Sidebar;
