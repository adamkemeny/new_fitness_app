import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/";
//axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (config.url.includes("/api/auth")) {
        return config;
    }
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    else{
        delete config.headers.Authorization;
    }
    return config;
})

export default axios;