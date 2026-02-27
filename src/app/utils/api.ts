import axios from 'axios';
 import { getSession } from 'next-auth/react';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // important for refresh token cookie
});

// Attach NextAuth access token automatically for client-side API calls.
// For server-side calls (SSR/route handlers), pass token manually if needed.
api.interceptors.request.use(async (config) => {
    if (typeof window !== 'undefined') {
        const session = await getSession();
        const token = session?.accessToken;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

type RetryableRequestConfig = {
    _retry?: boolean;
    headers?: Record<string, string>;
};

// Response interceptor for 401 -> refresh token
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = (err.config ?? {}) as RetryableRequestConfig;
        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const {data} = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {},
                    {withCredentials: true}
                );
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (_err) {
                return Promise.reject(_err);
            }
        }
        return Promise.reject(err);
    }
);

export default api;
