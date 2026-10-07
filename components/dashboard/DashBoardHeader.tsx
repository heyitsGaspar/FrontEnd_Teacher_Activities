"use client";

import { Bell } from "lucide-react";

interface DashboardHeaderProps {
    userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
    const firstName = userName.trim().split(" ")[0];

    const today = new Date().toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
    const todayLabel = today.charAt(0).toUpperCase() + today.slice(1);

    return (
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-[#D5DEE8] bg-white px-6 sm:px-8">
            <div>
                <p className="text-sm text-[#4A5568]">{todayLabel}</p>
                <h2 className="font-display text-2xl font-semibold text-[#1F2A44]">
                    ¡Hola, {firstName}! 👋
                </h2>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    aria-label="Notificaciones"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6B7A90] transition-colors hover:bg-[#DCEEF7] hover:text-[#187A4C] focus-visible:outline focus-visible:outline-[#187A4C]"
                >
                    <Bell size={20} strokeWidth={2} />
                </button>

                <div className="flex items-center gap-3 border-l border-[#D5DEE8] pl-3">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-semibold leading-tight text-[#1F2A44]">
                            {userName}
                        </p>
                        <p className="text-xs text-[#4A5568]">Profesor</p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD84D] font-display text-base font-semibold text-[#1F2A44]">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
}