import axios from "axios";

import type { FieldErrors } from "./validation/register";

/**
 * Si el backend respondió 400 con el detalle por campo,
 * devuelve { password: "...", email: "..." }.
 */
export function getFieldErrors(error: unknown): FieldErrors {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
        const errors = error.response.data?.errors;

        if (errors && typeof errors === "object" && !Array.isArray(errors)) {
            return errors as FieldErrors;
        }
    }

    return {};
}