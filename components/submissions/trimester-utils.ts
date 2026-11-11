import type { BoardActivity } from "@/types/submissions";

type Trimester = {
    id: number;
    label: string;
    months: number[];
};

export const TRIMESTERS: Trimester[] = [
    { id: 1, label: "Trimestre 1", months: [9, 10, 11] },
    { id: 2, label: "Trimestre 2", months: [12, 1, 2] },
    { id: 3, label: "Trimestre 3", months: [3, 4, 5, 6, 7, 8] },
];

export function isActivityInTrimester(
    activity: Pick<BoardActivity, "activityDate">,
    trimesterId: number
) {
    const trimester = TRIMESTERS.find((item) => item.id === trimesterId);
    if (!trimester || !activity.activityDate) return false;

    return trimester.months.includes(Number(activity.activityDate.slice(5, 7)));
}
