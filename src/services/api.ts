//conecta com o backend

import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:4000'
})