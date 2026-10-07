"use client";

import Link from "next/link";
import {
    BookOpen,
    ClipboardCheck,
    GraduationCap,
    Users,
    type LucideIcon,
} from "lucide-react";

const stats: {
    label: string;
    hint: string;
    icon: LucideIcon;
    chip: string;
    rotate: string;
}[] = [
    { label: "Alumnos", hint: "Agrega a tu grupo", icon: Users, chip: "bg-[#7CC6E8]/40", rotate: "-rotate-3" },
    { label: "Materias", hint: "Organiza tus clases", icon: BookOpen, chip: "bg-[#FFD84D]/60", rotate: "rotate-2" },
    { label: "Actividades", hint: "Crea la primera", icon: GraduationCap, chip: "bg-[#FF6B5B]/25", rotate: "-rotate-2" },
    { label: "Entregas", hint: "Aquí verás las tareas", icon: ClipboardCheck, chip: "bg-[#187A4C]/20", rotate: "rotate-3" },
];

// Es una secuencia real, por eso van numerados
const firstSteps = [
    { title: "Agrega a tus alumnos", text: "Registra a los niños de tu grupo.", href: "/students" },
    { title: "Crea tus materias", text: "Español, Matemáticas, Artes…", href: "/subjects" },
    { title: "Prepara una actividad", text: "Asígnala y revisa las entregas.", href: "/activities" },
];

export function DashboardContent() {
    return (
        <div className="relative min-h-full overflow-hidden p-6 sm:p-8">
            {/* Figuras de fondo, igual que en el login */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFD84D]/60" />
                <div className="absolute -bottom-12 right-10 h-32 w-32 rotate-12 bg-[#FF6B5B]/30 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
            </div>

            <div className="relative mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="font-display text-4xl font-semibold tracking-tight">
                        Resumen
                    </h1>
                    <p className="mt-1 text-[#4A5568]">
                        Aquí podrás gestionar las actividades de tu grupo.
                    </p>
                </div>

                {/* Tarjetas */}
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map(({ label, hint, icon: Icon, chip, rotate }) => (
                        <div key={label} className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <p className="text-sm font-semibold text-[#4A5568]">{label}</p>
                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${chip} ${rotate}`}
                                >
                                    <Icon size={22} strokeWidth={2} />
                                </div>
                            </div>
                            <p className="mt-3 font-display text-4xl font-semibold">0</p>
                            <p className="mt-1 text-sm text-[#4A5568]">{hint}</p>
                        </div>
                    ))}
                </div>

                {/* Primeros pasos */}
                <section className="relative mt-10 max-w-2xl">
                    <div aria-hidden className="absolute inset-0 rotate-1 rounded-3xl bg-[#FFD84D]" />
                    <div
                        aria-hidden
                        className="absolute -top-3 left-10 z-10 h-6 w-24 -rotate-3 rounded-sm bg-[#7CC6E8]/80"
                    />

                    <div className="relative rounded-3xl bg-white p-6 shadow-md sm:p-8">
                        <h2 className="font-display text-2xl font-semibold">Prepara tu salón</h2>
                        <p className="mt-1 text-[#4A5568]">
                            Tres pasos y ya puedes repartir tu primera actividad.
                        </p>

                        <ol className="mt-6 space-y-3">
                            {firstSteps.map((step, i) => (
                                <li key={step.href}>
                                    <Link
                                        href={step.href}
                                        className="group flex items-center gap-4 rounded-2xl border-2 border-[#E3E8EF] p-4 transition-colors hover:border-[#187A4C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#187A4C]"
                                    >
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#187A4C] font-display text-base font-semibold text-white">
                                            {i + 1}
                                        </span>
                                        <span>
                                            <span className="block font-semibold">{step.title}</span>
                                            <span className="block text-sm text-[#4A5568]">
                                                {step.text}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>
            </div>
        </div>
    );
}