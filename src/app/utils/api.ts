import axios from 'axios';
import {store} from "@/app/redux/store";
import {logout, setCredentials} from "@/app/redux/slices/auth.slice";


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // important for refresh token cookie
});

// request interceptor run before every request
// Attach access token from Redux to every request
api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for 401 -> refresh token
// api.interceptors.response.use(success, error)   this is method take 2 things on success direct return res on error we are handling
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;
        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const {data} = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {},
                    {withCredentials: true},
                );
                store.dispatch(setCredentials({accessToken: data.accessToken, user: data.user}));
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (_err) {
                store.dispatch(logout());
                return Promise.reject(_err);
            }
        }
        return Promise.reject(err);
    },
);

export default api;
