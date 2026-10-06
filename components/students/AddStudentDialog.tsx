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

interface AddStudentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    onSubmit: (name: string) => void;

    loading?: boolean;
}

export function AddStudentDialog({
    open,
    onOpenChange,
    onSubmit,
    loading = false,
}: AddStudentDialogProps) {
    const [name, setName] = useState("");

    useEffect(() => {
        if (!open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setName("");
        }
    }, [open]);

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const cleanName = name.trim();

        if (!cleanName) {
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
                            Agregar alumno
                        </DialogTitle>

                        <DialogDescription className="text-[#4A5568]">
                            Registra un alumno para poder
                            generar su código QR.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 py-6">
                        <Label htmlFor="student-name">
                            Nombre del alumno
                        </Label>

                        <Input
                            id="student-name"
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
                                !name.trim()
                            }
                            className="bg-[#187A4C] text-white hover:bg-[#1B8855]"
                        >
                            {loading
                                ? "Guardando..."
                                : "Guardar alumno"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}