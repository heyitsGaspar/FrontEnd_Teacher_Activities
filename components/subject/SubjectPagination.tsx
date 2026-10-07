"use client";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";

interface SubjectPaginationProps {
    currentPage: number;
    totalPages: number;

    onPageChange: (page: number) => void;
}

export function SubjectPagination({
    currentPage,
    totalPages,
    onPageChange,
}: SubjectPaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 0}
                        onClick={() =>
                            onPageChange(
                                currentPage - 1
                            )
                        }
                    >
                        <ChevronLeft size={16} />

                        <span className="hidden sm:inline">
                            Anterior
                        </span>
                    </Button>
                </PaginationItem>

                <PaginationItem>
                    <span className="px-3 text-sm font-medium text-[#4A5568]">
                        Página {currentPage + 1} de{" "}
                        {totalPages}
                    </span>
                </PaginationItem>

                <PaginationItem>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={
                            currentPage >=
                            totalPages - 1
                        }
                        onClick={() =>
                            onPageChange(
                                currentPage + 1
                            )
                        }
                    >
                        <span className="hidden sm:inline">
                            Siguiente
                        </span>

                        <ChevronRight size={16} />
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}