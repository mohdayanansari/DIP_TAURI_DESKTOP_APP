import axios from 'axios';

// without cookies unprotected requests
export const axiosClient = axios.create();

// http://localhost:1999/api/v1
// https://dip-server-w83b.onrender.com/
axiosClient.defaults.baseURL = 'https://dip-server-w83b.onrender.com/api/v1';
axiosClient.defaults.withCredentials = false;

//All request will wait 4 seconds before timeout
axiosClient.defaults.timeout = 150000;
