import type { AuthResponse } from "@/types/auth";

export function saveAuthSession(auth: AuthResponse) {
    localStorage.setItem("accessToken", auth.accessToken);
    localStorage.setItem("refreshToken", auth.refreshToken);
}

export function getAccessToken() {
    return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
    return localStorage.getItem("refreshToken");
}

export function clearAuthSession() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}