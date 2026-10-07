export interface Subject{
    id: string;
    name: string;
}

export interface SubjectPage{
    content: Subject[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}