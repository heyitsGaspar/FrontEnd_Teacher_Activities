/* Paleta del login "papel de china" (hex sin #). Cambia los colores solo aquí. */
export const PALETTE = {
    /* Colores base del login */
    navy: "1F2A44",   // tinta
    yellow: "FFD84D", // sol
    green: "187A4C",  // pasto
    coral: "FF6B5B",
    sky: "7CC6E8",    // cielo
    wall: "DCEEF7",   // pared

    /* Estados */
    greenSoft: "D1F0E0",
    greenText: "0F5233",
    coralSoft: "FFE0DC",
    coralText: "9A2A1E",
    amber: "F5B041",
    amberSoft: "FFF4C7",

    /* Neutros con tinte azulado */
    gray: "6B7A90",
    grayText: "4A5568",
    border: "BFD9E8",
    track: "DCEEF7",
    stripe: "F3F9FC",
    card: "DCEEF7",
    onDark: "7CC6E8", // texto secundario sobre fondo azul
    white: "FFFFFF",
};

export type RGB = [number, number, number];

/* Para jsPDF: "1F2A44" -> [31, 42, 68] */
export const rgb = (hex: string): RGB => [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
];

/* Para ExcelJS */
export const argb = (hex: string) => ({ argb: `FF${hex}` });

export const solid = (hex: string) => ({
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: argb(hex),
});

/* Color según el porcentaje de cumplimiento */
export const ratioColors = (ratio: number) => {
    if (ratio >= 1) {
        // 100%: todo entregado
        return {
            bg: PALETTE.greenSoft,
            text: PALETTE.greenText,
            bar: PALETTE.green,
        };
    }

    if (ratio >= 0.5) {
        // 50% a 99%: va a medias
        return {
            bg: PALETTE.amberSoft,
            text: PALETTE.navy,
            bar: PALETTE.amber,
        };
    }

    // Menos de 50%: atención
    return {
        bg: PALETTE.coralSoft,
        text: PALETTE.coralText,
        bar: PALETTE.coral,
    };
};