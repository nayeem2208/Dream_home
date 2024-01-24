import axios from "axios";


const axiosInstance = axios.create({

    baseURL: 'https://www.dreamhome.cloud',
    headers: {
      'Content-Type': 'application/json',
      withCredentials: true, // If needed for cross-origin requests
    },
  });
  
  // Apply the authcheck middleware to the Axios instance
  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  

  export default axiosInstance;