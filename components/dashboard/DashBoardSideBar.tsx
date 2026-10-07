"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookOpen,
    ClipboardCheck,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Users,
} from "lucide-react";

interface DashboardSidebarProps {
    onLogout?: () => void;
}

const menuItems = [
    { label: "Inicio", href: "/dashboard", icon: LayoutDashboard },
    { label: "Alumnos", href: "/students", icon: Users },
    { label: "Materias", href: "/subjects", icon: BookOpen },
    { label: "Actividades", href: "/activities", icon: GraduationCap },
    { label: "Entregas", href: "/submissions", icon: ClipboardCheck },
];

export function DashboardSidebar({ onLogout }: DashboardSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === "/dashboard" ? pathname === href : pathname.startsWith(href);

    return (
        <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-[#D5DEE8] bg-white lg:flex">
            {/* Logo */}
            <div className="flex h-20 items-center gap-3 border-b border-[#D5DEE8] px-6">
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
            <nav aria-label="Principal" className="flex-1 space-y-1.5 p-4">
                {menuItems.map(({ label, href, icon: Icon }) => {
                    const active = isActive(href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#187A4C] ${
                                active
                                    ? "bg-[#187A4C] text-white shadow-[0_3px_0_#0F5233]"
                                    : "text-[#4A5568] hover:bg-[#DCEEF7] hover:text-[#187A4C]"
                            }`}
                        >
                            <Icon size={20} strokeWidth={2} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Cerrar sesión */}
            <div className="border-t border-[#D5DEE8] p-4">
                <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#C2392B] transition-colors hover:bg-[#FFF1EF] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#FF6B5B]"
                >
                    <LogOut size={20} strokeWidth={2} />
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </aside>
    );
}