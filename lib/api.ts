const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error(
        "NEXT_PUBLIC_API_URL no está configurada"
    );
}

/**
 * Cliente HTTP principal de la aplicación.
 *
 * credentials: "include" permite que el navegador
 * envíe y reciba las cookies HttpOnly del backend.
 */
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            /*
             * IMPORTANTE:
             *
             * Permite enviar las cookies:
             *
             * accessToken
             * refreshToken
             */
            credentials: "include",

            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        }
    );

    /*
     * Si la respuesta no fue exitosa,
     * intentamos obtener el mensaje del backend.
     */
    if (!response.ok) {

        const message =
            await response.text();

        throw new Error(
            message || "Error en la petición"
        );
    }

    /*
     * Algunas respuestas podrían no tener body.
     */
    const contentType =
        response.headers.get("content-type");

    if (
        contentType &&
        contentType.includes("application/json")
    ) {
        return response.json();
    }

    return undefined as T;
}