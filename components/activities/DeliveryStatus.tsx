import { Check } from "lucide-react";

import type { Activity } from "@/types/activities";

type Counts = Pick<Activity, "submissionsCount" | "totalStudents">;

export function isActivityComplete({
    submissionsCount,
    totalStudents,
}: Counts) {
    return totalStudents > 0 && submissionsCount >= totalStudents;
}

export function DeliveryStatus({ activity }: { activity: Counts }) {
    const done = activity.submissionsCount;
    const total = activity.totalStudents;

    if (total === 0) {
        return <span className="text-xs text-[#5B6B80]">Sin alumnos</span>;
    }

    if (isActivityComplete(activity)) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#187A4C]/15 px-2.5 py-1 text-xs font-semibold text-[#0F5233]">
                <Check size={13} strokeWidth={3} />
                Completa
            </span>
        );
    }

    const percent = Math.round((done / total) * 100);

    return (
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F2A44]">
            <span
                role="progressbar"
                aria-label="Entregas registradas"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={done}
                className="h-2 w-16 overflow-hidden rounded-full bg-[#DCEEF7]"
            >
                <span
                    className="block h-full rounded-full bg-[#FFD84D]"
                    style={{ width: `${percent}%` }}
                />
            </span>

            {done}/{total}
        </span>
    );
}