"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type RefObject } from "react";
import { CircleAlert, CircleCheck, Info, ScanLine } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import type { BoardActivity } from "@/types/submissions";

export interface ScanResult {
    kind: "success" | "duplicate" | "error" | "info";
    title: string;
    text: string;
}

interface ScanPanelProps {
    activity: BoardActivity | null;
    loading: boolean;
    delivered: number;
    total: number;
    result: ScanResult | null;
    inputRef: RefObject<HTMLInputElement | null>;
    onScan: (code: string) => void;
}

const resultStyles = {
    success: {
        box: "border-[#187A4C]/30 bg-[#187A4C]/10 text-[#0F5233]",
        icon: CircleCheck,
    },
    duplicate: {
        box: "border-[#E0B400]/50 bg-[#FFD84D]/30 text-[#5C4A00]",
        icon: Info,
    },
    error: {
        box: "border-[#FF6B5B]/40 bg-[#FF6B5B]/15 text-[#9A2A1E]",
        icon: CircleAlert,
    },
    info: {
        box: "border-[#7CC6E8]/60 bg-[#DCEEF7] text-[#1F2A44]",
        icon: Info,
    },
} as const;

export function ScanPanel({
    activity,
    loading,
    delivered,
    total,
    result,
    inputRef,
    onScan,
}: ScanPanelProps) {
    const [value, setValue] = useState("");

    const disabled = !activity;

    /*
     * El escáner "teclea" donde esté el foco. Si la maestra hizo clic
     * en otra parte, al escanear llevamos el foco de vuelta al campo.
     * No lo hacemos si hay un diálogo abierto.
     */
    useEffect(() => {
        if (disabled) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }

            if (event.key.length !== 1 || event.key === " ") {
                return;
            }

            if (document.querySelector('[role="dialog"]')) {
                return;
            }

            const target = event.target as HTMLElement | null;

            const isEditable =
                target &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.tagName === "SELECT" ||
                    target.isContentEditable);

            if (!isEditable) {
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [disabled, inputRef]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const code = value.trim();

        setValue("");

        if (code) {
            onScan(code);
        }
    };

    if (loading) {
        return <Skeleton className="h-44 w-full rounded-3xl" />;
    }

    if (!activity) {
        return (
            <section className="flex flex-col gap-4 rounded-3xl border-2 border-dashed border-[#9FB6C6] bg-white/60 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 -rotate-3 items-center justify-center rounded-2xl bg-[#7CC6E8]/50 text-[#1F2A44]">
                        <ScanLine size={24} />
                    </div>

                    <div>
                        <p className="font-display text-lg font-semibold text-[#1F2A44]">
                            No hay ninguna actividad activa en este momento
                        </p>

                        <p className="text-sm text-[#4A5568]">
                            Activa una actividad para empezar a registrar
                            entregas con el escáner.
                        </p>
                    </div>
                </div>

                <Link
                    href="/actividades"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-[#187A4C] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1B8855] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#187A4C]"
                >
                    Ir a actividades
                </Link>
            </section>
        );
    }

    const percent = total === 0 ? 0 : Math.round((delivered / total) * 100);

    const style = result ? resultStyles[result.kind] : null;
    const ResultIcon = style?.icon;

    return (
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-2 ring-[#187A4C]/30 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 -rotate-3 items-center justify-center rounded-2xl bg-[#FFD84D] text-[#1F2A44]">
                        <ScanLine size={24} />
                    </div>

                    <div className="min-w-0">
                        <p className="font-display text-lg font-semibold text-[#1F2A44]">
                            Listo para escanear
                        </p>

                        <p className="wrap-break-word text-sm text-[#4A5568]">
                            Registrando «{activity.title}» de{" "}
                            {activity.subjectName}
                        </p>
                    </div>
                </div>

                <div className="md:w-56">
                    <p className="text-sm font-semibold text-[#1F2A44]">
                        {delivered} de {total} entregaron
                    </p>

                    <div
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={total}
                        aria-valuenow={delivered}
                        aria-label="Entregas registradas"
                        className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#DCEEF7]"
                    >
                        <div
                            className="h-full rounded-full bg-[#187A4C] transition-[width] duration-300"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5">
                <Label htmlFor="scan-input" className="sr-only">
                    Código del alumno
                </Label>

                <div className="relative">
                    <ScanLine className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A90]" />

                    <Input
                        id="scan-input"
                        ref={inputRef}
                        autoFocus
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="Escanea el QR del alumno o escribe su código"
                        className="h-12 rounded-xl border-2 border-[#D5DEE8] pl-10 text-base focus-visible:border-[#187A4C] focus-visible:ring-[#187A4C]/20"
                    />
                </div>
            </form>

            {/* Último resultado: reservamos el espacio para que nada salte */}
            <div aria-live="polite" className="mt-4 min-h-15">
                {result && style && ResultIcon ? (
                    <div
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${style.box}`}
                    >
                        <ResultIcon size={22} className="shrink-0" />

                        <p className="min-w-0 text-sm">
                            <span className="font-display text-base font-semibold">
                                {result.title}
                            </span>{" "}
                            {result.text}
                        </p>
                    </div>
                ) : (
                    <p className="px-1 py-3 text-sm text-[#5B6B80]">
                        Aquí verás al último alumno escaneado.
                    </p>
                )}
            </div>
        </section>
    );
}