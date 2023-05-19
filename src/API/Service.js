import axios from 'axios';

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

export default class Service {

    static async getWorkers(currentPage) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const workers = await axios.get(`http://192.168.0.151:8080/api/workers?page=${currentPage}`, {
        headers: headers
        });
        return workers.data;
    }

    static async getReadings(currentPage, filters) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie
        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const queryString = Object.keys(filters)
            .map(key => {
            if (Array.isArray(filters[key])) {
                return filters[key].map(value => `${key}[]=${value}`).join('&');
            } else {
                return `${key}=${filters[key]}`;
            }
            })
            .join('&');

        const url = `http://192.168.0.151:8080/api/readings?page=${currentPage}&${queryString}`;

        console.log("url", url)

        const readings = await axios.get(url, { headers });
        return readings.data;
    }

    static async getWorker(id) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const worker = await axios.get(`http://192.168.0.151:8080/api/workers/` + id, {
        headers: headers
        });
        return worker.data;
    }

    static async getMyProfile() {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.get(`http://192.168.0.151:8080/api/user`, {
        headers: headers
        });
        return response.data;
    }

    static async getHelmetsWithoutWorkers() {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.get(`http://192.168.0.151:8080/api/helmets/without-workers`, {
        headers: headers
        });
        return response.data;
    }

    static async getWorkersWithoutHelmets() {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.get(`http://192.168.0.151:8080/api/workers/without-helmets`, {
        headers: headers
        });
        return response.data;
    }

    static async updateMyProfile(id, data) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.put(`http://192.168.0.151:8080/api/update-info/` + id, data, {
        headers: headers
        });
        return response.data;
    }

    static async exportWorkers() {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN');
    
        const headers = {
            'X-XSRF-TOKEN': xsrfToken,
        };
    
        axios.defaults.withCredentials = true;
    
        const worker = await axios.get(`http://192.168.0.151:8080/api/workers/export/excel`, {
            headers: headers,
            responseType: 'blob', // set the response type to blob
        });
    
        // create a new blob from the response data
        const blob = new Blob([worker.data], { type: 'application/vnd.ms-excel' });
    
        // create a new URL from the blob
        const url = window.URL.createObjectURL(blob);
    
        // create a link element with the URL as its href
        const link = document.createElement('a');
        link.href = url;
        link.download = 'workers.xlsx';
    
        // programmatically click the link to initiate the download
        link.click();
    }

    static async exportHelmets() {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN');
    
        const headers = {
            'X-XSRF-TOKEN': xsrfToken,
        };
    
        axios.defaults.withCredentials = true;
    
        const helmet = await axios.get(`http://192.168.0.151:8080/api/helmets/export/excel`, {
            headers: headers,
            responseType: 'blob', // set the response type to blob
        });
    
        // create a new blob from the response data
        const blob = new Blob([helmet.data], { type: 'application/vnd.ms-excel' });
    
        // create a new URL from the blob
        const url = window.URL.createObjectURL(blob);
    
        // create a link element with the URL as its href
        const link = document.createElement('a');
        link.href = url;
        link.download = 'helmets.xlsx';
    
        // programmatically click the link to initiate the download
        link.click();
    }

    static async exportSensors() {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN');
    
        const headers = {
            'X-XSRF-TOKEN': xsrfToken,
        };
    
        axios.defaults.withCredentials = true;
    
        const sensor = await axios.get(`http://192.168.0.151:8080/api/sensors/export/excel`, {
            headers: headers,
            responseType: 'blob', // set the response type to blob
        });
    
        // create a new blob from the response data
        const blob = new Blob([sensor.data], { type: 'application/vnd.ms-excel' });
    
        // create a new URL from the blob
        const url = window.URL.createObjectURL(blob);
    
        // create a link element with the URL as its href
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sensors.xlsx';
    
        // programmatically click the link to initiate the download
        link.click();
    }

    static async exportReadings() {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN');
    
        const headers = {
            'X-XSRF-TOKEN': xsrfToken,
        };
    
        axios.defaults.withCredentials = true;
    
        const reading = await axios.get(`http://192.168.0.151:8080/api/readings/export/excel`, {
            headers: headers,
            responseType: 'blob', // set the response type to blob
        });
    
        // create a new blob from the response data
        const blob = new Blob([reading.data], { type: 'application/vnd.ms-excel' });
    
        // create a new URL from the blob
        const url = window.URL.createObjectURL(blob);
    
        // create a link element with the URL as its href
        const link = document.createElement('a');
        link.href = url;
        link.download = 'readings.xlsx';
    
        // programmatically click the link to initiate the download
        link.click();
    }
    

    static async getWorkerHelmet(id) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const worker = await axios.get(`http://192.168.0.151:8080/api/helmets/worker/` + id, {
        headers: headers
        });
        return worker.data;
    }

    static async deleteWorker(id) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.delete(`http://192.168.0.151:8080/api/workers/delete/` + id, {
        headers: headers
        });
        return response.data;
    }

    static async importWorkers(data) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.post(`http://192.168.0.151:8080/api/workers/import/excel`, data, {
        headers: headers
        });
        return response.data;
    }

    static async importHelmets(data) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.post(`http://192.168.0.151:8080/api/helmets/import/excel`, data, {
        headers: headers
        });
        return response.data;
    }

    static async importReadings(data) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.post(`http://192.168.0.151:8080/api/readings/import/excel`, data, {
        headers: headers
        });
        return response.data;
    }

    static async importSensors(data) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.post(`http://192.168.0.151:8080/api/sensors/import/excel`, data, {
        headers: headers
        });
        return response.data;
    }

    static async addSensor(data) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.post(`http://192.168.0.151:8080/api/sensors/create`, data, {
        headers: headers
        });
        return response.data;
    }

    static async addHelmet(data) {
        console.log("data", data);
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.post(`http://192.168.0.151:8080/api/helmets/create`, data, {
        headers: headers
        });
        return response.data;
    }

    static async addWorker(data) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.post(`http://192.168.0.151:8080/api/workers/create`, data, {
        headers: headers
        });
        return response.data;
    }

    static async updateSensor(id, data) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.put(`http://192.168.0.151:8080/api/sensors/update/` + id, data, {
        headers: headers
        });
        return response.data;
    }

    static async updateWorker(id, data) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.put(`http://192.168.0.151:8080/api/workers/update/` + id, data, {
        headers: headers
        });
        return response.data;
    }

    static async updateHelmet(id, data) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.put(`http://192.168.0.151:8080/api/helmets/update/` + id, data, {
        headers: headers
        });
        return response.data;
    }

    static async setHelmetWorker(worker_id, helmetId) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.put(`http://192.168.0.151:8080/api/helmets/set-worker/` + helmetId, {worker_id: worker_id}, {
        headers: headers
        });
        return response.data;
    }

    

    static async getSensors(currentPage) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const workers = await axios.get(`http://192.168.0.151:8080/api/sensors?page=${currentPage}`, {
        headers: headers
        });
        return workers.data;
    }

    static async getAllSensors() {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const sensors = await axios.get(`http://192.168.0.151:8080/api/sensors/all`, {
        headers: headers
        });
        return sensors.data;
    }

    static async getAllHelmets() {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const helmets = await axios.get(`http://192.168.0.151:8080/api/helmets/all`, {
        headers: headers
        });
        return helmets.data;
    }

    static async getHelmets(currentPage) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const helmets = await axios.get(`http://192.168.0.151:8080/api/helmets?page=${currentPage}`, {
        headers: headers
        });
        return helmets.data;
    }

    static async getLastCoordinates(id) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.get(`http://192.168.0.151:8080/api/readings/getlastcoordinates`, {
        headers: headers
        });
        return response.data;
    }

    static async getHelmet(id) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const helmets = await axios.get(`http://192.168.0.151:8080/api/helmets/` + id, {
        headers: headers
        });
        return helmets.data;
    }

    static async getHelmetByWorkerId(id) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const helmets = await axios.get(`http://192.168.0.151:8080/api/helmets/worker/` + id, {
        headers: headers
        });
        return helmets.data;
    }

    static async getStatistics(start_date, end_date, sensor_id, helmet_id, min_value, max_value) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.get(`http://192.168.0.151:8080/api/readings/statistics`, {
        headers: headers,
        params: {
            start_date: start_date,
            end_date: end_date,
            sensor_id: sensor_id,
            helmet_id: helmet_id,
            min_value: min_value,
            max_value: max_value,
        }
        });
        return response.data;
    }

    static async deleteSensor(id) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.delete(`http://192.168.0.151:8080/api/sensors/delete/` + id, {
        headers: headers
        });
        return response.data;
    }

    static async deleteHelmet(id) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.delete(`http://192.168.0.151:8080/api/helmets/delete/` + id, {
        headers: headers
        });
        return response.data;
    }

    static async deleteReading(id) {
        const xsrfToken = getXsrfTokenFromCookie('XSRF-TOKEN'); // Replace 'XSRF-TOKEN' with the name of your cookie

        const headers = {
        'X-XSRF-TOKEN': xsrfToken, // Example authorization header
        };

        axios.defaults.withCredentials = true;

        const response = await axios.delete(`http://192.168.0.151:8080/api/readings/delete/` + id, {
        headers: headers
        });
        return response.data;
    }

}