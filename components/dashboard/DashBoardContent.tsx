"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "../../app/services/auth/service";

interface CurrentUser {
    id: string;
    name: string;
    email: string;
}

export function DashboardContent() {

    const router = useRouter();

    const [user, setUser] =
        useState<CurrentUser | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const loadUser = async () => {

            try {

                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);

            } catch {

                // Si el backend responde 401,
                // significa que no existe una sesión válida.

                router.replace("/login");

            } finally {

                setLoading(false);
            }
        };

        loadUser();

    }, [router]);

    /*
     * Mientras comprobamos la sesión
     * mostramos un estado de carga.
     */
    if (loading) {

        return (
            <main className="flex min-h-screen items-center justify-center bg-[#DCEEF7]">

                <p className="text-[#1F2A44]">
                    Cargando...
                </p>

            </main>
        );
    }

    /*
     * Si no existe usuario no mostramos
     * el contenido del dashboard.
     *
     * El usuario será redirigido al login.
     */
    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-[#DCEEF7] p-8">

            <div className="mx-auto max-w-7xl">

                <div className="rounded-3xl bg-white p-8 shadow-lg">

                    <p className="text-sm font-medium text-[#4A5568]">
                        Bienvenido
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-[#1F2A44]">
                        {user.name}
                    </h1>

                    <p className="mt-2 text-[#4A5568]">
                        {user.email}
                    </p>

                </div>

            </div>

        </main>
    );
}