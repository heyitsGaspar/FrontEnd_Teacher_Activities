"use client";

import { useEffect, useRef } from "react";
import { Check, Clock, Users } from "lucide-react";
import Link from "next/link";

import { formatActivityDate } from "@/components/activities/activity-utils";

import type {
    BoardActivity,
    BoardStudent,
    BoardSubmission,
} from "@/types/submissions";

interface SubmissionBoardProps {
    activities: BoardActivity[];
    students: BoardStudent[];
    highlightedId: string | null;
    onUndo: (
        student: BoardStudent,
        activity: BoardActivity,
        submission: BoardSubmission
    ) => void;
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function SubmissionBoard({
    activities,
    students,
    highlightedId,
    onUndo,
}: SubmissionBoardProps) {
    const activeHeaderRef = useRef<HTMLTableCellElement>(null);

    /* Al abrir, desplazamos la tabla hasta la actividad activa. */
    useEffect(() => {
        activeHeaderRef.current?.scrollIntoView({
            inline: "center",
            block: "nearest",
        });
    }, [activities]);

    /* Al escanear, nos aseguramos de que la fila sea visible. */
    useEffect(() => {
        if (!highlightedId) {
            return;
        }

        document
            .getElementById(`student-row-${highlightedId}`)
            ?.scrollIntoView({ block: "nearest" });
    }, [highlightedId]);

    if (students.length === 0) {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="flex h-14 w-14 -rotate-3 items-center justify-center rounded-2xl bg-[#FFD84D]">
                    <Users size={26} className="text-[#1F2A44]" />
                </div>

                <div>
                    <p className="font-display text-lg font-semibold text-[#1F2A44]">
                        Aún no tienes alumnos
                    </p>

                    <p className="mt-1 text-sm text-[#5B6B80]">
                        Agrega a tu grupo para empezar a registrar entregas.
                    </p>
                </div>

                <Link
                    href="/alumnos"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-[#187A4C] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1B8855]"
                >
                    Ir a alumnos
                </Link>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="p-8 text-center text-sm text-[#5B6B80]">
                Crea una actividad para empezar a registrar entregas.
            </div>
        );
    }

    return (
        <div className="max-h-[65vh] min-h-72 overflow-auto">
            <table className="w-max min-w-full border-separate border-spacing-0">
                <caption className="sr-only">
                    Entregas de los alumnos por actividad
                </caption>

                <thead>
                    <tr>
                        <th
                            scope="col"
                            className="sticky left-0 top-0 z-30 h-16 w-40 border-b border-r border-[#D5DEE8] bg-[#F7FAFC] px-4 text-left text-sm font-semibold text-[#1F2A44] sm:w-56"
                        >
                            Alumno
                        </th>

                        {activities.map((activity) => {
                            const delivered = students.filter(
                                (student) => student.submissions[activity.id]
                            ).length;

                            return (
                                <th
                                    key={activity.id}
                                    ref={
                                        activity.active
                                            ? activeHeaderRef
                                            : undefined
                                    }
                                    scope="col"
                                    className={`sticky top-0 z-20 border-b border-r border-[#D5DEE8] p-0 text-left align-top hover:z-35 focus-within:z-35 ${activity.active
                                            ? "bg-[#187A4C] text-white"
                                            : "bg-[#F7FAFC] text-[#1F2A44]"
                                        }`}
                                >
                                    <div
                                        tabIndex={0}
                                        className="group relative h-16 w-36 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFD84D]"
                                    >
                                        {/* Vista compacta */}
                                        <div className="flex h-full flex-col justify-center gap-1 px-3">
                                            {activity.active && (
                                                <span className="w-fit rounded-full bg-[#FFD84D] px-2 py-0.5 text-[11px] font-semibold text-[#1F2A44]">
                                                    Activa
                                                </span>
                                            )}

                                            <span className="line-clamp-2 text-sm font-semibold leading-tight">
                                                {activity.title}
                                            </span>
                                        </div>

                                        {/* Vista expandida al pasar el cursor */}
                                        <div className="invisible absolute left-0 top-0 z-40 w-64 rounded-2xl bg-white p-4 text-[#1F2A44] opacity-0 shadow-xl ring-1 ring-[#D5DEE8] transition-opacity group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100">
                                            <p className="wrap-break-word font-display text-base font-semibold leading-tight">
                                                {activity.title}
                                            </p>

                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                                                <span className="rounded-full bg-[#DCEEF7] px-3 py-1 font-medium">
                                                    {activity.subjectName}
                                                </span>

                                                <span className="text-[#4A5568]">
                                                    {formatActivityDate(
                                                        activity.activityDate
                                                    )}
                                                </span>
                                            </div>

                                            <p className="mt-3 text-sm font-semibold text-[#187A4C]">
                                                {delivered} de {students.length}{" "}
                                                entregaron
                                            </p>
                                        </div>
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>

                <tbody>
                    {students.map((student) => {
                        const highlighted = highlightedId === student.id;

                        return (
                            <tr
                                key={student.id}
                                id={`student-row-${student.id}`}
                                className="scroll-mt-16"
                            >
                                <th
                                    scope="row"
                                    className={`sticky left-0 z-10 w-40 border-b border-r border-[#E3E8EF] px-4 py-3 text-left text-sm font-medium text-[#1F2A44] transition-colors sm:w-56 ${highlighted
                                            ? "bg-[#FFF3BF]"
                                            : "bg-white"
                                        }`}
                                >
                                    <span className="block truncate">
                                        {student.name}
                                    </span>
                                </th>

                                {activities.map((activity) => {
                                    const submission =
                                        student.submissions[activity.id];

                                    return (
                                        <td
                                            key={activity.id}
                                            className={`border-b border-r border-[#E3E8EF] p-2 text-center transition-colors ${highlighted
                                                    ? "bg-[#FFF3BF]"
                                                    : activity.active
                                                        ? "bg-[#187A4C]/5"
                                                        : "bg-white"
                                                }`}
                                        >
                                            {submission ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onUndo(
                                                            student,
                                                            activity,
                                                            submission
                                                        )
                                                    }
                                                    title="Clic para quitar esta entrega"
                                                    aria-label={`Quitar la entrega de ${student.name} en ${activity.title}`}
                                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#187A4C]/15 px-3 py-1.5 text-xs font-semibold text-[#0F5233] transition-shadow hover:ring-2 hover:ring-[#187A4C]/40 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#187A4C]"
                                                >
                                                    <Check
                                                        size={14}
                                                        strokeWidth={3}
                                                    />
                                                    {formatTime(
                                                        submission.createdAt
                                                    )}
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B5B]/15 px-3 py-1.5 text-xs font-semibold text-[#9A2A1E]">
                                                    <Clock size={14} />
                                                    Pendiente
                                                </span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}