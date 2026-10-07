import api from "../../../lib/api";
import type { Subject, SubjectPage } from "../../../types/subjects";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Obtiene las materias del maestro autenticado.
 *
 * Utiliza la paginación proporcionada por el backend.
 */
export async function getSubjects(
    page = 0,
    size = DEFAULT_PAGE_SIZE
): Promise<SubjectPage> {

    const response = await api.get<SubjectPage>(
        "/api/subjects",
        {
            params: {
                page,
                size,
            },
        }
    );

    return response.data;
}

/**
 * Crea una nueva materia.
 */
export async function createSubject(
    name: string
): Promise<Subject> {

    const response = await api.post<Subject>(
        "/api/subjects",
        {
            name,
        }
    );

    return response.data;
}

/**
 * Actualiza una materia.
 */
export async function updateSubject(
    id: string,
    name: string
): Promise<Subject> {

    const response = await api.put<Subject>(
        `/api/subjects/${id}`,
        {
            name,
        }
    );

    return response.data;
}

/**
 * Elimina una materia.
 */
export async function deleteSubject(
    id: string
): Promise<void> {

    await api.delete(`/api/subjects/${id}`);
}