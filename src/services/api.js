import axios from 'axios'

export default () => {
  const hostApi = import.meta.env.VITE_HOST_API
  const api = axios.create({
    baseURL: hostApi
  })

  return api
}

//   // Configure axios-retry
//   axiosRetry(api, {
//     retries: 5, // Number of retries
//     retryDelay: (retryCount) => retryCount * 1000, // Exponential backoff
//     retryCondition: (error) => error.response?.status === 429, // Retry on 429 status code
//   });

//   // Request interceptor
//   api.interceptors.request.use(
//     async (config) => {
//       // Encryption logic here if needed
//       const token = localStorage.getItem('token');
//       if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   // Response interceptor
//   api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       console.error('API call error:', error);
//       return Promise.reject(error);
//     }
//   );
