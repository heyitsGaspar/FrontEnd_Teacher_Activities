"use client";

import {
    Download,
    Trash2,
    Pencil,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import type { Child } from "@/types/child";

interface StudentTableProps {
    children: Child[];

    loading?: boolean;

    onEdit: (child: Child) => void;
    onDelete: (child: Child) => void;

    onGenerateQr: (child: Child) => void;
}

export function StudentTable({
    children,
    loading = false,
    onEdit,
    onDelete,
    onGenerateQr,
}: StudentTableProps) {
    if (loading) {
        return (
            <div className="p-6 text-center text-sm text-[#6B7A90]">
                Cargando alumnos...
            </div>
        );
    }

    if (children.length === 0) {
        return (
            <div className="flex min-h-52 items-center justify-center p-6 text-center">
                <div>
                    <p className="font-semibold text-[#1F2A44]">
                        No hay alumnos registrados
                    </p>

                    <p className="mt-1 text-sm text-[#6B7A90]">
                        Agrega tu primer alumno para comenzar.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Alumno</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead className="text-right">
                        Acciones
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {children.map((child) => (
                    <TableRow key={child.id}>
                        <TableCell className="font-medium text-[#1F2A44]">
                            {child.name}
                        </TableCell>

                        <TableCell>
                            <Badge
                                variant="secondary"
                                className="font-mono"
                            >
                                {child.code}
                            </Badge>
                        </TableCell>

                        <TableCell>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        onGenerateQr(child)
                                    }
                                >
                                    <Download
                                        size={16}
                                    />

                                    <span className="hidden sm:inline">
                                        QR
                                    </span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(child)}
                                    className="text-[#1F2A44] hover:bg-[#F1F5F9]"
                                >
                                    <Pencil size={18} />

                                    <span className="sr-only">
                                        Editar alumno
                                    </span>
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        onDelete(child)
                                    }
                                    className="text-[#C2392B] hover:bg-[#FFF1EF] hover:text-[#C2392B]"
                                >
                                    <Trash2
                                        size={18}
                                    />

                                    <span className="sr-only">
                                        Eliminar alumno
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