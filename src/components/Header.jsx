import React, { useState } from 'react';
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { Navigate, Outlet, Link } from "react-router-dom"
import useAuthContext from "../context/AuthContext"
import Service from '../API/Service';
import ExcelUploadModal from './ExcelUploadModal';
import Sensor from '../components/Sensor';
import MyProfile from './MyProfile';
import AddWorker from './AddWorker';
import AddHelmet from './AddHelmet';

import { useContext } from 'react';
import LocaleContext from "../LocaleContext";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";

const Header = () => {

  const {user, logout} = useAuthContext();
  const [modalType, setModalType] = useState('');
  const [showImportModal, setshowImportModal] = useState(false);
  const [showSensorModal, setshowSensorModal] = useState(false);
  
  const [showAddWorkerModal, setshowAddWorkerModal] = useState(false);
  const [showAddHelmetModal, setshowAddHelmetModal] = useState(false);

  const [showProfileModal, setshowProfileModal] = useState(false);

  
  const { locale } = useContext(LocaleContext);
  const { t } = useTranslation();

  function changeLocale (l) {
    if (locale !== l) {
      i18n.changeLanguage(l);
    }
  }


  function handleWorkersExport() {
    Service.exportWorkers()
        .then(response => {
          console.log(response)
    })
    .catch(error => {
        console.log(error);
    });
  }

  function handleHelmetsExport() {
    Service.exportHelmets()
        .then(response => {
          console.log(response)
    })
    .catch(error => {
        console.log(error);
    });
  }

  function handleSensorsExport() {
    Service.exportSensors()
        .then(response => {
          console.log(response)
    })
    .catch(error => {
        console.log(error);
    });
  }

  function handleReadingsExport() {
    Service.exportReadings()
        .then(response => {
          console.log(response)
    })
    .catch(error => {
        console.log(error);
    });

  }


  function openImportModal(type) {
    setModalType(type);
    setshowImportModal(true);
  }

  function closeImportModal() {
    setshowImportModal(false);
  }

  function openSensorModal() {
    setshowSensorModal(true);
  }

  function closeSensorModal() {
    setshowSensorModal(false);
  }

  function openAddWorkerModal() {
    setshowAddWorkerModal(true);
  }

  function closeAddWorkerModal() {
    setshowAddWorkerModal(false);
  }

  function openAddHelmetModal() {
    setshowAddHelmetModal(true);
  }

  function closeAddHelmetModal() {
    setshowAddHelmetModal(false);
  }

  function openProfileModal() {
    setshowProfileModal(true);
  }

  function closeProfileModal() {
    setshowProfileModal(false);
  }
  
  
  return (
    <div>
      <Navbar bg="light" style={{ width: '100%' }} expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">OBVIOUS CONTROL</Navbar.Brand>
          <Nav>
            <NavDropdown title={t('workers')} id="workers" style={{ marginRight: '30px', fontSize: '20px' }}>
              <NavDropdown.Item as={Link} to="/workers">{t('workers')}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} onClick={() => openAddWorkerModal()} to="#">{t('addworker')}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} onClick={handleWorkersExport} to="#">{t('exportWorkers')}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} onClick={() => openImportModal('workers')} to="#">{t('importWorkers')}</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={t('helmets')} id="helmets" style={{ marginRight: '30px', fontSize: '20px' }}>
              <NavDropdown.Item as={Link} to="/helmets">{t('helmets')}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} onClick={() => openAddHelmetModal()} to="#">{t('addhelmet')}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} onClick={handleHelmetsExport} to="#">{t('exporthelmets')}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} onClick={() => openImportModal('helmets')} to="#">{t('importhelmets')}</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={t('sensors')} id="sensors" style={{ marginRight: '30px', fontSize: '20px' }}>
              <NavDropdown.Item as={Link} to="/sensors">{t('sensors')}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} onClick={() => openSensorModal()} to="#">{t('addsensor')}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} onClick={handleSensorsExport} to="#">{t('exportsensors')}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} onClick={() => openImportModal('sensors')} to="#">{t('importsensors')}</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={t('readings')} id="readings" style={{ marginRight: '30px', fontSize: '20px' }}>
              <NavDropdown.Item as={Link} to="/readings">{t('readings')}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} onClick={handleReadingsExport} to="#">{t('exportreadings')}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} onClick={() => openImportModal('readings')} to="#">{t('importreadings')}</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} onClick={() => openProfileModal()} to="#" style={{marginRight: '30px', fontSize: '20px'}}>{t('myprofile')}</Nav.Link>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <NavDropdown title={t('language')} id="basic-nav-dropdown">
                  <NavDropdown.Item href="#" onClick={() => changeLocale('en')}>EN</NavDropdown.Item>
                  <NavDropdown.Item href="#" onClick={() => changeLocale('ua')}>UA</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Nav>
          <Button variant="outline-success" onClick={logout}>{t('logout')}</Button>
        </Container>
        <AddHelmet showAddHelmetModal={showAddHelmetModal} closeAddHelmetModal={closeAddHelmetModal} />
        <AddWorker showAddWorkerModal={showAddWorkerModal} closeAddWorkerModal={closeAddWorkerModal} />
        <MyProfile showProfileModal={showProfileModal} closeProfileModal={closeProfileModal} />
        <Sensor showSensorModal={showSensorModal} closeSensorModal={closeSensorModal} />
        <ExcelUploadModal showImportModal={showImportModal} closeImportModal={closeImportModal} modalType={modalType} />
      </Navbar>
      
    </div>
  )
}

export default Header
