"use client";

import { useCallback, useEffect, useState } from "react";
import { GraduationCap, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AppDialog } from "@/components/shared/AppDialog";
import { AppConfirmDialog } from "@/components/shared/AppConfirmDialog";

import { ActivateActivityDialog } from "./ActivateActivityDialog";
import { ActiveActivityCard } from "./ActiveActivityCard";
import {
    ActivityDialog,
    type ActivityDialogMode,
    type ActivityFormValues,
} from "./ActivityDialog";
import { ActivityPagination } from "./ActivityPagination";
import { ActivityTable } from "./ActivityTable";
import { formatActivityDate } from "./activity-utils";
import {
    activateActivity,
    createActivity,
    deleteActivity,
    getActiveActivity,
    getActivities,
    updateActivity,
} from "@/app/services/activities/service";
import { getSubjects } from "@/app/services/subjects/service";

import type { Activity } from "@/types/activities";
import type { Subject } from "@/types/subjects";
import axios from "axios";

const PAGE_SIZE = 10;
const PICKER_SIZE = 50;
const SUBJECTS_SIZE = 100;

type AppDialogState = {
    open: boolean;
    type: "success" | "error" | "warning" | "info";
    title: string;
    description: string;
};

export function ActivitiesContent() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [activeActivity, setActiveActivity] = useState<Activity | null>(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(true);
    const [loadingActive, setLoadingActive] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [activating, setActivating] = useState(false);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    const [activityDialogOpen, setActivityDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<ActivityDialogMode>("create");
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerActivities, setPickerActivities] = useState<Activity[]>([]);
    const [loadingPicker, setLoadingPicker] = useState(false);

    const [dialog, setDialog] = useState<AppDialogState>({
        open: false,
        type: "info",
        title: "",
        description: "",
    });

    const showError = (title: string, description: string) =>
        setDialog({ open: true, type: "error", title, description });

    const showSuccess = (title: string, description: string) =>
        setDialog({ open: true, type: "success", title, description });

    /* ---------- Carga de datos ---------- */

    const loadActivities = useCallback(async (page: number) => {
        try {
            setLoading(true);

            const data = await getActivities(page, PAGE_SIZE);

            setActivities(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error("Error cargando actividades:", error);

            setDialog({
                open: true,
                type: "error",
                title: "No se pudieron cargar las actividades",
                description: "Ocurrió un error al obtener la lista de actividades.",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const loadActive = useCallback(async () => {
        try {
            setActiveActivity(await getActiveActivity());
        } catch (error) {
            console.error("Error cargando la actividad activa:", error);
        } finally {
            setLoadingActive(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadActivities(currentPage);
    }, [currentPage, loadActivities]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadActive();
    }, [loadActive]);

    const refresh = async () => {
        await Promise.all([loadActivities(currentPage), loadActive()]);
    };

    /* Las actividades nuevas quedan arriba (orden por fecha descendente). */
    const goToFirstPageAndRefresh = async () => {
        if (currentPage !== 0) {
            setCurrentPage(0);
            await loadActive();
            return;
        }

        await refresh();
    };

    /* ---------- Crear, editar y repetir ---------- */

    const openActivityDialog = async (
        mode: ActivityDialogMode,
        activity: Activity | null = null
    ) => {
        setDialogMode(mode);
        setSelectedActivity(activity);
        setActivityDialogOpen(true);

        try {
            setLoadingSubjects(true);

            const page = await getSubjects(0, SUBJECTS_SIZE);

            setSubjects(page.content);
        } catch (error) {
            console.error("Error cargando materias:", error);

            setActivityDialogOpen(false);

            showError(
                "No se pudieron cargar las materias",
                "Intenta abrir el formulario de nuevo."
            );
        } finally {
            setLoadingSubjects(false);
        }
    };

    const handleSubmit = async (values: ActivityFormValues) => {
        try {
            setSaving(true);

            if (dialogMode === "edit") {
                if (!selectedActivity) {
                    return;
                }

                await updateActivity(selectedActivity.id, {
                    subjectId: values.subjectId,
                    title: values.title,
                    activityDate: values.activityDate,
                });

                setActivityDialogOpen(false);

                await refresh();

                showSuccess(
                    "Actividad actualizada",
                    "Los cambios se guardaron correctamente."
                );

                return;
            }

            const created = await createActivity(values);

            setActivityDialogOpen(false);

            await goToFirstPageAndRefresh();

            showSuccess(
                dialogMode === "repeat"
                    ? "Actividad repetida"
                    : "Actividad creada",
                values.activate
                    ? `«${created.title}» quedó como tu actividad activa.`
                    : `Se creó «${created.title}» para el ${formatActivityDate(created.activityDate)}.`
            );
        } catch (error) {
            console.error("Error guardando actividad:", error);

            showError(
                "No se pudo guardar la actividad",
                "Ocurrió un error al guardar. Intenta nuevamente."
            );
        } finally {
            setSaving(false);
        }
    };

    /* ---------- Eliminar ---------- */

    const handleDeleteClick = (activity: Activity) => {
        setSelectedActivity(activity);
        setConfirmDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedActivity) {
            return;
        }

        try {
            setDeleting(true);

            await deleteActivity(selectedActivity.id);

            setConfirmDeleteOpen(false);

            /*
             * Si eliminamos el último elemento de una página
             * distinta de la primera, regresamos una página.
             */
            if (activities.length === 1 && currentPage > 0) {
                setCurrentPage((previous) => previous - 1);
                await loadActive();
            } else {
                await refresh();
            }

            setSelectedActivity(null);

            showSuccess(
                "Actividad eliminada",
                "La actividad se eliminó correctamente."
            );
        } catch (error) {
        

        // Cierra la confirmación para que no se encime con el aviso
        setConfirmDeleteOpen(false);

        if (axios.isAxiosError(error) && error.response?.status === 409) {
            showError(
                "No se puede eliminar la actividad",
                error.response.data?.message ??
                    "La actividad ya tiene entregas registradas."
            );
        } else {
            showError(
                "No se pudo eliminar la actividad",
                "Ocurrió un error al eliminar la actividad."
            );
        }
    } finally {
        setDeleting(false);
    }
    };

    /* ---------- Activar ---------- */

    const handleOpenPicker = async () => {
        setPickerOpen(true);

        try {
            setLoadingPicker(true);

            const data = await getActivities(0, PICKER_SIZE);

            setPickerActivities(data.content);
        } catch (error) {
            console.error("Error cargando actividades:", error);

            setPickerOpen(false);

            showError(
                "No se pudieron cargar las actividades",
                "Intenta abrir la lista de nuevo."
            );
        } finally {
            setLoadingPicker(false);
        }
    };

    const handleActivate = async (id: string) => {
        try {
            setActivating(true);

            const activated = await activateActivity(id);

            setPickerOpen(false);

            await refresh();

            showSuccess(
                "Actividad activada",
                `«${activated.title}» es ahora tu actividad activa.`
            );
        } catch (error) {
            console.error("Error activando actividad:", error);

            showError(
                "No se pudo activar la actividad",
                "Ocurrió un error al activar la actividad."
            );
        } finally {
            setActivating(false);
        }
    };

    /* ---------- Render ---------- */

    return (
        <>
            <div className="space-y-6 p-6 lg:p-8">
                {/* Encabezado */}
                <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFD84D]">
                            <GraduationCap
                                size={22}
                                className="text-[#1F2A44]"
                            />
                        </div>

                        <div>
                            <h1 className="font-display text-2xl font-bold text-[#1F2A44]">
                                Actividades
                            </h1>

                            <p className="text-sm text-[#6B7A90]">
                                Crea y organiza las actividades de tu grupo.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={() => openActivityDialog("create")}
                        className="w-full bg-[#187A4C] text-white hover:bg-[#1B8855] md:w-auto"
                    >
                        <Plus size={18} />
                        Nueva actividad
                    </Button>
                </section>

                {/* Actividad activa */}
                <ActiveActivityCard
                    activity={activeActivity}
                    loading={loadingActive}
                    onChange={handleOpenPicker}
                />

                {/* Tabla */}
                <Card className="border-[#D5DEE8] bg-white">
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
                        <CardTitle className="font-display text-lg text-[#1F2A44]">
                            Lista de actividades
                        </CardTitle>

                        <span className="rounded-full bg-[#DCEEF7] px-3 py-1 text-sm font-semibold text-[#1F2A44]">
                            {totalElements}{" "}
                            {totalElements === 1 ? "actividad" : "actividades"}
                        </span>
                    </CardHeader>

                    <CardContent className="p-0">
                        <ActivityTable
                            activities={activities}
                            loading={loading}
                            onEdit={(activity) =>
                                openActivityDialog("edit", activity)
                            }
                            onRepeat={(activity) =>
                                openActivityDialog("repeat", activity)
                            }
                            onDelete={handleDeleteClick}
                            onCreate={() => openActivityDialog("create")}
                        />

                        {!loading && totalPages > 1 && (
                            <div className="border-t border-[#D5DEE8] p-4">
                                <ActivityPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Crear / editar / repetir */}
            <ActivityDialog
                open={activityDialogOpen}
                onOpenChange={setActivityDialogOpen}
                mode={dialogMode}
                activity={selectedActivity}
                subjects={subjects}
                loadingSubjects={loadingSubjects}
                loading={saving}
                currentActive={activeActivity}
                onSubmit={handleSubmit}
            />

            {/* Elegir cuál activar */}
            <ActivateActivityDialog
                open={pickerOpen}
                onOpenChange={setPickerOpen}
                activities={pickerActivities}
                loading={loadingPicker}
                activating={activating}
                onConfirm={handleActivate}
            />

            {/* Confirmar eliminación */}
            <AppConfirmDialog
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                title="¿Eliminar actividad?"
                description={
                    selectedActivity
                        ? `¿Seguro que deseas eliminar «${selectedActivity.title}»?${
                              selectedActivity.active
                                  ? " Es tu actividad activa."
                                  : ""
                          } Esta acción no se puede deshacer.`
                        : "Esta acción no se puede deshacer."
                }
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleDelete}
                loading={deleting}
            />

            {/* Mensajes */}
            <AppDialog
                open={dialog.open}
                onOpenChange={(open) =>
                    setDialog((previous) => ({ ...previous, open }))
                }
                type={dialog.type}
                title={dialog.title}
                description={dialog.description}
            />
        </>
    );
}