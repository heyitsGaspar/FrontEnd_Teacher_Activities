import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
    withCredentials: true,
    timeout: 90_000, // da tiempo a que Render despierte
    headers: { "Content-Type": "application/json" },
});

type RetriableRequest = InternalAxiosRequestConfig & {
    _retry?: boolean;
    _wakeRetries?: number;
};

/* Rutas que nunca deben disparar una renovación (evita bucles). */
const AUTH_URLS = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/refresh",
    "/api/auth/logout",
];

/* Páginas públicas: ahí no hay nada que proteger. */
const PUBLIC_PATHS = ["/login", "/register"];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* Fallos típicos de un servidor dormido: no son 401 ni un bug tuyo. */
const isTransient = (error: unknown) =>
    axios.isAxiosError(error) &&
    (!error.response || [502, 503, 504].includes(error.response.status));

/*
 * Si varias peticiones fallan a la vez, todas esperan
 * la misma renovación en lugar de pedir una cada una.
 */
let refreshPromise: Promise<void> | null = null;

function refreshSession(): Promise<void> {
    refreshPromise ??= (async () => {
        const maxAttempts = 5;

        for (let attempt = 1; ; attempt++) {
            try {
                await api.post("/api/auth/refresh");
                return;
            } catch (error) {
                if (!isTransient(error) || attempt === maxAttempts) {
                    throw error;
                }

                await wait(4000 * attempt); // 4s, 8s, 12s, 16s
            }
        }
    })().finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
}

/* Devuelve true si inició la redirección. */
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

        if (!original) {
            return Promise.reject(error);
        }

        const isAuthRoute = AUTH_URLS.some((url) => original.url?.includes(url));

        /* A) Servidor despertando: reintentar solo peticiones de lectura. */
        if (
            isTransient(error) &&
            !isAuthRoute &&
            original.method?.toLowerCase() === "get" &&
            (original._wakeRetries ?? 0) < 3
        ) {
            original._wakeRetries = (original._wakeRetries ?? 0) + 1;

            await wait(3000 * original._wakeRetries);

            return api(original);
        }

        /* B) Access token vencido: renovar y repetir la petición. */
        const isUnauthorized = error.response?.status === 401;

        if (!isUnauthorized || isAuthRoute || original._retry) {
            return Promise.reject(error);
        }

        original._retry = true;

        try {
            await refreshSession();

            return api(original);
        } catch (refreshError) {
            /*
             * Solo cerramos la sesión si el servidor rechazó la
             * renovación (401). Un 502 o un corte de red no deben
             * sacar a nadie.
             */
            if (
                axios.isAxiosError(refreshError) &&
                refreshError.response?.status === 401 &&
                redirectToLogin()
            ) {
                return new Promise<never>(() => {});
            }

            return Promise.reject(refreshError);
        }
    }
);

export default api;