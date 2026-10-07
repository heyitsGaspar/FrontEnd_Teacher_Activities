"use client";

import { useCallback, useEffect, useState } from "react";

import { Plus, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { AppDialog } from "@/components/shared/AppDialog";
import { AppConfirmDialog } from "@/components/shared/AppConfirmDialog";

import { AddStudentDialog } from "./AddStudentDialog";
import { StudentTable } from "./StudentTable";
import { StudentPagination } from "./StudentPagination";
import { StudentQrPdfButton } from "./StudentQrPdfButton";

import {
    createChild,
    deleteChild,
    getChildren,
} from "@/app/services/children/service";

import type { Child } from "@/types/child";

import axios from "axios";

const PAGE_SIZE = 10;

type AppDialogState = {
    open: boolean;
    type: "success" | "error" | "warning" | "info";
    title: string;
    description: string;
};

export function StudentsContent() {
    const [children, setChildren] =
        useState<Child[]>([]);

    const [currentPage, setCurrentPage] =
        useState(0);

    const [totalPages, setTotalPages] =
        useState(0);

    const [totalElements, setTotalElements] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [addDialogOpen, setAddDialogOpen] =
        useState(false);

    const [selectedChild, setSelectedChild] =
        useState<Child | null>(null);

    const [confirmDeleteOpen, setConfirmDeleteOpen] =
        useState(false);

    const [dialog, setDialog] =
        useState<AppDialogState>({
            open: false,
            type: "info",
            title: "",
            description: "",
        });

    const loadChildren = useCallback(
        async (page: number) => {
            try {
                setLoading(true);

                const response =
                    await getChildren(
                        page,
                        PAGE_SIZE
                    );

                setChildren(
                    response.content
                );

                setTotalPages(
                    response.totalPages
                );

                setTotalElements(
                    response.totalElements
                );
            } catch (error) {
                console.error(
                    "Error cargando alumnos:",
                    error
                );

                setDialog({
                    open: true,
                    type: "error",
                    title: "No se pudieron cargar los alumnos",
                    description:
                        "Ocurrió un error al obtener la lista de alumnos.",
                });
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadChildren(currentPage);
    }, [
        currentPage,
        loadChildren,
    ]);

    const handleCreateStudent = async (
        name: string
    ) => {
        try {
            setSaving(true);

            const created =
                await createChild(name);

            setAddDialogOpen(false);

            await loadChildren(
                currentPage
            );

            setDialog({
                open: true,
                type: "success",
                title: "Alumno creado correctamente",
                description:
                    `Se registró a ${created.name} correctamente. Su código es ${created.code}.`,
            });
        } catch (error) {
            console.error(
                "Error creando alumno:",
                error
            );

            if (
                axios.isAxiosError(error) &&
                error.response?.status === 409
            ) {
                setDialog({
                    open: true,
                    type: "warning",
                    title: "Este alumno ya existe",
                    description:
                        "Ya existe un alumno registrado con esos datos.",
                });

                return;
            }

            setDialog({
                open: true,
                type: "error",
                title: "No se pudo crear el alumno",
                description:
                    "Ocurrió un error al registrar al alumno. Intenta nuevamente.",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteStudent = async () => {
        if (!selectedChild) {
            return;
        }

        try {
            setDeleting(true);

            await deleteChild(
                selectedChild.id
            );

            setConfirmDeleteOpen(false);

            /*
             * Si eliminamos el último elemento
             * de una página distinta de la primera,
             * regresamos una página.
             */
            if (
                children.length === 1 &&
                currentPage > 0
            ) {
                setCurrentPage(
                    (previous) =>
                        previous - 1
                );
            } else {
                await loadChildren(
                    currentPage
                );
            }

            setSelectedChild(null);

            setDialog({
                open: true,
                type: "success",
                title: "Alumno eliminado",
                description:
                    "El alumno fue eliminado correctamente.",
            });
        } catch (error) {
            console.error(
                "Error eliminando alumno:",
                error
            );

            setDialog({
                open: true,
                type: "error",
                title: "No se pudo eliminar el alumno",
                description:
                    "Ocurrió un error al eliminar al alumno.",
            });
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteClick = (
        child: Child
    ) => {
        setSelectedChild(child);
        setConfirmDeleteOpen(true);
    };

    const handleGenerateQr = async (
        child: Child
    ) => {
        try {
            const QRCode =
                await import("qrcode");

            const dataUrl =
                await QRCode.toDataURL(
                    child.code,
                    {
                        width: 800,
                        margin: 2,
                    }
                );

            const link =
                document.createElement(
                    "a"
                );

            link.href = dataUrl;

            link.download = `qr-${child.code}.png`;

            link.click();
        } catch (error) {
            console.error(
                "Error generando QR:",
                error
            );

            setDialog({
                open: true,
                type: "error",
                title: "No se pudo generar el QR",
                description:
                    "Ocurrió un error al generar el código QR del alumno.",
            });
        }
    };

    return (
        <>
            <div className="space-y-6 p-6 lg:p-8">
                {/* Encabezado */}
                <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFD84D]">
                                <Users
                                    size={22}
                                    className="text-[#1F2A44]"
                                />
                            </div>

                            <div>
                                <h1 className="font-display text-2xl font-bold text-[#1F2A44]">
                                    Alumnos
                                </h1>

                                <p className="text-sm text-[#6B7A90]">
                                    Administra los alumnos
                                    de tu grupo.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <StudentQrPdfButton
                            onError={(message) =>
                                setDialog({
                                    open: true,
                                    type: "error",
                                    title: "No se pudo generar el PDF",
                                    description:
                                        message,
                                })
                            }
                        />

                        <Button
                            type="button"
                            onClick={() =>
                                setAddDialogOpen(
                                    true
                                )
                            }
                            className="bg-[#187A4C] text-white hover:bg-[#1B8855]"
                        >
                            <Plus size={18} />

                            Agregar alumno
                        </Button>
                    </div>
                </section>

                {/* Estadística */}
                <Card className="border-[#D5DEE8] bg-white">
                    <CardHeader>
                        <CardTitle className="text-base text-[#4A5568]">
                            Total de alumnos
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="font-display text-3xl font-bold text-[#1F2A44]">
                            {totalElements}
                        </p>
                    </CardContent>
                </Card>

                {/* Tabla */}
                <Card className="border-[#D5DEE8] bg-white">
                    <CardHeader>
                        <CardTitle className="font-display text-lg text-[#1F2A44]">
                            Lista de alumnos
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        <StudentTable
                            // eslint-disable-next-line react/no-children-prop
                            children={children}
                            loading={loading}
                            onDelete={
                                handleDeleteClick
                            }
                            onGenerateQr={
                                handleGenerateQr
                            }
                        />

                        {!loading &&
                            totalPages > 1 && (
                                <div className="border-t border-[#D5DEE8] p-4">
                                    <StudentPagination
                                        currentPage={
                                            currentPage
                                        }
                                        totalPages={
                                            totalPages
                                        }
                                        onPageChange={
                                            setCurrentPage
                                        }
                                    />
                                </div>
                            )}
                    </CardContent>
                </Card>
            </div>

            {/* Agregar alumno */}
            <AddStudentDialog
                open={addDialogOpen}
                onOpenChange={
                    setAddDialogOpen
                }
                onSubmit={
                    handleCreateStudent
                }
                loading={saving}
            />

            {/* Confirmación de eliminación */}
            <AppConfirmDialog
                open={
                    confirmDeleteOpen
                }
                onOpenChange={
                    setConfirmDeleteOpen
                }
                title="¿Eliminar alumno?"
                description={
                    selectedChild
                        ? `¿Seguro que deseas eliminar a ${selectedChild.name}? Esta acción no se puede deshacer.`
                        : "Esta acción no se puede deshacer."
                }
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={
                    handleDeleteStudent
                }
                loading={deleting}
            />

            {/* Mensajes reutilizables */}
            <AppDialog
                open={dialog.open}
                onOpenChange={(open) =>
                    setDialog(
                        (previous) => ({
                            ...previous,
                            open,
                        })
                    )
                }
                type={dialog.type}
                title={dialog.title}
                description={
                    dialog.description
                }
            />
        </>
    );
}