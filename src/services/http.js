import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api.example.com', // 设置基础 URL
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么，比如添加 token、设置请求头等
        console.log('Request sent:', config);
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 对响应数据做些什么，比如处理统一错误等
        console.log('Response received:', response);
        return response;
    },
    (error) => {
        // 对响应错误做些什么
        console.error('Response error:', error);
        return Promise.reject(error);
    }
);

export default instance;
