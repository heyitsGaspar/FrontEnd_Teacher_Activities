"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AppConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    title: string;
    description: string;

    confirmText?: string;
    cancelText?: string;

    onConfirm: () => void;

    loading?: boolean;
}

export function AppConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    loading = false,
}: AppConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-xl text-[#1F2A44]">
                        {title}
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-[#4A5568]">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        {cancelText}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={loading}
                        onClick={(event) => {
                            event.preventDefault();
                            onConfirm();
                        }}
                        className="bg-[#C2392B] text-white hover:bg-[#A92F23]"
                    >
                        {loading ? "Eliminando..." : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}