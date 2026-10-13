"use client";

import { DashboardNavContent } from "./DashBoardNavContent";

interface DashboardSidebarProps {
    onLogout?: () => void;
    loggingOut?: boolean;
}

export function DashboardSidebar({
    onLogout,
    loggingOut,
}: DashboardSidebarProps) {
    return (
        <aside className="hidden h-dvh w-64 shrink-0 border-r border-[#D5DEE8] lg:block">
            <DashboardNavContent
                onLogout={onLogout}
                loggingOut={loggingOut}
            />
        </aside>
    );
}