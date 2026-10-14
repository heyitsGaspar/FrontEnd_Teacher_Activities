
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, LoaderCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/auth/forgot-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ?? data?.detail ?? "No se pudo procesar la solicitud."
                );
            }

            setMessage(
                typeof data === "string"
                    ? data
                    : "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña."
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo conectar con el servidor."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <Link
                    href="/login"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft size={16} />
                    Volver al inicio de sesión
                </Link>

                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Mail size={24} />
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    ¿Olvidaste tu contraseña?
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                    Introduce el correo asociado a tu cuenta. Si está registrado,
                    te enviaremos un enlace para crear una contraseña nueva.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Correo electrónico
                        </label>

                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            maxLength={254}
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="tu@correo.com"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {message && (
                        <p
                            role="status"
                            className="rounded-lg bg-green-50 p-3 text-sm text-green-800"
                        >
                            {message}
                        </p>
                    )}

                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading && <LoaderCircle size={18} className="animate-spin" />}
                        {loading ? "Enviando..." : "Enviar enlace de recuperación"}
                    </button>
                </form>
            </section>
        </main>
    );
}
