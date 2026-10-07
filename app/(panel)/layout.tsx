import { DashboardShell } from "@/components/dashboard/DashBoardShell";

export default function PanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardShell>{children}</DashboardShell>;
}