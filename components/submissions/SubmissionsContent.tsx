"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Check, ClipboardCheck, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { AppDialog } from "@/components/shared/AppDialog";
import { AppConfirmDialog } from "@/components/shared/AppConfirmDialog";

import { PALETTE } from "./report-palette";
import { isActivityInTrimester, TRIMESTERS } from "./trimester-utils";
import { playTone } from "./scan-feedback";
import { ScanPanel, type ScanResult } from "./ScanPanel";
import { SubmissionBoard } from "./SubmissionBoard";
import { SubmissionsExportButtons } from "./SubmissionsExportButtons";

import {
    createSubmission,
    deleteSubmission,
    getSubmissionBoard,
} from "@/app/services/submissions/service";

import type {
    BoardActivity,
    BoardStudent,
    BoardSubmission,
    Submission,
    SubmissionBoardData,
} from "@/types/submissions";

type AppDialogState = {
    open: boolean;
    type: "success" | "error" | "warning" | "info";
    title: string;
    description: string;
};

type UndoTarget = {
    student: BoardStudent;
    activity: BoardActivity;
    submission: BoardSubmission;
};
type MarkTarget = {
    student: BoardStudent;
    activity: BoardActivity;
};




export function SubmissionsContent() {

    const [markTarget, setMarkTarget] = useState<MarkTarget | null>(null);
    const [markConfirmOpen, setMarkConfirmOpen] = useState(false);
    const [marking, setMarking] = useState(false);
    const [board, setBoard] = useState<SubmissionBoardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [trimesterFilter, setTrimesterFilter] = useState<number | "all">("all");
    const [subjectFilter, setSubjectFilter] = useState("");

    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);

    const [undoTarget, setUndoTarget] = useState<UndoTarget | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [dialog, setDialog] = useState<AppDialogState>({
        open: false,
        type: "info",
        title: "",
        description: "",
    });

    const scanInputRef = useRef<HTMLInputElement>(null);
    const highlightTimer = useRef<number | null>(null);

    const students = board?.students ?? [];
    const activities = board?.activities ?? [];
    const trimesterActivities =
        trimesterFilter === "all"
            ? activities
            : activities.filter((activity) =>
                isActivityInTrimester(activity, trimesterFilter)
            );
    const subjectOptions = Array.from(
        new Set(
            trimesterActivities.map(
                (activity) => activity.subjectName?.trim() || "Sin materia"
            )
        )
    ).sort((first, second) => first.localeCompare(second, "es"));
    const visibleActivities = subjectFilter
        ? trimesterActivities.filter(
            (activity) =>
                (activity.subjectName?.trim() || "Sin materia") === subjectFilter
        )
        : trimesterActivities;
    const selectedTrimesterLabel =
        trimesterFilter === "all"
            ? ""
            : TRIMESTERS.find((trimester) => trimester.id === trimesterFilter)?.label ??
              "este trimestre";
    const emptyActivitiesMessage =
        trimesterActivities.length === 0
            ? trimesterFilter === "all"
                ? "Crea una actividad para empezar a registrar entregas."
                : `No hay actividades para ${selectedTrimesterLabel}.`
            : subjectFilter
                ? `No hay actividades para la materia «${subjectFilter}».`
                : "No hay actividades para esta selección.";
    const activeActivity = activities.find((a) => a.active) ?? null;

    const deliveredCount = activeActivity
        ? students.filter((s) => s.submissions[activeActivity.id]).length
        : 0;

    /* ---------- Carga ---------- */

    const loadBoard = useCallback(async () => {
        try {
            setBoard(await getSubmissionBoard());
        } catch (error) {
            console.error("Error cargando entregas:", error);

            setDialog({
                open: true,
                type: "error",
                title: "No se pudieron cargar las entregas",
                description:
                    "Ocurrió un error al obtener la tabla de entregas.",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadBoard();
    }, [loadBoard]);

    useEffect(() => {
        return () => {
            if (highlightTimer.current) {
                window.clearTimeout(highlightTimer.current);
            }
        };
    }, []);

    /* ---------- Escaneo ---------- */

    const highlight = (childId: string) => {
        setHighlightedId(childId);

        if (highlightTimer.current) {
            window.clearTimeout(highlightTimer.current);
        }

        highlightTimer.current = window.setTimeout(
            () => setHighlightedId(null),
            2500
        );
    };

    const handleMarkClick = (student: BoardStudent, activity: BoardActivity) => {
        setMarkTarget({ student, activity });
        setMarkConfirmOpen(true);
    };

    const handleMarkConfirm = async () => {
        if (!markTarget) {
            return;
        }

        const { student, activity } = markTarget;

        try {
            setMarking(true);

            const created = await createSubmission(student.code, activity.id);

            applySubmission(created);
            highlight(created.childId);
            playTone("success");

            setScanResult({
                kind: "success",
                title: created.childName,
                text: `entregó «${created.activityTitle}».`,
            });
        } catch (error) {
            playTone("error");

            const status = axios.isAxiosError(error)
                ? error.response?.status
                : undefined;

            setScanResult({
                kind: status === 409 ? "duplicate" : "error",
                title: status === 409 ? student.name : "No se pudo registrar.",
                text:
                    status === 409
                        ? "ya había entregado esta actividad."
                        : "Ocurrió un error. Intenta de nuevo.",
            });
        } finally {
            setMarking(false);
            setMarkConfirmOpen(false);
            setMarkTarget(null);
        }
    };
    /* Marca la celda sin volver a pedir toda la tabla. */
    const applySubmission = (created: Submission) => {
        setBoard((previous) =>
            previous
                ? {
                    ...previous,
                    students: previous.students.map((student) =>
                        student.id === created.childId
                            ? {
                                ...student,
                                submissions: {
                                    ...student.submissions,
                                    [created.activityId]: {
                                        id: created.id,
                                        createdAt: created.createdAt,
                                    },
                                },
                            }
                            : student
                    ),
                }
                : previous
        );
    };

    const handleScan = async (code: string) => {
        if (!activeActivity) {
            return;
        }

        try {
            const created = await createSubmission(code, activeActivity.id);

            applySubmission(created);
            highlight(created.childId);
            playTone("success");

            setScanResult({
                kind: "success",
                title: created.childName,
                text: `entregó «${created.activityTitle}».`,
            });
        } catch (error) {
            playTone("error");

            const status = axios.isAxiosError(error)
                ? error.response?.status
                : undefined;

            if (status === 409) {
                const student = students.find((s) => s.code === code);

                if (student) {
                    highlight(student.id);
                }

                setScanResult({
                    kind: "duplicate",
                    title: student?.name ?? "Este alumno",
                    text: "ya había entregado esta actividad.",
                });

                return;
            }

            if (status === 404) {
                setScanResult({
                    kind: "error",
                    title: "Código no reconocido.",
                    text: `No encontramos a ningún alumno con «${code}».`,
                });

                return;
            }

            console.error("Error registrando entrega:", error);

            setScanResult({
                kind: "error",
                title: "No se pudo registrar.",
                text: "Ocurrió un error. Intenta escanear de nuevo.",
            });
        }
    };

    /* ---------- Quitar una entrega ---------- */

    const handleUndoClick = (
        student: BoardStudent,
        activity: BoardActivity,
        submission: BoardSubmission
    ) => {
        setUndoTarget({ student, activity, submission });
        setConfirmOpen(true);
    };

    const handleUndoConfirm = async () => {
        if (!undoTarget) {
            return;
        }

        const { student, activity, submission } = undoTarget;

        try {
            setDeleting(true);

            await deleteSubmission(submission.id);

            setBoard((previous) =>
                previous
                    ? {
                        ...previous,
                        students: previous.students.map((item) => {
                            if (item.id !== student.id) {
                                return item;
                            }

                            const remaining = { ...item.submissions };

                            delete remaining[activity.id];

                            return { ...item, submissions: remaining };
                        }),
                    }
                    : previous
            );

            setConfirmOpen(false);
            setUndoTarget(null);

            setScanResult({
                kind: "info",
                title: student.name,
                text: `Se quitó su entrega de «${activity.title}».`,
            });
        } catch (error) {
            console.error("Error eliminando entrega:", error);

            setDialog({
                open: true,
                type: "error",
                title: "No se pudo quitar la entrega",
                description: "Ocurrió un error al quitar la entrega.",
            });
        } finally {
            setDeleting(false);
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
                            <ClipboardCheck size={22} className="text-[#1F2A44]" />
                        </div>

                        <div>
                            <h1 className="font-display text-2xl font-bold text-[#1F2A44]">
                                Entregas
                            </h1>

                            <p className="text-sm text-[#6B7A90]">
                                Escanea el QR de cada alumno para registrar su entrega.
                            </p>
                        </div>
                    </div>

                    <SubmissionsExportButtons
                        activities={activities}
                        students={students}
                        disabled={loading}
                        onError={(message) =>
                            setDialog({
                                open: true,
                                type: "error",
                                title: "No se pudo generar el reporte",
                                description: message,
                            })
                        }
                    />
                </section>

                {/* Escáner */}
                <ScanPanel
                    activity={activeActivity}
                    loading={loading}
                    delivered={deliveredCount}
                    total={students.length}
                    result={scanResult}
                    inputRef={scanInputRef}
                    onScan={handleScan}
                />

                {/* Tabla */}
                <Card className="border-[#D5DEE8] bg-white">
                    <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
                        <CardTitle className="font-display text-lg text-[#1F2A44]">
                            Registro de entregas
                        </CardTitle>

                        <div className="flex flex-wrap items-center justify-end gap-3">
                            <div className="flex items-center gap-2">
                                <label
                                    htmlFor="submission-trimester-filter"
                                    className="text-sm font-medium text-[#1F2A44]"
                                >
                                    Ver:
                                </label>
                                <select
                                    id="submission-trimester-filter"
                                    value={trimesterFilter}
                                    onChange={(event) => {
                                        setTrimesterFilter(
                                            event.target.value === "all"
                                                ? "all"
                                                : Number(event.target.value)
                                        );
                                        setSubjectFilter("");
                                    }}
                                    disabled={loading}
                                    className="h-9 rounded-md border border-[#D5DEE8] bg-white px-3 text-sm font-medium text-[#1F2A44] outline-none focus-visible:ring-2 focus-visible:ring-[#187A4C]"
                                >
                                    <option value="all">Todas</option>
                                    {TRIMESTERS.map((trimester) => (
                                        <option key={trimester.id} value={trimester.id}>
                                            {trimester.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <label
                                    htmlFor="submission-subject-filter"
                                    className="text-sm font-medium text-[#1F2A44]"
                                >
                                    Materia:
                                </label>
                                <select
                                    id="submission-subject-filter"
                                    value={subjectFilter}
                                    onChange={(event) => setSubjectFilter(event.target.value)}
                                    disabled={loading || subjectOptions.length === 0}
                                    className="h-9 max-w-52 rounded-md border border-[#D5DEE8] bg-white px-3 text-sm font-medium text-[#1F2A44] outline-none focus-visible:ring-2 focus-visible:ring-[#187A4C] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value="">Todas las materias</option>
                                    {subjectOptions.map((subject) => (
                                        <option key={subject} value={subject}>
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                                <span
                                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
                                    style={{
                                        backgroundColor: `#${PALETTE.greenSoft}`,
                                        color: `#${PALETTE.greenText}`,
                                    }}
                                >
                                    <Check size={14} strokeWidth={3} />
                                    Entregó a tiempo
                                </span>

                                <span
                                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
                                    style={{
                                        backgroundColor: `#${PALETTE.orangeSoft}`,
                                        color: `#${PALETTE.orangeText}`,
                                    }}
                                >
                                    <Check size={14} strokeWidth={3} />
                                    Entregó a destiempo
                                </span>

                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B5B]/15 px-3 py-1.5 text-[#9A2A1E]">
                                    <Clock size={14} />
                                    Pendiente
                                </span>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {loading ? (
                            <div
                                className="space-y-3 p-6"
                                aria-busy="true"
                                aria-label="Cargando entregas"
                            >
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        className="h-12 w-full rounded-xl"
                                    />
                                ))}
                            </div>
                        ) : (
                            <SubmissionBoard
                                activities={visibleActivities}
                                students={students}
                                highlightedId={highlightedId}
                                emptyActivitiesMessage={emptyActivitiesMessage}
                                onUndo={handleUndoClick}
                                onMark={handleMarkClick}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Confirmar quitar entrega */}
            <AppConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="¿Quitar la entrega?"
                description={
                    undoTarget
                        ? `¿Quitar la entrega de ${undoTarget.student.name} en «${undoTarget.activity.title}»? Volverá a aparecer como pendiente.`
                        : "Volverá a aparecer como pendiente."
                }
                confirmText="Quitar entrega"
                cancelText="Cancelar"
                onConfirm={handleUndoConfirm}
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
            {/* Confirmar marcar entrega */}
            <AppConfirmDialog
                open={markConfirmOpen}
                onOpenChange={setMarkConfirmOpen}
                title="¿Marcar como entregada?"
                description={
                    markTarget
                        ? `¿Registrar que ${markTarget.student.name} entregó «${markTarget.activity.title}»?`
                        : "Se registrará la entrega."
                }
                confirmText="Marcar entrega"
                cancelText="Cancelar"
                loadingText="Registrando..."
                variant="success"
                onConfirm={handleMarkConfirm}
                loading={marking}
            />
        </>
    );
}