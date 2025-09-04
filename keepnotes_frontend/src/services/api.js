import axios from "axios";
const Request_URL = "http://localhost:8080/api";
export const axiosInstance = axios.create({
    baseURL: Request_URL,
});
axiosInstance.interceptors.request.use(config =>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
 export const registerUser= (username, password)=> {
    return axiosInstance.post("auth/register", {username,password})
    .then(res => res.data);
 };
 