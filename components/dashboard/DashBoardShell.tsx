"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/app/services/auth/service";

import { DashboardHeader } from "./DashBoardHeader";
import { DashboardSidebar } from "./DashBoardSideBar";

interface CurrentUser {
    id: string;
    name: string;
    email: string;
}

export function DashboardShell({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch {
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [router]);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#DCEEF7]">
                <p className="text-sm font-medium text-[#4A5568]">Cargando...</p>
            </main>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-[#DCEEF7] text-[#1F2A44]">
            <DashboardSidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <DashboardHeader userName={user.name} />

                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}