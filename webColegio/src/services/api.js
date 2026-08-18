import axios from 'axios';

export const api = axios.create({
     baseURL: 'https://fundatecbackenddemo.onrender.com/',
    //baseURL: 'http://localhost:3000/', 
    headers: {
        'Content-Type': 'application/json'
    }
});