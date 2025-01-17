import axios from 'axios';

// Corrigido a URL base para incluir 'https://' no início
const api = axios.create({
    baseURL: 'https://viacep.com.br/ws/',  // Agora inclui o protocolo 'https://'
});

export default api;
