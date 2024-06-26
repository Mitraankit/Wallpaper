import axios from 'axios';

const unsplash = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: 'Client-ID VGK_lt83CFYtl60zrfzfoyjQC98o5TxERBwR97469Po'
  }
});

export default unsplash;