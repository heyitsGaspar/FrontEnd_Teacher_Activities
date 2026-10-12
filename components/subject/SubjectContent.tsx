"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AppDialog } from "@/components/shared/AppDialog";
import { AppConfirmDialog } from "@/components/shared/AppConfirmDialog";

import { SubjectDialog } from "./SubjectDialog";
import { SubjectTable } from "./SubjectTable";
import { SubjectPagination } from "./SubjectPagination";

import {
    createSubject,
    deleteSubject,
    getSubjects,
    updateSubject,
} from "@/app/services/subjects/service";

import type {
    Subject,
    SubjectPage,
} from "../../types/subjects";

const PAGE_SIZE = 10;

type AppDialogState = {
    open: boolean;
    type: "success" | "error" | "warning" | "info";
    title: string;
    description: string;
};

export function SubjectsContent() {
    const [subjects, setSubjects] = useState<Subject[]>([]);

    const [currentPage, setCurrentPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const [subjectDialogOpen, setSubjectDialogOpen] =
        useState(false);

    const [dialogMode, setDialogMode] =
        useState<"create" | "edit">("create");

    const [selectedSubject, setSelectedSubject] =
        useState<Subject | null>(null);

    const [confirmDeleteOpen, setConfirmDeleteOpen] =
        useState(false);

    const [appDialog, setAppDialog] =
        useState<AppDialogState>({
            open: false,
            type: "info",
            title: "",
            description: "",
        });

    /**
     * Obtiene las materias de la página actual.
     */
    const loadSubjects = async () => {
        try {
            setLoading(true);

            const data: SubjectPage = await getSubjects(
                currentPage,
                PAGE_SIZE
            );

            setSubjects(data.content);

            setTotalPages(data.totalPages);

            setTotalElements(data.totalElements);
        } catch (error) {
            console.error("Error cargando materias:", error);

            setAppDialog({
                open: true,
                type: "error",
                title: "Error",
                description: "No se pudieron cargar las materias.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadSubjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    /**
     * Abre el modal para crear una materia.
     */
    const handleOpenCreate = () => {
        setSelectedSubject(null);

        setDialogMode("create");

        setSubjectDialogOpen(true);
    };

    /**
     * Abre el modal para editar una materia.
     */
    const handleOpenEdit = (subject: Subject) => {
        setSelectedSubject(subject);

        setDialogMode("edit");

        setSubjectDialogOpen(true);
    };

    /**
     * Crea o actualiza una materia.
     */
    const handleSubmit = async (name: string) => {
        try {
            setSaving(true);

            if (dialogMode === "create") {
                await createSubject(name);

                setSubjectDialogOpen(false);

                /*
                 * Volvemos a cargar la página actual
                 * después de crear.
                 */
                await loadSubjects();

                setAppDialog({
                    open: true,
                    type: "success",
                    title: "Materia creada",
                    description: "La materia se creó correctamente.",
                });
            } else {
                if (!selectedSubject) {
                    return;
                }

                await updateSubject(selectedSubject.id, name);

                setSubjectDialogOpen(false);

                await loadSubjects();

                setAppDialog({
                    open: true,
                    type: "success",
                    title: "Materia actualizada",
                    description:
                        "La materia se actualizó correctamente.",
                });
            }
        } catch (error) {
            /*
             * 409 significa que ya existe
             * una materia con ese nombre.
             */
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 409
            ) {
                setAppDialog({
                    open: true,
                    type: "warning",
                    title: "Materia existente",
                    description:
                        "Ya existe una materia con ese nombre.",
                });

                return;
            }

            console.error("Error guardando materia:", error);

            setAppDialog({
                open: true,
                type: "error",
                title: "Error",
                description: "No se pudo guardar la materia.",
            });
        } finally {
            setSaving(false);
        }
    };

    /**
     * Abre el modal de confirmación
     * para eliminar una materia.
     */
    const handleOpenDelete = (subject: Subject) => {
        setSelectedSubject(subject);

        setConfirmDeleteOpen(true);
    };

    /**
 * Elimina la materia seleccionada.
 */
    const handleDelete = async () => {
        if (!selectedSubject) {
            return;
        }

        try {
            setDeleting(true);

            await deleteSubject(selectedSubject.id);

            setConfirmDeleteOpen(false);

            /*
             * Si eliminamos el último elemento
             * de una página distinta de la primera,
             * regresamos una página.
             */
            if (subjects.length === 1 && currentPage > 0) {
                setCurrentPage(currentPage - 1);
            } else {
                await loadSubjects();
            }

            setAppDialog({
                open: true,
                type: "success",
                title: "Materia eliminada",
                description: "La materia se eliminó correctamente.",
            });
        } catch (error) {
            /*
             * 409: la materia tiene actividades y no se puede
             * eliminar. Es un caso esperado, no un error.
             */
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 409
            ) {
                setConfirmDeleteOpen(false);

                setAppDialog({
                    open: true,
                    type: "warning",
                    title: "No se puede eliminar",
                    description:
                        "Esta materia tiene actividades. Elimínalas o cámbialas a otra materia y vuelve a intentarlo.",
                });

                return;
            }

            console.error("Error eliminando materia:", error);

            setAppDialog({
                open: true,
                type: "error",
                title: "Error",
                description: "No se pudo eliminar la materia.",
            });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="space-y-6 p-6 lg:p-8">
                {/* Encabezado */}
                <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFD84D]">
                            <BookOpen
                                size={22}
                                className="text-[#1F2A44]"
                            />
                        </div>

                        <div>
                            <h1 className="font-display text-2xl font-bold text-[#1F2A44]">
                                Materias
                            </h1>

                            <p className="text-sm text-[#6B7A90]">
                                Administra las materias de tus
                                alumnos.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={handleOpenCreate}
                        className="bg-[#187A4C] text-white hover:bg-[#1B8855]"
                    >
                        <Plus size={18} />
                        Nueva materia
                    </Button>
                </section>

                {/* Estadística */}
                <Card className="border-[#D5DEE8] bg-white">
                    <CardHeader>
                        <CardTitle className="text-base text-[#4A5568]">
                            Total de materias
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
                            Lista de materias
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        <SubjectTable
                            subjects={subjects}
                            loading={loading}
                            onEdit={handleOpenEdit}
                            onDelete={handleOpenDelete}
                        />

                        {!loading && totalPages > 1 && (
                            <div className="border-t border-[#D5DEE8] p-4">
                                <SubjectPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Crear / editar */}
            <SubjectDialog
                open={subjectDialogOpen}
                onOpenChange={setSubjectDialogOpen}
                onSubmit={handleSubmit}
                loading={saving}
                mode={dialogMode}
                subjectName={selectedSubject?.name ?? ""}
            />

            {/* Confirmar eliminación */}
            <AppConfirmDialog
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                title="¿Eliminar materia?"
                description={
                    selectedSubject
                        ? `¿Estás seguro de que deseas eliminar la materia "${selectedSubject.name}"?`
                        : "¿Estás seguro de que deseas eliminar esta materia?"
                }
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleDelete}
                loading={deleting}
            />

            {/* Resultado de operaciones */}
            <AppDialog
                open={appDialog.open}
                onOpenChange={(open) =>
                    setAppDialog((previous) => ({
                        ...previous,
                        open,
                    }))
                }
                type={appDialog.type}
                title={appDialog.title}
                description={appDialog.description}
            />
        </>
    );
}