import {
    BookOpen,
    ClipboardCheck,
    GraduationCap,
    LayoutDashboard,
    Users,
} from "lucide-react";

export const menuItems = [
    { label: "Inicio", href: "/dashboard", icon: LayoutDashboard },
    { label: "Alumnos", href: "/students", icon: Users },
    { label: "Materias", href: "/subjects", icon: BookOpen },
    { label: "Actividades", href: "/activities", icon: GraduationCap },
    { label: "Entregas", href: "/submissions", icon: ClipboardCheck },
];

export const isRouteActive = (pathname: string, href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);