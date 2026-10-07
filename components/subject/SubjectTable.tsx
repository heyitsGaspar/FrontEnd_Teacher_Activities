"use client";

import { Pencil, Trash2 } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import type { Subject } from "../../types/subjects";

interface SubjectTableProps {
    subjects: Subject[];

    loading?: boolean;

    onEdit: (subject: Subject) => void;

    onDelete: (subject: Subject) => void;
}

export function SubjectTable({
    subjects,
    loading = false,
    onEdit,
    onDelete,
}: SubjectTableProps) {
    if (loading) {
        return (
            <div className="p-6 text-center text-sm text-[#6B7A90]">
                Cargando materias...
            </div>
        );
    }

    if (subjects.length === 0) {
        return (
            <div className="flex min-h-52 items-center justify-center p-6 text-center">
                <div>
                    <p className="font-semibold text-[#1F2A44]">
                        No hay materias registradas
                    </p>

                    <p className="mt-1 text-sm text-[#6B7A90]">
                        Agrega tu primera materia para comenzar.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Materia</TableHead>
                    <TableHead className="text-right">
                        Acciones
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                        <TableCell className="font-medium text-[#1F2A44]">
                            {subject.name}
                        </TableCell>

                        <TableCell>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        onEdit(subject)
                                    }
                                    className="text-[#1F2A44] hover:bg-[#DCEEF7] hover:text-[#187A4C]"
                                >
                                    <Pencil
                                        size={18}
                                    />

                                    <span className="sr-only">
                                        Editar materia
                                    </span>
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        onDelete(subject)
                                    }
                                    className="text-[#C2392B] hover:bg-[#FFF1EF] hover:text-[#C2392B]"
                                >
                                    <Trash2
                                        size={18}
                                    />

                                    <span className="sr-only">
                                        Eliminar materia
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