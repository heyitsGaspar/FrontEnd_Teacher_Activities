"use client";

import { useState } from "react";

import Link from "next/link";

import axios from "axios";

import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    Shapes,
    User,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { register } from "../../app/services/auth/service";

import { getFieldErrors } from "@/lib/api-errors";

import {
    validateRegister,
    type FieldErrors,
} from "@/lib/validation/register";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

/*
 * Mensaje debajo de cada campo: muestra el error
 * o, si no hay, una pista opcional.
 */
function FieldMessage({
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

/*
 * Clases del input: borde rojo si tiene error.
 */
function inputClass(hasError: boolean, extra = "") {
    return `h-12 rounded-xl border-2 text-base ${extra} ${
        hasError
            ? "border-[#C2392B] focus-visible:border-[#C2392B] focus-visible:ring-[#C2392B]/20"
            : "border-[#D5DEE8] focus-visible:border-[#187A4C] focus-visible:ring-[#187A4C]/20"
    }`;
}

export function RegisterForm() {

    const router = useRouter();

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    /*
     * Datos del formulario.
     */
    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    /*
     * Estado de la petición.
     */
    const [loading, setLoading] =
        useState(false);

    /*
     * Errores por campo y error general.
     */
    const [fieldErrors, setFieldErrors] =
        useState<FieldErrors>({});

    const [formError, setFormError] =
        useState("");

    /*
     * Al escribir en un campo, quitamos su error.
     */
    const clearFieldError = (field: string) => {

        setFieldErrors((previous) => {

            if (!previous[field]) {
                return previous;
            }

            const next = { ...previous };

            delete next[field];

            return next;
        });
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setFormError("");

        /*
         * 1) Validamos con Zod antes de llamar al backend.
         * Si todo está bien, "data" ya viene sin espacios
         * sobrantes en nombre y correo.
         */
        const { data, errors } = validateRegister({
            name,
            email,
            password,
            confirmPassword,
        });

        if (!data) {

            setFieldErrors(errors);

            return;
        }

        setFieldErrors({});

        setLoading(true);

        try {

            /*
             * Enviamos únicamente los datos
             * que necesita el backend.
             *
             * confirmPassword NO se envía.
             */
            await register({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            /*
             * El backend ya creó:
             *
             * accessToken
             * refreshToken
             *
             * como cookies HttpOnly.
             */

            router.push("/dashboard");

        } catch (error) {

            /*
             * 2) Errores por campo que mande el backend.
             */
            const backendErrors = getFieldErrors(error);

            if (Object.keys(backendErrors).length > 0) {

                setFieldErrors(backendErrors);

                return;
            }

            /*
             * 3) Correo ya registrado.
             */
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 409
            ) {

                setFieldErrors({
                    email: "Ya existe una cuenta con ese correo.",
                });

                return;
            }

            /*
             * 4) Cualquier otro caso.
             */
            console.error("Error creando cuenta:", error);

            setFormError(
                "No se pudo crear la cuenta. Intenta de nuevo."
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#DCEEF7] px-4 py-12 font-sans text-[#1F2A44]">

            {/* Figuras decorativas */}

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
            >

                <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#FFD84D]" />

                <div className="absolute right-[8%] top-[10%] hidden rotate-12 text-[#FF6B5B] sm:block">

                    <Shapes
                        className="h-16 w-16"
                        strokeWidth={1.5}
                    />

                </div>

                <div className="absolute -bottom-20 -left-10 hidden h-64 w-64 rounded-[45%_55%_60%_40%] bg-[#187A4C] sm:block" />

                <div className="absolute -bottom-10 -right-10 h-48 w-48 rotate-12 bg-[#FF6B5B] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />

            </div>

            {/* Tarjeta */}

            <div className="relative w-full max-w-md">

                {/* Hojas de fondo */}

                <div
                    aria-hidden
                    className="absolute inset-0 rotate-3 rounded-3xl bg-[#FF6B5B]"
                />

                <div
                    aria-hidden
                    className="absolute inset-0 -rotate-2 rounded-3xl bg-[#FFD84D]"
                />

                {/* Cinta */}

                <div
                    aria-hidden
                    className="absolute -top-3 left-1/2 z-10 h-7 w-28 -translate-x-1/2 -rotate-3 rounded-sm bg-[#7CC6E8]/80"
                />

                <div className="relative rounded-3xl bg-white p-8 shadow-xl sm:p-10">

                    {/* Encabezado */}

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#187A4C] text-white">

                            <Shapes className="h-6 w-6" />

                        </div>

                        <div>

                            <h1 className="font-display text-3xl font-semibold tracking-tight">
                                Crear cuenta
                            </h1>

                            <p className="mt-1 text-sm text-[#5B6B80]">
                                Configura tu espacio de trabajo
                            </p>

                        </div>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="mt-8 space-y-5"
                    >

                        {/* Nombre */}

                        <div className="space-y-2">

                            <Label
                                htmlFor="name"
                                className="text-sm font-semibold"
                            >
                                Nombre
                            </Label>

                            <div className="relative">

                                <User
                                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A90]"
                                />

                                <Input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="María García"
                                    value={name}
                                    onChange={(event) => {
                                        setName(event.target.value);
                                        clearFieldError("name");
                                    }}
                                    aria-invalid={Boolean(fieldErrors.name)}
                                    aria-describedby="name-message"
                                    className={inputClass(
                                        Boolean(fieldErrors.name),
                                        "pl-10"
                                    )}
                                />

                            </div>

                            <FieldMessage
                                id="name-message"
                                error={fieldErrors.name}
                            />

                        </div>

                        {/* Email */}

                        <div className="space-y-2">

                            <Label
                                htmlFor="email"
                                className="text-sm font-semibold"
                            >
                                Correo electrónico
                            </Label>

                            <div className="relative">

                                <Mail
                                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A90]"
                                />

                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="maestra@ejemplo.com"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        clearFieldError("email");
                                    }}
                                    aria-invalid={Boolean(fieldErrors.email)}
                                    aria-describedby="email-message"
                                    className={inputClass(
                                        Boolean(fieldErrors.email),
                                        "pl-10"
                                    )}
                                />

                            </div>

                            <FieldMessage
                                id="email-message"
                                error={fieldErrors.email}
                            />

                        </div>

                        {/* Password */}

                        <div className="space-y-2">

                            <Label
                                htmlFor="password"
                                className="text-sm font-semibold"
                            >
                                Contraseña
                            </Label>

                            <div className="relative">

                                <Lock
                                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A90]"
                                />

                                <Input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        clearFieldError("password");
                                    }}
                                    aria-invalid={Boolean(fieldErrors.password)}
                                    aria-describedby="password-message"
                                    className={inputClass(
                                        Boolean(fieldErrors.password),
                                        "pl-10 pr-11"
                                    )}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) => !value
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#6B7A90] hover:text-[#1F2A44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#187A4C]"
                                >

                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}

                                </button>

                            </div>

                            <FieldMessage
                                id="password-message"
                                error={fieldErrors.password}
                                hint="Mínimo 8 caracteres."
                            />

                        </div>

                        {/* Confirmar password */}

                        <div className="space-y-2">

                            <Label
                                htmlFor="confirmPassword"
                                className="text-sm font-semibold"
                            >
                                Confirmar contraseña
                            </Label>

                            <div className="relative">

                                <Lock
                                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A90]"
                                />

                                <Input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(event) => {
                                        setConfirmPassword(
                                            event.target.value
                                        );
                                        clearFieldError("confirmPassword");
                                    }}
                                    aria-invalid={Boolean(
                                        fieldErrors.confirmPassword
                                    )}
                                    aria-describedby="confirm-message"
                                    className={inputClass(
                                        Boolean(fieldErrors.confirmPassword),
                                        "pl-10 pr-11"
                                    )}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (value) => !value
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#6B7A90] hover:text-[#1F2A44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#187A4C]"
                                >

                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}

                                </button>

                            </div>

                            <FieldMessage
                                id="confirm-message"
                                error={fieldErrors.confirmPassword}
                            />

                        </div>

                        {/* Error general */}

                        {formError && (
                            <div
                                role="alert"
                                className="rounded-xl border border-[#FF6B5B]/40 bg-[#FF6B5B]/15 px-4 py-3 text-sm font-medium text-[#9A2A1E]"
                            >
                                {formError}
                            </div>
                        )}

                        {/* Botón */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="font-display h-12 w-full rounded-full bg-[#187A4C] text-lg font-semibold text-white shadow-[0_4px_0_#0F5233] transition-transform hover:bg-[#1B8855] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#187A4C] active:translate-y-1 active:shadow-[0_0_0_#0F5233] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Creando cuenta..."
                                : "Crear cuenta"}
                        </button>

                    </form>

                    {/* Login */}

                    <p className="mt-8 text-center text-sm text-[#4A5568]">

                        ¿Ya tienes una cuenta?{" "}

                        <Link
                            href="/login"
                            className="font-semibold text-[#C2392B] underline-offset-4 hover:underline"
                        >
                            Iniciar sesión
                        </Link>

                    </p>

                </div>

            </div>

        </main>
    );
}