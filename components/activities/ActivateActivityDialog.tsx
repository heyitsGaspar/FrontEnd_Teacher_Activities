"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import type { Activity } from "@/types/activities";

import { formatActivityDate } from "./activity-utils";

interface ActivateActivityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    activities: Activity[];
    loading: boolean;
    activating: boolean;
    onConfirm: (id: string) => void;
}

interface PickerProps {
    activities: Activity[];
    loading: boolean;
    activating: boolean;
    onCancel: () => void;
    onConfirm: (id: string) => void;
}

function Picker({
    activities,
    loading,
    activating,
    onCancel,
    onConfirm,
}: PickerProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const currentId = activities.find((a) => a.active)?.id ?? null;
    const canConfirm =
        selectedId !== null && selectedId !== currentId && !activating;

    return (
        <div className="space-y-5">
            <DialogHeader>
                <DialogTitle className="font-display text-xl">
                    Activar actividad
                </DialogTitle>

                <DialogDescription>
                    Elige cuál será tu actividad en curso.
                </DialogDescription>
            </DialogHeader>

            {loading ? (
                <div className="space-y-2" aria-busy="true">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-16 w-full rounded-2xl"
                        />
                    ))}
                </div>
            ) : activities.length === 0 ? (
                <p className="py-6 text-center text-sm text-[#5B6B80]">
                    Aún no tienes actividades. Crea una primero.
                </p>
            ) : (
                <div
                    role="radiogroup"
                    aria-label="Actividades"
                    className="max-h-72 space-y-2 overflow-y-auto pr-1"
                >
                    {activities.map((activity) => {
                        const selected = selectedId === activity.id;

                        return (
                            <label
                                key={activity.id}
                                className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 transition-colors has-focus-visible:outline has-focus-visible:outline-offset-2 has-focus-visible:outline-[#187A4C] ${
                                    selected
                                        ? "border-[#187A4C] bg-[#187A4C]/5"
                                        : "border-[#E3E8EF] hover:border-[#187A4C]/50"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="activity-to-activate"
                                    value={activity.id}
                                    checked={selected}
                                    onChange={() => setSelectedId(activity.id)}
                                    className="sr-only"
                                />

                                <span
                                    aria-hidden
                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                                        selected
                                            ? "border-[#187A4C] bg-[#187A4C] text-white"
                                            : "border-[#C5CFDA]"
                                    }`}
                                >
                                    {selected && (
                                        <Check size={14} strokeWidth={3} />
                                    )}
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="block truncate font-semibold text-[#1F2A44]">
                                        {activity.title}
                                    </span>

                                    <span className="block text-sm text-[#5B6B80]">
                                        {activity.subjectName},{" "}
                                        {formatActivityDate(activity.activityDate)}
                                    </span>
                                </span>

                                {activity.active && (
                                    <Badge className="bg-[#187A4C] text-white hover:bg-[#187A4C]">
                                        Activa
                                    </Badge>
                                )}
                            </label>
                        );
                    })}
                </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={activating}
                >
                    Cancelar
                </Button>

                <Button
                    type="button"
                    disabled={!canConfirm}
                    onClick={() => selectedId && onConfirm(selectedId)}
                    className="bg-[#187A4C] text-white hover:bg-[#1B8855]"
                >
                    {activating ? "Activando..." : "Activar actividad"}
                </Button>
            </DialogFooter>
        </div>
    );
}

export function ActivateActivityDialog({
    open,
    onOpenChange,
    ...pickerProps
}: ActivateActivityDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <Picker
                    {...pickerProps}
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}