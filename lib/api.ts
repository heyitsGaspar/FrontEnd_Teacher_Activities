import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

/* Rutas que nunca deben disparar una renovación (evita bucles). */
const AUTH_URLS = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/refresh",
    "/api/auth/logout",
];

/*
 * Si varias peticiones fallan a la vez, todas esperan
 * la misma renovación en lugar de pedir una cada una.
 */
let refreshPromise: Promise<void> | null = null;

function refreshSession(): Promise<void> {
    refreshPromise ??= api
        .post("/api/auth/refresh")
        .then(() => undefined)
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
}

api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const original = error.config as RetriableRequest | undefined;

        const isUnauthorized = error.response?.status === 401;
        const isAuthRoute = AUTH_URLS.some((url) => original?.url?.includes(url));

        if (!original || !isUnauthorized || isAuthRoute || original._retry) {
            return Promise.reject(error);
        }

        original._retry = true;

        try {
            await refreshSession();

            return api(original);
        } catch (refreshError) {
            /*
             * El refreshToken también venció o no es válido.
             * No redirigimos desde aquí: DashboardShell ya manda
             * al login cuando getCurrentUser falla.
             */
            return Promise.reject(refreshError);
        }
    }
);

export default api;