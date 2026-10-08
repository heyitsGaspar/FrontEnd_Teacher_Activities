/** Fecha de hoy en formato yyyy-MM-dd (hora local). */
export function todayISO(): string {
    const now = new Date();

    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Convierte "2026-10-07" en "7 oct 2026".
 * Se arma con año, mes y día para evitar corrimientos por zona horaria.
 */
export function formatActivityDate(iso: string): string {
    const [year, month, day] = iso.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}