"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Activity } from "@/types/activities";
import type { Subject } from "@/types/subjects";

import { todayISO } from "./activity-utils";

export type ActivityDialogMode = "create" | "edit" | "repeat";

export interface ActivityFormValues {
    subjectId: string;
    title: string;
    activityDate: string;
    activate: boolean;
}

const copy = {
    create: {
        title: "Nueva actividad",
        description: "Elige la materia, el nombre y la fecha.",
        submit: "Crear actividad",
    },
    edit: {
        title: "Editar actividad",
        description: "Cambia los datos de la actividad.",
        submit: "Guardar cambios",
    },
    repeat: {
        title: "Repetir actividad",
        description: "Crea una copia con una nueva fecha.",
        submit: "Repetir actividad",
    },
} as const;

interface ActivityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: ActivityDialogMode;
    activity: Activity | null;
    subjects: Subject[];
    loadingSubjects: boolean;
    loading: boolean;
    currentActive: Activity | null;
    onSubmit: (values: ActivityFormValues) => void;
}

interface ActivityFormProps extends Omit<ActivityDialogProps, "open" | "onOpenChange"> {
    onCancel: () => void;
}

function ActivityForm({
    mode,
    activity,
    subjects,
    loadingSubjects,
    loading,
    currentActive,
    onSubmit,
    onCancel,
}: ActivityFormProps) {
    const [subjectId, setSubjectId] = useState(activity?.subjectId ?? "");
    const [title, setTitle] = useState(activity?.title ?? "");
    const [activityDate, setActivityDate] = useState(
        mode === "edit" && activity ? activity.activityDate : todayISO()
    );
    const [activate, setActivate] = useState(false);

    const canActivate = mode !== "edit";
    const noSubjects = !loadingSubjects && subjects.length === 0;
    const isValid =
        subjectId !== "" && title.trim() !== "" && activityDate !== "";

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isValid || loading) {
            return;
        }

        onSubmit({
            subjectId,
            title: title.trim(),
            activityDate,
            activate: canActivate && activate,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
                <DialogTitle className="font-display text-xl">
                    {copy[mode].title}
                </DialogTitle>

                <DialogDescription>
                    {copy[mode].description}
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
                <Label htmlFor="activity-subject">Materia</Label>

                <select
                    id="activity-subject"
                    value={subjectId}
                    onChange={(event) => setSubjectId(event.target.value)}
                    disabled={loadingSubjects || noSubjects}
                    className="h-10 w-full rounded-md border border-[#D5DEE8] bg-white px-3 text-sm text-[#1F2A44] outline-none focus-visible:border-[#187A4C] focus-visible:ring-2 focus-visible:ring-[#187A4C]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <option value="">
                        {loadingSubjects
                            ? "Cargando materias..."
                            : "Selecciona una materia"}
                    </option>

                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>

                {noSubjects && (
                    <p className="text-sm text-[#5B6B80]">
                        Primero necesitas una materia.{" "}
                        <Link
                            href="/materias"
                            className="font-semibold text-[#187A4C] hover:underline"
                        >
                            Crear materia
                        </Link>
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="activity-title">Nombre de la actividad</Label>

                <Input
                    id="activity-title"
                    value={title}
                    maxLength={100}
                    placeholder="Ej. Dibujo del otoño"
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="activity-date">Fecha</Label>

                <Input
                    id="activity-date"
                    type="date"
                    value={activityDate}
                    onChange={(event) => setActivityDate(event.target.value)}
                />
            </div>

            {canActivate && (
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[#E3E8EF] p-3 transition-colors has-checked:border-[#187A4C] has-checked:bg-[#187A4C]/5">
                    <input
                        type="checkbox"
                        checked={activate}
                        onChange={(event) => setActivate(event.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-[#187A4C]"
                    />

                    <span>
                        <span className="block text-sm font-semibold text-[#1F2A44]">
                            Marcar como actividad activa
                        </span>

                        <span className="block text-sm text-[#5B6B80]">
                            {currentActive
                                ? `Reemplazará a «${currentActive.title}».`
                                : "Será la actividad en curso."}
                        </span>
                    </span>
                </label>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    disabled={!isValid || loading}
                    className="bg-[#187A4C] text-white hover:bg-[#1B8855]"
                >
                    {loading ? "Guardando..." : copy[mode].submit}
                </Button>
            </DialogFooter>
        </form>
    );
}

export function ActivityDialog({
    open,
    onOpenChange,
    ...formProps
}: ActivityDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <ActivityForm
                    {...formProps}
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}