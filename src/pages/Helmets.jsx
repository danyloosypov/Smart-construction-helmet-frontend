import React from 'react'
import Service from '../API/Service';
import { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditHelmet from '../components/EditHelmet';
import { useTranslation } from "react-i18next";

function Helmets() {
  const notify = (message) => toast(message);
  const { t } = useTranslation();


  function getXsrfTokenFromCookie(cookieName) {
    const cookies = document.cookie.split(';'); // Get all cookies as an array
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName + '=') === 0) { // Check if cookie name matches
            return decodeURIComponent(cookie.substring(cookieName.length + 1)); // Return cookie value
        }
    }
    return null; // Return null if cookie not found
}

  const [helmets, setHelmets] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedHelmets, setselectedHelmets] = useState([]);
  const [isHeaderCheckboxChecked, setIsHeaderCheckboxChecked] = useState(false);
  const [showEditHelmetModal, setshowEditHelmetModal] = useState(false);
  const [editHelmet, setEditHelmet] = useState();

  const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

  function updateHelmet(id, name, description, worker_id) {
    setHelmets(prevHelmets => {
      const index = prevHelmets.findIndex(helmet => helmet.id === id);
      const newHelmets = [...prevHelmets];
      newHelmets[index] = {
        ...newHelmets[index],
        name: name,
        description: description,
        worker_id: worker_id
      };
      return newHelmets;
    });
  }

  useEffect(() => {

    Service.getHelmets(currentPage)
      .then(response => {
        setHelmets(response.data.data);
        setLastPage(response.data.last_page);
        console.log("helmets", response.data)
      })
      .catch(error => {
        console.log(error);
      });
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  function openEditHelmetModal(helmet) {
    setEditHelmet(helmet);
    setshowEditHelmetModal(true);
  }

  function closeEditHelmetModal() {
    setshowEditHelmetModal(false);
  }

  const handleSelectHelmet = (id) => {
    if (selectedHelmets.includes(id)) {
      setselectedHelmets(selectedHelmets.filter((helmetId) => helmetId !== id));
      setIsHeaderCheckboxChecked(false);
    } else {
      setselectedHelmets([...selectedHelmets, id]);
      setIsHeaderCheckboxChecked(selectedHelmets.length + 1 === helmets.length);
    }
  };

  const handleSelectAll = (event) => {
    setselectedHelmets(
      event.target.checked ? helmets.map((helmet) => helmet.id) : []
    );
    setIsHeaderCheckboxChecked(event.target.checked);
  };
  
  const handleDeleteSelected = () => {
    if (window.confirm("Are you sure you want to delete the selected helmets?")) {
      Promise.all(selectedHelmets.map((id) => deleteHelmet(id)))
      .then(() => {
        setselectedHelmets([]);
        setIsHeaderCheckboxChecked(false);
      })
      .catch((error) => {
        notify(error);
        console.log(error);
      });
    }
  };

  function deleteHelmet(id) {
    Service.deleteHelmet(id)
    .then(response => {
      if(response.status === "success") {
        const index = helmets.findIndex(helmet => helmet.id === id);
        helmets.splice(index, 1);
        setHelmets([...helmets]);
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
      <h1>{t('helmets')}</h1>
      <Button variant="danger" disabled={selectedHelmets.length === 0} onClick={handleDeleteSelected} style={{ marginBottom: '10px' }}>{t('deleteselected')}</Button>
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
            <th>Worker</th>
            <th>description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {helmets.map((helmet) => (
            <tr key={helmet.id}>
              <td><input
                  type='checkbox'
                  checked={selectedHelmets.includes(helmet.id)}
                  onChange={() => handleSelectHelmet(helmet.id)}
              /></td>
              <td>{helmet.id}</td>
              <td>{helmet.name}</td>
              <td>{helmet.worker_id}</td>
              <td>{helmet.description}</td>
              <td style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="danger" onClick={() => deleteHelmet(helmet.id)} style={{marginRight:'10px'}}>{t('deletebtn')}</Button>{' '}
                <Link to="#" onClick={() => openEditHelmetModal(helmet.id)} style={{marginRight:'10px'}}>
                  <Button variant="warning">{t('editbtn')}</Button>
                </Link>
                <Link to={`/helmet/${helmet.id}`}>
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

      <EditHelmet 
        showEditHelmetModal={showEditHelmetModal} 
        closeEditHelmetModal={closeEditHelmetModal} 
        helmet={editHelmet}
        onUpdate={updateHelmet} />

      <ToastContainer />

    </div>
  );
}

export default Helmets
