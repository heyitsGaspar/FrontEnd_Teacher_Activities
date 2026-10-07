"use client";

import { useEffect, useState } from "react";

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
import { Button } from "@/components/ui/button";

interface SubjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (name: string) => void;
    loading?: boolean;
    subjectName?: string;
    mode?: "create" | "edit";
}

export function SubjectDialog({
    open,
    onOpenChange,
    onSubmit,
    loading = false,
    subjectName = "",
    mode = "create",
}: SubjectDialogProps) {

    const [name, setName] = useState("");

    useEffect(() => {
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setName(subjectName);
        }
    }, [open, subjectName]);

    const handleSubmit = () => {

        const trimmedName = name.trim();

        if (!trimmedName) {
            return;
        }

        onSubmit(trimmedName);
    };

    const isEdit = mode === "edit";

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-md">

                <DialogHeader>

                    <DialogTitle className="font-display text-xl text-[#1F2A44]">
                        {isEdit
                            ? "Editar materia"
                            : "Nueva materia"}
                    </DialogTitle>

                    <DialogDescription className="text-[#4A5568]">
                        {isEdit
                            ? "Modifica el nombre de la materia."
                            : "Ingresa el nombre de la nueva materia."}
                    </DialogDescription>

                </DialogHeader>

                <div className="space-y-2 py-2">

                    <Label
                        htmlFor="subject-name"
                        className="text-[#1F2A44]"
                    >
                        Nombre
                    </Label>

                    <Input
                        id="subject-name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        placeholder="Ej. Matemáticas"
                        disabled={loading}
                        maxLength={100}
                    />

                </div>

                <DialogFooter>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            onOpenChange(false)
                        }
                        disabled={loading}
                        className="border-[#D5DEE8]"
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                            loading ||
                            !name.trim()
                        }
                        className="bg-[#187A4C] text-white hover:bg-[#1B8855]"
                    >
                        {loading
                            ? isEdit
                                ? "Guardando..."
                                : "Creando..."
                            : isEdit
                                ? "Guardar cambios"
                                : "Crear materia"}
                    </Button>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}