import api from "@/lib/api";

import type {
    LoginRequest,
    RegisterRequest,
} from "@/types/auth";

/**
 * Registra un nuevo usuario.
 *
 * El backend crea las cookies HttpOnly.
 */
export async function register(
    data: RegisterRequest
): Promise<string> {

    const response = await api.post(
        "/api/auth/register",
        data
    );

    return response.data;
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

    const response = await api.post(
        "/api/auth/login",
        data
    );

    return response.data;
}

/**
 * Renueva el accessToken.
 *
 * El refreshToken se envía automáticamente
 * mediante la cookie HttpOnly.
 */
export async function refreshToken(): Promise<string> {

    const response = await api.post(
        "/api/auth/refresh"
    );

    return response.data;
}

/**
 * Cierra la sesión.
 *
 * El backend elimina las cookies.
 */
export async function logout(): Promise<string> {

    const response = await api.post(
        "/api/auth/logout"
    );

    return response.data;
}

/**
 * Obtiene los datos del usuario autenticado.
 */
export async function getCurrentUser() {

    const response = await api.get(
        "/api/auth/me"
    );

    return response.data;
}