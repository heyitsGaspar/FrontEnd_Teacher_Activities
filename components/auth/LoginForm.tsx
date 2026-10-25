"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail, Shapes, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { login } from "../../app/services/auth/service";

import { getFieldErrors } from "@/lib/api-errors";
import type { FieldErrors } from "@/lib/validation/register";
import { validateLogin } from "@/lib/validation/login";

import { FieldMessage, inputClass } from "@/components/auth/form-helpers";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/*
 * Paleta "papel de china":
 *   pared   #DCEEF7   sol    #FFD84D   coral  #FF6B5B
 *   pasto   #187A4C   cielo  #7CC6E8   tinta  #1F2A44
 */

export function LoginForm() {
    const router = useRouter();
    // dentro del componente, junto a useRouter:
    const searchParams = useSearchParams();
    const sessionExpired = searchParams.get("expired") === "1";

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const wakeUrl = apiUrl
            ? new URL("/api/auth/me", apiUrl).toString()
            : "/api/auth/me";

        void fetch(wakeUrl, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        }).then((response) => {
            if (response.status >= 500) {
                console.warn(
                    `No se pudo preparar el servidor de la API (HTTP ${response.status}).`
                );
            }
        }).catch((error: unknown) => {
            console.warn("No se pudo conectar con la API para prepararla.", error);
        });
    }, []);

    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    /*
     * Errores por campo y error general.
     */
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState("");

    /*
     * Al escribir en un campo quitamos su error,
     * y también el error general de credenciales.
     */
    const clearErrors = (field: string) => {
        setFormError("");

        setFieldErrors((previous) => {
            if (!previous[field]) {
                return previous;
            }

            const next = { ...previous };

            delete next[field];

            return next;
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setFormError("");

        /*
         * 1) Validamos con Zod antes de llamar al backend.
         * Si todo está bien, "data" trae el correo sin
         * espacios sobrantes.
         */
        const { data, errors } = validateLogin({ email, password });

        if (!data) {
            setFieldErrors(errors);

            return;
        }

        setFieldErrors({});

        setLoading(true);

        try {
            await login({
                email: data.email,
                password: data.password,
            });

            /*
             * Las cookies ya fueron creadas
             * por Spring Boot.
             *
             * No necesitamos guardar ningún token.
             */

            router.push("/dashboard");
        } catch (error: unknown) {
            // 1. Demasiados intentos de inicio de sesión (HTTP 429).
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 429
            ) {
                const message = error.response.data?.message;

                setFormError(
                    typeof message === "string"
                        ? message
                        : "Demasiados intentos. Espera unos minutos e inténtalo de nuevo."
                );

                return;
            }

            // 2. Errores de validación enviados por el backend.
            const backendErrors = getFieldErrors(error);

            if (Object.keys(backendErrors).length > 0) {
                setFieldErrors(backendErrors);
                return;
            }

            // 3. Credenciales incorrectas (HTTP 401).
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 401
            ) {
                setFormError("Correo o contraseña incorrectos.");
                return;
            }

            // 4. Otros errores.
            // 4. Otros errores.
            const status = axios.isAxiosError(error) ? error.response?.status : undefined;

            setFormError(
                status === 500 || status === 502 || status === 503 || status === 504
                    ? "El servidor está despertando. Espera unos segundos e inténtalo de nuevo."
                    : "No se pudo iniciar sesión. Intenta de nuevo."
            );


        } finally {
            setLoading(false);
        }

    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#DCEEF7] px-4 py-12 font-sans text-[#1F2A44]">
            {/* Figuras recortadas, como en la pared de un salón */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#FFD84D]" />
                <div className="absolute right-[8%] top-[10%] hidden rotate-12 text-[#FF6B5B] sm:block">
                    <Star className="h-16 w-16 fill-current" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-20 -left-10 hidden h-64 w-64 rounded-[45%_55%_60%_40%] bg-[#187A4C] sm:block" />
                <div className="absolute -bottom-10 -right-10 h-48 w-48 rotate-12 bg-[#FF6B5B] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
                <div className="absolute bottom-[14%] left-[16%] hidden h-6 w-6 rounded-full bg-[#7CC6E8] md:block" />
                <div className="absolute left-[12%] top-[38%] hidden h-4 w-4 rotate-45 bg-[#FF6B5B] md:block" />
            </div>

            {/* Hojas apiladas + tarjeta principal */}
            <div className="relative w-full max-w-md">
                <div
                    aria-hidden
                    className="absolute inset-0 rotate-3 rounded-3xl bg-[#FF6B5B]"
                />
                <div
                    aria-hidden
                    className="absolute inset-0 -rotate-2 rounded-3xl bg-[#FFD84D]"
                />

                {/* Cinta adhesiva */}
                <div
                    aria-hidden
                    className="absolute -top-3 left-1/2 z-10 h-7 w-28 -translate-x-1/2 -rotate-3 rounded-sm bg-[#7CC6E8]/80"
                />

                <div className="relative rounded-3xl bg-white p-8 shadow-xl sm:p-10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#187A4C] text-white">
                            <Shapes className="h-6 w-6" />
                        </div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight">
                            Mis Actividades
                        </h1>
                    </div>

                    <p className="mt-4 text-base leading-relaxed text-[#4A5568]">
                        Prepara, reparte y revisa las actividades de tu grupo.
                    </p>
                    {sessionExpired && !formError && (
                        <div
                            role="status"
                            className="mt-6 rounded-xl border border-[#7CC6E8]/60 bg-[#DCEEF7] px-4 py-3 text-sm font-medium text-[#1F2A44]"
                        >
                            Tu sesión expiró. Inicia sesión de nuevo para continuar.
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="mt-8 space-y-5"
                    >
                        {/* Correo */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold">
                                Correo electrónico
                            </Label>

                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A90]" />

                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="maestra@ejemplo.com"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        clearErrors("email");
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

                        {/* Contraseña */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-semibold">
                                    Contraseña
                                </Label>

                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-[#187A4C] underline-offset-4 hover:underline"
                                >
                                    ¿La olvidaste?
                                </Link>
                            </div>

                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A90]" />

                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        clearErrors("password");
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
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={
                                        showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
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
                            />
                        </div>

                        {/* Error general (credenciales, red, servidor) */}
                        {formError && (
                            <div
                                role="alert"
                                className="rounded-xl border border-[#FF6B5B]/40 bg-[#FF6B5B]/15 px-4 py-3 text-sm font-medium text-[#9A2A1E]"
                            >
                                {formError}
                            </div>
                        )}

                        {/* Botón tipo "pegatina" con relieve */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="font-display h-12 w-full rounded-full bg-[#187A4C] text-lg font-semibold text-white shadow-[0_4px_0_#0F5233] transition-transform hover:bg-[#1B8855] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#187A4C] active:translate-y-1 active:shadow-[0_0_0_#0F5233] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-[#4A5568]">
                        ¿Aún no tienes cuenta?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-[#C2392B] underline-offset-4 hover:underline"
                        >
                            Crear cuenta
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}