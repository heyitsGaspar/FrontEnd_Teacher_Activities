"use client";

import { Copy, GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DeliveryStatus } from "./DeliveryStatus";
import type { Activity } from "@/types/activities";

import { formatActivityDate } from "./activity-utils";

interface ActivityTableProps {
    activities: Activity[];
    loading?: boolean;
    onEdit: (activity: Activity) => void;
    onRepeat: (activity: Activity) => void;
    onDelete: (activity: Activity) => void;
    onCreate?: () => void;
}

export function ActivityTable({
    activities,
    loading = false,
    onEdit,
    onRepeat,
    onDelete,
    onCreate,
}: ActivityTableProps) {
    if (loading) {
        return (
            <div
                className="space-y-3 p-6"
                aria-busy="true"
                aria-label="Cargando actividades"
            >
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className="h-12 w-full rounded-xl"
                    />
                ))}
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="flex h-14 w-14 -rotate-3 items-center justify-center rounded-2xl bg-[#FFD84D]">
                    <GraduationCap size={26} className="text-[#1F2A44]" />
                </div>

                <div>
                    <p className="font-display text-lg font-semibold text-[#1F2A44]">
                        Aún no tienes actividades
                    </p>

                    <p className="mt-1 text-sm text-[#5B6B80]">
                        Crea la primera para empezar a repartirla.
                    </p>
                </div>

                {onCreate && (
                    <Button
                        type="button"
                        onClick={onCreate}
                        className="bg-[#187A4C] text-white hover:bg-[#1B8855]"
                    >
                        <Plus size={18} />
                        Crear actividad
                    </Button>
                )}
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Actividad</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Materia
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Fecha
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Entregas</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {activities.map((activity) => (
                    <TableRow
                        key={activity.id}
                        className={
                            activity.active
                                ? "bg-[#187A4C]/5 hover:bg-[#187A4C]/10"
                                : undefined
                        }
                    >
                        <TableCell>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium text-[#1F2A44]">
                                    {activity.title}
                                </span>

                                {activity.active && (
                                    <Badge className="bg-[#187A4C] text-white hover:bg-[#187A4C]">
                                        Activa
                                    </Badge>
                                )}
                            </div>

                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#5B6B80] md:hidden">
                                <span>{activity.subjectName}</span>
                                <span>
                                    {formatActivityDate(activity.activityDate)}
                                </span>
                            </div>
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                            <span className="rounded-full bg-[#DCEEF7] px-3 py-1 text-sm font-medium text-[#1F2A44]">
                                {activity.subjectName}
                            </span>
                        </TableCell>

                        <TableCell className="hidden whitespace-nowrap text-[#4A5568] md:table-cell">
                            {formatActivityDate(activity.activityDate)}
                        </TableCell>    
                        <TableCell className="hidden md:table-cell">
                            <DeliveryStatus activity={activity} />
                        </TableCell>

                        <TableCell>
                            <div className="flex justify-end gap-1 sm:gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onRepeat(activity)}
                                    className="text-[#1F2A44] hover:bg-[#DCEEF7] hover:text-[#187A4C]"
                                >
                                    <Copy size={18} />
                                    <span className="sr-only">
                                        Repetir actividad
                                    </span>
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(activity)}
                                    className="text-[#1F2A44] hover:bg-[#DCEEF7] hover:text-[#187A4C]"
                                >
                                    <Pencil size={18} />
                                    <span className="sr-only">
                                        Editar actividad
                                    </span>
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(activity)}
                                    className="text-[#C2392B] hover:bg-[#FFF1EF] hover:text-[#C2392B]"
                                >
                                    <Trash2 size={18} />
                                    <span className="sr-only">
                                        Eliminar actividad
                                    </span>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}