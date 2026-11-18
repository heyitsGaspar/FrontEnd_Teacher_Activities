import type { BoardActivity } from "@/types/submissions";

type Trimester = {
    id: number;
    label: string;
};

export const TRIMESTERS: Trimester[] = [
    { id: 1, label: "Primer trimestre" },
    { id: 2, label: "Segundo trimestre" },
    { id: 3, label: "Tercer trimestre" },
    { id: 4, label: "Cuarto trimestre" },
];

export function getTrimesterLabel(trimesterId: number) {
    return (
        TRIMESTERS.find((trimester) => trimester.id === trimesterId)?.label ??
        `Trimestre ${trimesterId}`
    );
}

export function isActivityInTrimester(
    activity: Pick<BoardActivity, "trimester">,
    trimesterId: number
) {
    return activity.trimester === trimesterId;
}

export function filterActivitiesByTrimester(
    activities: BoardActivity[],
    trimesterId: number | "all"
) {
    return trimesterId === "all"
        ? activities
        : activities.filter((activity) =>
              isActivityInTrimester(activity, trimesterId)
          );
}
