import { z } from "zod";

import type { FieldErrors } from "./register";

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "El correo es obligatorio.")
        .email("El correo no tiene un formato válido."),

    /*
     * Sin trim: un espacio puede ser parte de la contraseña.
     */
    password: z.string().min(1, "La contraseña es obligatoria."),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Valida el formulario. Si es correcto devuelve los datos
 * ya limpios (con trim en el correo); si no, un error por campo.
 */
export function validateLogin(values: unknown): {
    data?: LoginInput;
    errors: FieldErrors;
} {
    const result = loginSchema.safeParse(values);

    if (result.success) {
        return { data: result.data, errors: {} };
    }

    const errors: FieldErrors = {};

    for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? "form");

        // Solo el primer error de cada campo
        if (!errors[field]) {
            errors[field] = issue.message;
        }
    }

    return { errors };
}