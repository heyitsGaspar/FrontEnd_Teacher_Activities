import { apiFetch } from "@/lib/api";
import type {
    LoginRequest,
    RegisterRequest,
} from "@/types/auth";

/**
 * Registra un nuevo usuario.
 *
 * El backend se encarga de crear
 * las cookies HttpOnly.
 */
export async function register(
    data: RegisterRequest
): Promise<string> {

    return apiFetch<string>(
        "/api/auth/register",
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    );
}

/**
 * Inicia sesión.
 *
 * El backend crea:
 *
 * accessToken
 * refreshToken
 *
 * como cookies HttpOnly.
 */
export async function login(
    data: LoginRequest
): Promise<string> {

    return apiFetch<string>(
        "/api/auth/login",
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    );
}

/**
 * Renueva el accessToken.
 *
 * El refreshToken se envía automáticamente
 * mediante la cookie HttpOnly.
 */
export async function refreshToken(): Promise<string> {

    return apiFetch<string>(
        "/api/auth/refresh",
        {
            method: "POST",
        }
    );
}

/**
 * Cierra la sesión.
 *
 * El backend elimina las cookies.
 */
export async function logout(): Promise<string> {

    return apiFetch<string>(
        "/api/auth/logout",
        {
            method: "POST",
        }
    );
}