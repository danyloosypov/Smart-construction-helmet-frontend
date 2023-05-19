import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Service from '../API/Service';
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ExcelUploadModal({ showImportModal, closeImportModal, modalType }) {
  const [file, setFile] = useState(null);
  const { t } = useTranslation();

  const notify = (message) => toast(message);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function handleUpload() {
    if (file) {
      handleFileUpload(file);
      setFile(null);
      closeImportModal();
    }
  }

  function handleFileUpload(file) {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      if(modalType === 'workers') {
        Service.importWorkers(formData)
        .then(response => {
          console.log(response);
          notify(response.message);
            setFile(null);
            closeImportModal();
        })
        .catch(error => {
          notify(error.message);
            console.log(error);
        });
      } else if(modalType === 'helmets') {
        Service.importHelmets(formData)
        .then(response => {
          console.log(response);
          notify(response.message);
            setFile(null);
            closeImportModal();
        })
        .catch(error => {
          notify(error.message);
            console.log(error);
        });
      } else if(modalType === 'sensors') {
        Service.importSensors(formData)
        .then(response => {
          console.log(response);
          notify(response.message);
            setFile(null);
            closeImportModal();
        })
        .catch(error => {
            console.log(error);
        });
      } else if(modalType === 'readings') {
        Service.importReadings(formData)
        .then(response => {
          console.log(response);
          notify(response.message);
            setFile(null);
            closeImportModal();
        })
        .catch(error => {
          notify(error.message);
            console.log(error);
        });
      }
    }
  }

  return (
    <Modal show={showImportModal} onHide={closeImportModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('uploadexcelfile')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3>{modalType}</h3>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeImportModal}>
        {t('closebtn')}
        </Button>
        <Button variant="primary" onClick={handleUpload}>
        {t('uploadbtn')}
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
}

export default ExcelUploadModal;
