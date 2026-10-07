"use client";

import { Bell, Menu } from "lucide-react";

interface DashboardHeaderProps {
    userName: string;
    onMenuClick?: () => void;
}

export function DashboardHeader({ userName, onMenuClick }: DashboardHeaderProps) {
    const firstName = userName.trim().split(" ")[0];

    const today = new Date().toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
    const todayLabel = today.charAt(0).toUpperCase() + today.slice(1);

    return (
        <header className="flex h-20 shrink-0 items-center justify-between gap-3 border-b border-[#D5DEE8] bg-white px-4 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Abrir menú"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#1F2A44] transition-colors hover:bg-[#DCEEF7] hover:text-[#187A4C] focus-visible:outline focus-visible:outline-[#187A4C] lg:hidden"
                >
                    <Menu size={22} strokeWidth={2} />
                </button>

                <div className="min-w-0">
                    <p className="hidden text-sm text-[#4A5568] sm:block">{todayLabel}</p>
                    <h2 className="truncate font-display text-xl font-semibold text-[#1F2A44] sm:text-2xl">
                        ¡Hola, {firstName}! 👋
                    </h2>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
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