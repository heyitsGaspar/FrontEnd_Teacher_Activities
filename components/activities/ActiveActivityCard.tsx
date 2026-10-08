"use client";

import { CalendarDays, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { Activity } from "@/types/activities";

import { formatActivityDate } from "./activity-utils";

interface ActiveActivityCardProps {
    activity: Activity | null;
    loading: boolean;
    onChange: () => void;
}

export function ActiveActivityCard({
    activity,
    loading,
    onChange,
}: ActiveActivityCardProps) {
    if (loading) {
        return <Skeleton className="h-32 w-full rounded-3xl" />;
    }

    if (!activity) {
        return (
            <section className="flex flex-col gap-4 rounded-3xl border-2 border-dashed border-[#9FB6C6] bg-white/60 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 -rotate-3 items-center justify-center rounded-2xl bg-[#7CC6E8]/50 text-[#1F2A44]">
                        <Zap size={24} />
                    </div>

                    <div>
                        <p className="font-display text-lg font-semibold text-[#1F2A44]">
                            No hay una actividad activa
                        </p>
                        <p className="text-sm text-[#4A5568]">
                            Elige cuál será la actividad en curso.
                        </p>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={onChange}
                    className="w-full bg-[#187A4C] text-white hover:bg-[#1B8855] md:w-auto"
                >
                    Activar actividad
                </Button>
            </section>
        );
    }

    return (
        <section className="relative overflow-hidden rounded-3xl bg-[#187A4C] p-6 text-white shadow-md sm:p-8">
            <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#FFD84D]/25"
            />

            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 -rotate-3 items-center justify-center rounded-2xl bg-[#FFD84D] text-[#1F2A44]">
                        <Zap size={24} />
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white/90">
                            Actividad activa
                        </p>

                        <h2 className="wrap-break-word font-display text-2xl font-semibold leading-tight">
                            {activity.title}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                            <span className="rounded-full bg-white/20 px-3 py-1 font-medium">
                                {activity.subjectName}
                            </span>

                            <span className="inline-flex items-center gap-1.5 text-white/90">
                                <CalendarDays size={16} />
                                {formatActivityDate(activity.activityDate)}
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={onChange}
                    className="w-full bg-[#FFD84D] text-[#1F2A44] hover:bg-[#FFE27A] md:w-auto"
                >
                    Cambiar actividad
                </Button>
            </div>
        </section>
    );
}