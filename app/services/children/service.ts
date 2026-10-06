import api from "../../../lib/api";

import type {
    Child,
    ChildPage,
} from "../../../types/child";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Obtiene una página de alumnos pertenecientes
 * al profesor autenticado.
 */
export async function getChildren(
    page = 0,
    size = DEFAULT_PAGE_SIZE
): Promise<ChildPage> {
    const response = await api.get<ChildPage>(
        "/api/children",
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
 * Crea un nuevo alumno.
 */
export async function createChild(
    name: string
): Promise<Child> {
    const response = await api.post<Child>(
        "/api/children",
        {
            name,
        }
    );

    return response.data;
}

/**
 * Elimina un alumno.
 */
export async function deleteChild(
    id: string
): Promise<void> {
    await api.delete(`/api/children/${id}`);
}

/**
 * Obtiene todos los alumnos.
 *
 * Aunque la interfaz utiliza paginación,
 * para generar el PDF necesitamos obtener
 * todos los alumnos.
 */
export async function getAllChildren(): Promise<Child[]> {
    const firstPage = await getChildren(
        0,
        DEFAULT_PAGE_SIZE
    );

    const children = [
        ...firstPage.content,
    ];

    for (
        let page = 1;
        page < firstPage.totalPages;
        page++
    ) {
        const currentPage = await getChildren(
            page,
            DEFAULT_PAGE_SIZE
        );

        children.push(
            ...currentPage.content
        );
    }

    return children;
}