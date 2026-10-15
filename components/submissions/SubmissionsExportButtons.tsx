"use client";

import { useMemo, useState } from "react";
import { ChevronDown, FileSpreadsheet } from "lucide-react";
import type { Workbook, Worksheet } from "exceljs";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { BoardActivity, BoardStudent } from "@/types/submissions";

import { PALETTE, argb, solid, ratioColors } from "./report-palette";

interface SubmissionsExportButtonsProps {
    activities: BoardActivity[];
    students: BoardStudent[];
    disabled?: boolean;
    onError: (message: string) => void;
}

const thinWhite = { style: "thin" as const, color: argb(PALETTE.white) };

const cellGap = {
    top: thinWhite,
    bottom: thinWhite,
    left: thinWhite,
    right: thinWhite,
};

/* "2026-10-14" -> "14/10/2026" (sin problemas de zona horaria) */
function formatDate(value: string) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
}

function fileStamp() {
    return new Date().toISOString().slice(0, 10);
}

function today() {
    return new Date().toLocaleDateString("es-MX");
}

/* "Ciencias Naturales" -> "Ciencias-Naturales" (válido como nombre de archivo) */
function fileSafe(text: string) {
    return text
        .replace(/[\\/:*?"<>|]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

function downloadBlob(buffer: BlobPart, fileName: string) {
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* ================= Helpers del Excel ================= */

type Group = { subject: string; items: BoardActivity[] };

type ExcelTarget = number | "tabs" | "files";

const NO_SUBJECT = "Sin materia";

type RichPart = {
    text: string;
    font: {
        name: string;
        bold?: boolean;
        size: number;
        color: { argb: string };
    };
};

/* Agrupa las actividades por materia, respetando el orden en que aparecen */
function groupBySubject(activities: BoardActivity[]): Group[] {
    const map = new Map<string, BoardActivity[]>();

    activities.forEach((activity) => {
        const key = activity.subjectName?.trim() || NO_SUBJECT;
        map.set(key, [...(map.get(key) ?? []), activity]);
    });

    return Array.from(map, ([subject, items]) => ({ subject, items }));
}

/* Excel no permite  \ / * ? : [ ]  y máximo 31 caracteres en el nombre */
function sheetName(subject: string, used: Set<string>) {
    const base =
        subject.replace(/[\\/*?:[\]]/g, " ").trim().slice(0, 26) || "Materia";

    let name = base;
    let counter = 2;

    while (used.has(name.toLowerCase())) {
        name = `${base} ${counter++}`;
    }

    used.add(name.toLowerCase());
    return name;
}

function countDone(student: BoardStudent, acts: BoardActivity[]) {
    return acts.filter((a) => student.submissions[a.id]).length;
}

/* Banda azul + franja amarilla (filas 1 y 2) con título y fecha */
function drawBand(sheet: Worksheet, title: string, totalCols: number) {
    for (let c = 1; c <= totalCols; c++) {
        sheet.getCell(1, c).fill = solid(PALETTE.navy);
        sheet.getCell(2, c).fill = solid(PALETTE.yellow);
    }

    const split = totalCols - 2;

    sheet.mergeCells(1, 1, 1, split);
    sheet.mergeCells(1, split + 1, 1, totalCols);

    const titleCell = sheet.getCell(1, 1);
    titleCell.value = title;
    titleCell.font = { bold: true, size: 16, color: argb(PALETTE.white) };
    titleCell.alignment = { vertical: "middle", indent: 1 };

    const dateCell = sheet.getCell(1, split + 1);
    dateCell.value = `Generado el ${today()}`;
    dateCell.font = { bold: true, size: 12, color: argb(PALETTE.yellow) };
    dateCell.alignment = { vertical: "middle", horizontal: "right", indent: 1 };

    sheet.getRow(1).height = 32;
    sheet.getRow(2).height = 4;
}

/* ---------------- Hoja de una materia ---------------- */

function buildSubjectSheet(
    workbook: Workbook,
    name: string,
    subject: string,
    acts: BoardActivity[],
    students: BoardStudent[],
    index: number
) {
    const n = acts.length;
    const compact = n > 6;
    const totalCols = n + 4; // alumno + actividades + 3 resumen
    const firstSummaryCol = n + 2;

    const HEADER_ROW = 5;
    const FIRST_ROW = 6;
    const lastRow = FIRST_ROW + students.length - 1;
    const footerRow = lastRow + 1;

    const tabColors = [PALETTE.yellow, PALETTE.green, PALETTE.coral, PALETTE.sky];

    /* ---------- Estadísticas ---------- */
    const studentStats = students.map((student) => {
        const delivered = countDone(student, acts);

        return {
            delivered,
            pending: n - delivered,
            ratio: n ? delivered / n : 0,
        };
    });

    const deliveredTotal = studentStats.reduce((sum, s) => sum + s.delivered, 0);
    const pendingTotal = students.length * n - deliveredTotal;
    const overall = students.length * n
        ? deliveredTotal / (students.length * n)
        : 0;

    const completeStudents = studentStats.filter((s) => s.delivered === n).length;

    const activityStats = acts.map((a) => {
        const count = students.filter((s) => s.submissions[a.id]).length;

        return { ratio: students.length ? count / students.length : 0 };
    });

    const sheet = workbook.addWorksheet(name, {
        properties: { tabColor: argb(tabColors[index % tabColors.length]) },
        views: [
            {
                state: "frozen",
                xSplit: 1,
                ySplit: HEADER_ROW,
                showGridLines: false,
            },
        ],
    });

    /* ---- Banda compacta ---- */
    drawBand(sheet, `Entregas · ${subject}`, totalCols);

    /* ---- Tarjetas en una sola fila (fila 3) ---- */
    const cards = [
        { value: String(students.length), label: "Alumnos", color: PALETTE.navy },
        { value: String(n), label: "Actividades", color: PALETTE.yellow },
        { value: `${Math.round(overall * 100)}%`, label: "Cumplimiento", color: PALETTE.green },
        { value: `${completeStudents}/${students.length}`, label: "Con todo entregado", color: PALETTE.coral },
    ];

    /* La tarjeta 1 ocupa la columna A; el resto se reparte las demás */
    const remaining = totalCols - 1;
    const base = Math.floor(remaining / 3);
    const extra = remaining % 3;

    const ranges: [number, number][] = [[1, 1]];
    let cursor = 2;

    for (let i = 0; i < 3; i++) {
        const span = base + (i < extra ? 1 : 0);
        ranges.push([cursor, cursor + span - 1]);
        cursor += span;
    }

    cards.forEach((card, i) => {
        const [c1, c2] = ranges[i];

        for (let c = c1; c <= c2; c++) {
            sheet.getCell(3, c).fill = solid(PALETTE.card);
        }

        if (c1 < c2) {
            sheet.mergeCells(3, c1, 3, c2);
        }

        const cell = sheet.getCell(3, c1);

        cell.value = {
            richText: [
                {
                    text: `${card.value}  `,
                    font: { bold: true, size: 15, color: argb(PALETTE.navy) },
                },
                {
                    text: card.label,
                    font: { size: 9, color: argb(PALETTE.grayText) },
                },
            ],
        };
        cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
        cell.border = { left: { style: "thick", color: argb(card.color) } };
    });

    sheet.getRow(3).height = 28;
    sheet.getRow(4).height = 6; // espacio

    /* ---- Encabezados ---- */
    const headerRow = sheet.getRow(HEADER_ROW);
    headerRow.height = compact ? 56 : 48;

    headerRow.getCell(1).value = "Alumno";

    acts.forEach((activity, i) => {
        const parts: RichPart[] = [
            {
                text: activity.title,
                font: { name: "Calibri", bold: true, size: 10, color: argb(PALETTE.white) },
            },
        ];

        if (activity.activityDate) {
            parts.push({
                text: `\n${formatDate(activity.activityDate)}`,
                font: { name: "Calibri", bold: true, size: 11, color: argb(PALETTE.yellow) },
            });
        }

        headerRow.getCell(i + 2).value = { richText: parts };
    });

    headerRow.getCell(firstSummaryCol).value = "Entregadas";
    headerRow.getCell(firstSummaryCol + 1).value = "Pendientes";
    headerRow.getCell(firstSummaryCol + 2).value = "% Cumplimiento";

    for (let c = 1; c <= totalCols; c++) {
        const cell = headerRow.getCell(c);

        cell.fill = solid(PALETTE.navy);
        cell.border = cellGap;
        cell.alignment = {
            vertical: "middle",
            horizontal: c === 1 ? "left" : "center",
            wrapText: true,
            indent: c === 1 ? 1 : 0,
        };

        if (c === 1 || c >= firstSummaryCol) {
            cell.font = { bold: true, size: 10, color: argb(PALETTE.white) };
        }
    }

    /* ---- Filas de alumnos ---- */
    students.forEach((student, i) => {
        const row = sheet.getRow(FIRST_ROW + i);
        const rowBg = i % 2 === 1 ? PALETTE.stripe : PALETTE.white;
        const stats = studentStats[i];

        const hairline = {
            bottom: { style: "thin" as const, color: argb(PALETTE.border) },
        };

        const nameCell = row.getCell(1);
        nameCell.value = student.name;
        nameCell.font = { bold: true, size: 11, color: argb(PALETTE.navy) };
        nameCell.fill = solid(rowBg);
        nameCell.border = hairline;
        nameCell.alignment = { vertical: "middle", indent: 1 };

        acts.forEach((activity, j) => {
            const done = Boolean(student.submissions[activity.id]);
            const cell = row.getCell(j + 2);

            cell.value = compact
                ? done ? "✓" : "✕"
                : done ? "✓ Entregó" : "✕ Pendiente";

            cell.fill = solid(done ? PALETTE.greenSoft : PALETTE.coralSoft);
            cell.font = {
                bold: true,
                size: compact ? 12 : 10,
                color: argb(done ? PALETTE.greenText : PALETTE.coralText),
            };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = cellGap;
        });

        const deliveredCell = row.getCell(firstSummaryCol);
        deliveredCell.value = stats.delivered;
        deliveredCell.font = { bold: true, size: 11, color: argb(PALETTE.green) };

        const pendingCell = row.getCell(firstSummaryCol + 1);
        pendingCell.value = stats.pending;
        pendingCell.font = {
            bold: true,
            size: 11,
            color: argb(stats.pending > 0 ? PALETTE.coralText : PALETTE.gray),
        };

        const percentCell = row.getCell(firstSummaryCol + 2);
        percentCell.value = stats.ratio;
        percentCell.numFmt = "0%";

        [deliveredCell, pendingCell, percentCell].forEach((cell) => {
            cell.fill = solid(rowBg);
            cell.border = hairline;
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        /* El % lleva el color según el cumplimiento */
        const percentColors = ratioColors(stats.ratio);

        percentCell.fill = solid(percentColors.bg);
        percentCell.font = { bold: true, size: 11, color: argb(percentColors.text) };

        row.height = 26;
    });

    /* ---- Fila de cumplimiento por actividad ---- */
    const footer = sheet.getRow(footerRow);
    footer.height = 28;

    const footerLabel = footer.getCell(1);
    footerLabel.value = "Cumplimiento por actividad";
    footerLabel.font = { bold: true, size: 10, color: argb(PALETTE.navy) };
    footerLabel.fill = solid(PALETTE.amberSoft);
    footerLabel.alignment = { vertical: "middle", indent: 1 };

    activityStats.forEach((stat, i) => {
        const cell = footer.getCell(i + 2);
        const colors = ratioColors(stat.ratio);

        cell.value = stat.ratio;
        cell.numFmt = "0%";
        cell.font = { bold: true, size: 10, color: argb(colors.text) };
        cell.fill = solid(colors.bg);
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = cellGap;
    });

    const footerTotals: [number, number, string | undefined][] = [
        [firstSummaryCol, deliveredTotal, undefined],
        [firstSummaryCol + 1, pendingTotal, undefined],
        [firstSummaryCol + 2, overall, "0%"],
    ];

    footerTotals.forEach(([col, value, format]) => {
        const cell = footer.getCell(col);

        cell.value = value;
        if (format) cell.numFmt = format;
        cell.font = { bold: true, size: 11, color: argb(PALETTE.navy) };
        cell.fill = solid(PALETTE.amberSoft);
        cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    /* ---- Leyenda ---- */
    const legendRow = footerRow + 2;

    sheet.mergeCells(legendRow, 1, legendRow, totalCols);

    const legend = sheet.getCell(legendRow, 1);
    legend.value =
        "✓ Entregó   ·   ✕ Pendiente   ·   Color del %: verde 100%, amarillo 50% o más, coral menos de 50%";
    legend.font = { italic: true, size: 9, color: argb(PALETTE.gray) };
    legend.alignment = { indent: 1 };

    /* ---- Filtro, anchos e impresión ---- */
    if (students.length > 0) {
        sheet.autoFilter = {
            from: { row: HEADER_ROW, column: 1 },
            to: { row: lastRow, column: totalCols },
        };
    }

    sheet.getColumn(1).width = 30;

    acts.forEach((_, i) => {
        sheet.getColumn(i + 2).width = compact ? 14 : 20;
    });

    sheet.getColumn(firstSummaryCol).width = 13;
    sheet.getColumn(firstSummaryCol + 1).width = 13;
    sheet.getColumn(firstSummaryCol + 2).width = 18;

    sheet.pageSetup = {
        orientation: "landscape",
        paperSize: 9, // A4
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        printTitlesRow: `${HEADER_ROW}:${HEADER_ROW}`,
        margins: {
            left: 0.4,
            right: 0.4,
            top: 0.5,
            bottom: 0.5,
            header: 0.3,
            footer: 0.3,
        },
    };
}

/* ---------------- Hoja "General" (resumen) ---------------- */

function buildGeneralSheet(
    workbook: Workbook,
    groups: Group[],
    students: BoardStudent[]
) {
    const sheet = workbook.addWorksheet("General", {
        properties: { tabColor: argb(PALETTE.navy) },
        views: [{ showGridLines: false }],
    });

    const totalCols = Math.max(5, groups.length + 2);

    drawBand(sheet, "Resumen general por materia", totalCols);
    sheet.getRow(3).height = 10;

    const hairline = {
        bottom: { style: "thin" as const, color: argb(PALETTE.border) },
    };

    const sectionTitle = (row: number, text: string) => {
        const cell = sheet.getCell(row, 1);

        cell.value = text;
        cell.font = { bold: true, size: 12, color: argb(PALETTE.navy) };
        cell.alignment = { vertical: "middle", indent: 1 };
        sheet.getRow(row).height = 24;
    };

    const tableHead = (row: number, texts: string[]) => {
        texts.forEach((text, i) => {
            const cell = sheet.getCell(row, i + 1);

            cell.value = text;
            cell.font = { bold: true, size: 10, color: argb(PALETTE.white) };
            cell.fill = solid(PALETTE.navy);
            cell.border = cellGap;
            cell.alignment = {
                vertical: "middle",
                horizontal: i === 0 ? "left" : "center",
                wrapText: true,
                indent: i === 0 ? 1 : 0,
            };
        });

        sheet.getRow(row).height = 32;
    };

    /* ---- Por materia ---- */
    sectionTitle(4, "Por materia");
    tableHead(5, ["Materia", "Actividades", "Entregadas", "Pendientes", "% Cumplimiento"]);

    groups.forEach(({ subject, items }, i) => {
        const row = 6 + i;
        const delivered = students.reduce((sum, s) => sum + countDone(s, items), 0);
        const expected = students.length * items.length;
        const ratio = expected ? delivered / expected : 0;
        const bg = i % 2 === 1 ? PALETTE.stripe : PALETTE.white;

        [subject, items.length, delivered, expected - delivered, ratio].forEach(
            (value, c) => {
                const cell = sheet.getCell(row, c + 1);

                cell.value = value;
                cell.fill = solid(bg);
                cell.font = { bold: c === 0, size: 10, color: argb(PALETTE.navy) };
                cell.border = hairline;
                cell.alignment = {
                    vertical: "middle",
                    horizontal: c === 0 ? "left" : "center",
                    indent: c === 0 ? 1 : 0,
                };
            }
        );

        const colors = ratioColors(ratio);
        const percentCell = sheet.getCell(row, 5);

        percentCell.numFmt = "0%";
        percentCell.fill = solid(colors.bg);
        percentCell.font = { bold: true, size: 10, color: argb(colors.text) };

        sheet.getRow(row).height = 24;
    });

    /* ---- Por alumno ---- */
    const startB = 6 + groups.length + 2;
    const totalActivities = groups.reduce((sum, g) => sum + g.items.length, 0);

    sectionTitle(startB, "Por alumno (% de cumplimiento en cada materia)");
    tableHead(startB + 1, ["Alumno", ...groups.map((g) => g.subject), "Total"]);

    students.forEach((student, i) => {
        const row = startB + 2 + i;
        const bg = i % 2 === 1 ? PALETTE.stripe : PALETTE.white;

        const nameCell = sheet.getCell(row, 1);
        nameCell.value = student.name;
        nameCell.font = { bold: true, size: 10, color: argb(PALETTE.navy) };
        nameCell.fill = solid(bg);
        nameCell.border = hairline;
        nameCell.alignment = { vertical: "middle", indent: 1 };

        const ratios = groups.map(({ items }) =>
            items.length ? countDone(student, items) / items.length : 0
        );

        const allDone = groups.reduce(
            (sum, g) => sum + countDone(student, g.items),
            0
        );

        [...ratios, totalActivities ? allDone / totalActivities : 0].forEach(
            (ratio, c) => {
                const cell = sheet.getCell(row, c + 2);
                const colors = ratioColors(ratio);

                cell.value = ratio;
                cell.numFmt = "0%";
                cell.fill = solid(colors.bg);
                cell.font = { bold: true, size: 10, color: argb(colors.text) };
                cell.border = cellGap;
                cell.alignment = { horizontal: "center", vertical: "middle" };
            }
        );

        sheet.getRow(row).height = 24;
    });

    sheet.getColumn(1).width = 30;

    for (let c = 2; c <= totalCols; c++) {
        sheet.getColumn(c).width = 18;
    }

    sheet.pageSetup = {
        orientation: "landscape",
        paperSize: 9,
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
    };
}

/* ====================== Componente ====================== */

export function SubmissionsExportButtons({
    activities,
    students,
    disabled = false,
    onError,
}: SubmissionsExportButtonsProps) {
    const [exporting, setExporting] = useState<"excel" | null>(null);

    const groups = useMemo(() => groupBySubject(activities), [activities]);

    const isDisabled =
        disabled ||
        exporting !== null ||
        students.length === 0 ||
        activities.length === 0;

    const newWorkbook = async () => {
        const ExcelJS = (await import("exceljs")).default;
        const workbook = new ExcelJS.Workbook();

        workbook.creator = "Children Activities";
        workbook.created = new Date();

        return workbook;
    };

    /* Una materia = un archivo con una pestaña */
    const exportSingle = async (index: number) => {
        const group = groups[index];
        const workbook = await newWorkbook();

        buildSubjectSheet(
            workbook,
            sheetName(group.subject, new Set()),
            group.subject,
            group.items,
            students,
            index
        );

        downloadBlob(
            await workbook.xlsx.writeBuffer(),
            `entregas-${fileSafe(group.subject)}-${fileStamp()}.xlsx`
        );
    };

    /* Todas en un solo Excel: pestaña General + una pestaña por materia */
    const exportTabs = async () => {
        const workbook = await newWorkbook();
        const used = new Set<string>(["general"]);

        buildGeneralSheet(workbook, groups, students);

        groups.forEach((group, index) => {
            buildSubjectSheet(
                workbook,
                sheetName(group.subject, used),
                group.subject,
                group.items,
                students,
                index
            );
        });

        downloadBlob(
            await workbook.xlsx.writeBuffer(),
            `entregas-todas-las-materias-${fileStamp()}.xlsx`
        );
    };

    const exportExcel = async (target: ExcelTarget) => {
        try {
            setExporting("excel");

            if (typeof target === "number") {
                await exportSingle(target);
            } else if (target === "tabs") {
                await exportTabs();
            } else {
                for (let i = 0; i < groups.length; i++) {
                    await exportSingle(i);
                    await wait(400); // evita que el navegador bloquee descargas seguidas
                }
            }
        } catch (error) {
            console.error("Error generando Excel:", error);
            onError("Ocurrió un error al generar el archivo de Excel.");
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className="flex flex-col gap-2 sm:flex-row">
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isDisabled}
                        />
                    }
                >
                    <FileSpreadsheet size={18} />
                    {exporting === "excel" ? "Generando..." : "Excel"}
                    <ChevronDown size={16} />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="min-w-56">
                    {groups.map((group, index) => (
                        <DropdownMenuItem
                            key={group.subject}
                            onClick={() => exportExcel(index)}
                        >
                            <span className="flex-1">{group.subject}</span>
                            <span className="text-xs text-[#6B7A90]">
                                {group.items.length}{" "}
                                {group.items.length === 1
                                    ? "actividad"
                                    : "actividades"}
                            </span>
                        </DropdownMenuItem>
                    ))}

                    {groups.length > 1 && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => exportExcel("tabs")}>
                                Todas en un Excel (una pestaña por materia)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportExcel("files")}>
                                Un archivo por materia
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}