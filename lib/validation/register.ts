import { z } from "zod";

export type FieldErrors = Record<string, string>;

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "El nombre es obligatorio.")
            .max(100, "El nombre no puede superar los 100 caracteres."),

        email: z
            .string()
            .trim()
            .min(1, "El correo es obligatorio.")
            .max(150, "El correo no puede superar los 150 caracteres.")
            .email("El correo no tiene un formato válido."),

        password: z
            .string()
            .min(1, "La contraseña es obligatoria.")
            .min(8, "La contraseña debe tener al menos 8 caracteres.")
            .max(100, "La contraseña no puede superar los 100 caracteres."),

        confirmPassword: z.string().min(1, "Confirma tu contraseña."),
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: "Las contraseñas no coinciden.",
        path: ["confirmPassword"],
    });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Valida el formulario. Si es correcto, devuelve los datos
 * ya limpios (con trim); si no, un error por campo.
 */
export function validateRegister(values: unknown): {
    data?: RegisterInput;
    errors: FieldErrors;
} {
    const result = registerSchema.safeParse(values);

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