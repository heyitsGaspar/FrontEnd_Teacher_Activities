"use client";

import {
    CheckCircle2,
    CircleAlert,
    Info,
    XCircle,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type AppDialogType = "success" | "error" | "warning" | "info";

interface AppDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    type?: AppDialogType;

    title: string;
    description: string;

    buttonText?: string;
}

const dialogConfig = {
    success: {
        icon: CheckCircle2,
        iconClassName: "text-[#187A4C]",
        iconBackground: "bg-[#E8F7EF]",
        buttonClassName:
            "bg-[#187A4C] text-white hover:bg-[#1B8855]",
    },

    error: {
        icon: XCircle,
        iconClassName: "text-[#C2392B]",
        iconBackground: "bg-[#FFF1EF]",
        buttonClassName:
            "bg-[#C2392B] text-white hover:bg-[#A92F23]",
    },

    warning: {
        icon: CircleAlert,
        iconClassName: "text-[#B7791F]",
        iconBackground: "bg-[#FFF8DD]",
        buttonClassName:
            "bg-[#B7791F] text-white hover:bg-[#996515]",
    },

    info: {
        icon: Info,
        iconClassName: "text-[#187A4C]",
        iconBackground: "bg-[#EAF6FC]",
        buttonClassName:
            "bg-[#187A4C] text-white hover:bg-[#1B8855]",
    },
};

export function AppDialog({
    open,
    onOpenChange,
    type = "info",
    title,
    description,
    buttonText = "Aceptar",
}: AppDialogProps) {
    const config = dialogConfig[type];
    const Icon = config.icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${config.iconBackground}`}
                        >
                            <Icon
                                size={24}
                                strokeWidth={2}
                                className={config.iconClassName}
                            />
                        </div>

                        <DialogTitle className="font-display text-xl text-[#1F2A44]">
                            {title}
                        </DialogTitle>
                    </div>

                    <DialogDescription className="pt-3 text-sm leading-6 text-[#4A5568]">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className={config.buttonClassName}
                    >
                        {buttonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}