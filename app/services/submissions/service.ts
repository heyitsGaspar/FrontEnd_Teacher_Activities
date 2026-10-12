import api from "../../../lib/api";
import type {
    Submission,
    SubmissionBoardData,
} from "../../../types/submissions";



/**
 * Obtiene la tabla de entregas: todos los alumnos (A-Z)
 * y todas las actividades, de la más antigua a la más reciente.
 */
export async function getSubmissionBoard(): Promise<SubmissionBoardData> {

    const response = await api.get<SubmissionBoardData>(
        "/api/submissions/board"
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