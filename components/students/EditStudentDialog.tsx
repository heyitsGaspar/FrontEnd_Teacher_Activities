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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditStudentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    /** Nombre actual del alumno */
    currentName: string;

    onSubmit: (name: string) => void;

    loading?: boolean;
}

export function EditStudentDialog({
    open,
    onOpenChange,
    currentName,
    onSubmit,
    loading = false,
}: EditStudentDialogProps) {
    const [name, setName] = useState(currentName);

    // Cada vez que se abre, precarga el nombre actual
    useEffect(() => {
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setName(currentName);
        }
    }, [open, currentName]);

    const cleanName = name.trim();
    const unchanged = cleanName === currentName.trim();

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!cleanName || unchanged) {
            return;
        }

        onSubmit(cleanName);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="font-display text-xl text-[#1F2A44]">
                            Editar alumno
                        </DialogTitle>

                        <DialogDescription className="text-[#4A5568]">
                            Modifica el nombre del alumno.
                            Su código QR no cambiará.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 py-6">
                        <Label htmlFor="edit-student-name">
                            Nombre del alumno
                        </Label>

                        <Input
                            id="edit-student-name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Ej. Juan Pérez"
                            disabled={loading}
                            autoFocus
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
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                loading ||
                                !cleanName ||
                                unchanged
                            }
                            className="bg-[#187A4C] text-white hover:bg-[#1B8855]"
                        >
                            {loading
                                ? "Guardando..."
                                : "Guardar cambios"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}