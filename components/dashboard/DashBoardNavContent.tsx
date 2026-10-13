"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LogOut } from "lucide-react";

import { isRouteActive, menuItems } from "./MenuItems";

interface DashboardNavContentProps {
    onNavigate?: () => void;
    onLogout?: () => void;
    loggingOut?: boolean;
}

export function DashboardNavContent({
    onNavigate,
    onLogout,
    loggingOut = false,
}: DashboardNavContentProps) {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col bg-white">
            {/* Logo */}
            <div className="flex h-20 shrink-0 items-center gap-3 border-b border-[#D5DEE8] px-6">
                <div className="flex h-11 w-11 -rotate-3 items-center justify-center rounded-xl bg-[#FFD84D]">
                    <GraduationCap
                        size={22}
                        strokeWidth={2.5}
                        className="text-[#1F2A44]"
                    />
                </div>

                <div>
                    <p className="font-display text-lg font-semibold leading-tight text-[#1F2A44]">
                        Mis Actividades
                    </p>
                    <p className="text-xs text-[#4A5568]">Panel del profesor</p>
                </div>
            </div>

            {/* Navegación */}
            <nav aria-label="Principal" className="flex-1 space-y-1.5 overflow-y-auto p-4">
                {menuItems.map(
                    ({
                        label,
                        href,
                        icon: Icon,
                    }: {
                        label: string;
                        href: string;
                        icon: typeof GraduationCap;
                    }) => {
                        const active = isRouteActive(pathname, href);

                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={onNavigate}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#187A4C] ${active
                                    ? "bg-[#187A4C] text-white shadow-[0_3px_0_#0F5233]"
                                    : "text-[#4A5568] hover:bg-[#DCEEF7] hover:text-[#187A4C]"
                                    }`}
                            >
                                <Icon size={20} strokeWidth={2} />
                                <span>{label}</span>
                            </Link>
                        );
                    },
                )}
            </nav>

            {/* Cerrar sesión */}
            <div className="shrink-0 border-t border-[#D5DEE8] p-4">
                <button
                    type="button"
                    onClick={onLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#C2392B] transition-colors hover:bg-[#FFF1EF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B5B] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <LogOut size={20} strokeWidth={2} />
                    <span>{loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}</span>
                </button>
            </div>
        </div>
    );
}