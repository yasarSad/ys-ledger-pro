import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL;

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },

});

api.interceptors.request.use((config) =>{
    const authToken = localStorage.getItem('authToken');
    if(authToken){
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
}, (error) =>{
    return Promise.reject(error);
});

export const fetchWithAuth = async (url, options={}) => {
    try{
        const response = await api({
            url,
            method: options.method || 'GET',
            data: options.body,
            params: options.params
        });
        return response.data;
    }catch(error){
        console.error('API failed to be called, error: ', error);
        throw new Error(error.response?.data?.message || 'API call failed');
    }
};
