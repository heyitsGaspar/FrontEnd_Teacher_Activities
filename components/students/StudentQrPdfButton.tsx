"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    getAllChildren,
} from "@/app/services/children/service";

interface StudentQrPdfButtonProps {
    onError: (message: string) => void;
}

export function StudentQrPdfButton({
    onError,
}: StudentQrPdfButtonProps) {
    const [loading, setLoading] =
        useState(false);

    const handleGeneratePdf = async () => {
        try {
            setLoading(true);

            const children =
                await getAllChildren();

            if (children.length === 0) {
                onError(
                    "No hay alumnos registrados para generar el PDF."
                );

                return;
            }

            const QRCode =
                await import("qrcode");

            const { jsPDF } =
                await import("jspdf");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "letter",
            });

            const pageWidth =
                pdf.internal.pageSize.getWidth();

            const pageHeight =
                pdf.internal.pageSize.getHeight();

            const margin = 15;

            const cardWidth =
                (pageWidth - margin * 2 - 10) /
                2;

            const cardHeight = 120;

            const qrSize = 70;

            const columns = 2;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const rows = 2;

            for (
                let index = 0;
                index < children.length;
                index++
            ) {
                const child =
                    children[index];

                const position =
                    index % 4;

                if (
                    index > 0 &&
                    position === 0
                ) {
                    pdf.addPage();
                }

                const column =
                    position % columns;

                const row =
                    Math.floor(
                        position / columns
                    );

                const x =
                    margin +
                    column *
                        (cardWidth + 10);

                const y =
                    margin +
                    row *
                        (cardHeight + 10);

                /*
                 * Tarjeta del alumno.
                 */
                pdf.roundedRect(
                    x,
                    y,
                    cardWidth,
                    cardHeight,
                    4,
                    4,
                    "S"
                );

                /*
                 * Nombre.
                 */
                pdf.setFontSize(14);
                pdf.setFont("helvetica", "bold");

                pdf.text(
                    child.name,
                    x + cardWidth / 2,
                    y + 12,
                    {
                        align: "center",
                        maxWidth:
                            cardWidth - 10,
                    }
                );

                /*
                 * Código.
                 */
                pdf.setFontSize(9);
                pdf.setFont(
                    "helvetica",
                    "normal"
                );

                pdf.text(
                    `Código: ${child.code}`,
                    x + cardWidth / 2,
                    y + 20,
                    {
                        align: "center",
                    }
                );

                /*
                 * Generamos el QR utilizando
                 * únicamente el código del alumno.
                 */
                const qrDataUrl =
                    await QRCode.toDataURL(
                        child.code,
                        {
                            width: 500,
                            margin: 2,
                            errorCorrectionLevel:
                                "M",
                        }
                    );

                pdf.addImage(
                    qrDataUrl,
                    "PNG",
                    x +
                        (cardWidth -
                            qrSize) /
                            2,
                    y + 27,
                    qrSize,
                    qrSize
                );

                /*
                 * Texto debajo del QR.
                 */
                pdf.setFontSize(8);
                pdf.text(
                    "Escanea este código para registrar la entrega",
                    x + cardWidth / 2,
                    y + 105,
                    {
                        align: "center",
                        maxWidth:
                            cardWidth - 10,
                    }
                );
            }

            /*
             * Pie de página.
             */
            const totalPages =
                pdf.getNumberOfPages();

            for (
                let page = 1;
                page <= totalPages;
                page++
            ) {
                pdf.setPage(page);

                pdf.setFontSize(8);

                pdf.setFont(
                    "helvetica",
                    "normal"
                );

                pdf.text(
                    `Página ${page} de ${totalPages}`,
                    pageWidth / 2,
                    pageHeight - 7,
                    {
                        align: "center",
                    }
                );
            }

            pdf.save(
                "codigos-qr-alumnos.pdf"
            );
        } catch (error) {
            console.error(
                "Error generando PDF:",
                error
            );

            onError(
                "No fue posible generar el PDF de códigos QR."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            type="button"
            onClick={handleGeneratePdf}
            disabled={loading}
            className="bg-[#187A4C] text-white hover:bg-[#1B8855]"
        >
            <FileDown size={18} />

            {loading
                ? "Generando PDF..."
                : "Generar PDF de QR"}
        </Button>
    );
}