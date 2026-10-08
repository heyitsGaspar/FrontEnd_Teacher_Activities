import axios from "axios";

import api from "../../../lib/api";
import type {
    Activity,
    ActivityPage,
    ActivityPayload,
    CreateActivityPayload,
} from "../../../types/activities";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Obtiene las actividades del maestro autenticado,
 * de la más reciente a la más antigua.
 */
export async function getActivities(
    page = 0,
    size = DEFAULT_PAGE_SIZE
): Promise<ActivityPage> {

    const response = await api.get<ActivityPage>(
        "/api/activities",
        {
            params: {
                page,
                size,
                sort: "activityDate,desc",
            },
        }
    );

    return response.data;
}

/**
 * Crea una actividad. Con activate = true
 * queda como la actividad activa.
 */
export async function createActivity(
    payload: CreateActivityPayload
): Promise<Activity> {

    const response = await api.post<Activity>(
        "/api/activities",
        payload
    );

    return response.data;
}

/**
 * Actualiza una actividad.
 */
export async function updateActivity(
    id: string,
    payload: ActivityPayload
): Promise<Activity> {

    const response = await api.put<Activity>(
        `/api/activities/${id}`,
        payload
    );

    return response.data;
}

/**
 * Elimina una actividad.
 */
export async function deleteActivity(
    id: string
): Promise<void> {

    await api.delete(`/api/activities/${id}`);
}

/**
 * Marca una actividad como la activa.
 */
export async function activateActivity(
    id: string
): Promise<Activity> {

    const response = await api.patch<Activity>(
        `/api/activities/${id}/activate`
    );

    return response.data;
}

/**
 * Obtiene la actividad activa.
 * Devuelve null si no hay ninguna (el backend responde 404).
 */
export async function getActiveActivity(): Promise<Activity | null> {

    try {

        const response = await api.get<Activity>(
            "/api/activities/active/current"
        );

        return response.data;

    } catch (error) {

        if (
            axios.isAxiosError(error) &&
            error.response?.status === 404
        ) {
            return null;
        }

        throw error;
    }
}