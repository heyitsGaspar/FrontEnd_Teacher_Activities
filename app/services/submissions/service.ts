import api from "../../../lib/api";
import type {
    Submission,
    SubmissionBoardData,
} from "../../../types/submissions";

const DEFAULT_ACTIVITIES = 6;

/**
 * Obtiene la tabla de entregas: alumnos (A-Z)
 * y las últimas actividades.
 */
export async function getSubmissionBoard(
    activities = DEFAULT_ACTIVITIES
): Promise<SubmissionBoardData> {

    const response = await api.get<SubmissionBoardData>(
        "/api/submissions/board",
        {
            params: {
                activities,
            },
        }
    );

    return response.data;
}

/**
 * Registra la entrega de un alumno a partir
 * del código leído por el escáner.
 */
export async function createSubmission(
    code: string,
    activityId: string
): Promise<Submission> {

    const response = await api.post<Submission>(
        "/api/submissions",
        {
            code,
            activityId,
        }
    );

    return response.data;
}

/**
 * Elimina una entrega.
 */
export async function deleteSubmission(
    id: string
): Promise<void> {

    await api.delete(`/api/submissions/${id}`);
}