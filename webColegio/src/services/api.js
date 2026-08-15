import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://fundatecbackenddemo.onrender.com/', // URL de tu backend Express
    headers: {
        'Content-Type': 'application/json'
    }
});