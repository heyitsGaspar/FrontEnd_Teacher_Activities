export interface Child {
    id: string;
    name: string;
    code: string;
}

export interface ChildPage {
    content: Child[];

    totalElements: number;
    totalPages: number;

    size: number;
    number: number;

    first: boolean;
    last: boolean;

    numberOfElements: number;
    empty: boolean;
}