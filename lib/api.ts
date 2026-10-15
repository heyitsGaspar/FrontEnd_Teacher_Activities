import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL  ?? "",
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

/* Páginas públicas: ahí no hay nada que proteger. */
const PUBLIC_PATHS = ["/login", "/register"];

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

/*
 * La sesión ya no se puede renovar (venció, se cerró o se
 * detectó reutilización): llevamos a la persona al login.
 * Devuelve true si inició la redirección.
 */
function redirectToLogin(): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    const path = window.location.pathname;

    if (PUBLIC_PATHS.some((publicPath) => path.startsWith(publicPath))) {
        return false;
    }

    window.location.replace("/login?expired=1");

    return true;
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
             * Solo cerramos la sesión si el servidor rechazó la
             * renovación. Un fallo de red no debe sacar a nadie.
             */
            if (
                axios.isAxiosError(refreshError) &&
                refreshError.response?.status === 401 &&
                redirectToLogin()
            ) {
                /*
                 * Dejamos la petición pendiente a propósito: la
                 * página se está yendo al login, y así ninguna
                 * pantalla muestra un diálogo de error por un instante.
                 */
                return new Promise<never>(() => {});
            }

            return Promise.reject(refreshError);
        }
    }
);


export default api;