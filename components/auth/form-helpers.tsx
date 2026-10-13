/*
 * Piezas compartidas por los formularios de
 * inicio de sesión y registro.
 */

/**
 * Mensaje debajo de un campo: muestra el error
 * o, si no hay, una pista opcional.
 */
export function FieldMessage({
    id,
    error,
    hint,
}: {
    id: string;
    error?: string;
    hint?: string;
}) {
    if (!error && !hint) {
        return null;
    }

    return (
        <p
            id={id}
            role={error ? "alert" : undefined}
            className={`text-sm ${
                error
                    ? "font-medium text-[#C2392B]"
                    : "text-[#5B6B80]"
            }`}
        >
            {error ?? hint}
        </p>
    );
}

/**
 * Clases del input: borde rojo si tiene error.
 */
export function inputClass(hasError: boolean, extra = "") {
    return `h-12 rounded-xl border-2 text-base ${extra} ${
        hasError
            ? "border-[#C2392B] focus-visible:border-[#C2392B] focus-visible:ring-[#C2392B]/20"
            : "border-[#D5DEE8] focus-visible:border-[#187A4C] focus-visible:ring-[#187A4C]/20"
    }`;
}