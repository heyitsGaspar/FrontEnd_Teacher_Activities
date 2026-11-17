import api from "../../../lib/api";
import { getActivities } from "../activities/service";
import type {
    BoardActivity,
    Submission,
    SubmissionBoardData,
} from "../../../types/submissions";

const ACTIVITY_PAGE_SIZE = 50;

/**
 * Obtiene la tabla de entregas: todos los alumnos (A-Z)
 * y todas las actividades, de la más antigua a la más reciente.
 */
export async function getSubmissionBoard(): Promise<SubmissionBoardData> {
    type SubmissionBoardResponse = Omit<SubmissionBoardData, "activities"> & {
        activities: Array<Omit<BoardActivity, "trimester">>;
    };

    const [response, firstActivityPage] = await Promise.all([
        api.get<SubmissionBoardResponse>("/api/submissions/board"),
        getActivities(0, ACTIVITY_PAGE_SIZE),
    ]);

    const remainingActivityPages = await Promise.all(
        Array.from(
            { length: Math.max(0, firstActivityPage.totalPages - 1) },
            (_, index) => getActivities(index + 1, ACTIVITY_PAGE_SIZE)
        )
    );
    const activities = [
        ...firstActivityPage.content,
        ...remainingActivityPages.flatMap((page) => page.content),
    ];
    const trimesterByActivityId = new Map(
        activities.map((activity) => [String(activity.id), activity.trimester])
    );

    return {
        ...response.data,
        activities: response.data.activities.map((activity) => {
            const trimester = trimesterByActivityId.get(String(activity.id));

            if (trimester === undefined) {
                throw new Error(
                    `No se encontró el trimestre de la actividad ${activity.id}.`
                );
            }

            return { ...activity, trimester };
        }),
    };
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