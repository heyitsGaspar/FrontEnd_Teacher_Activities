export interface Activity {
    id: string;
    title: string;
    /** Formato yyyy-MM-dd */
    activityDate: string;
    trimester: number;
    subjectId: string;
    subjectName: string;
    active: boolean;
    createdAt: string;
    /** Alumnos que ya entregaron esta actividad */
    submissionsCount: number;
    /** Alumnos que tiene el maestro en total */
    totalStudents: number;
}

export interface ActivityPage {
    content: Activity[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface ActivityPayload {
    subjectId: string;
    title: string;
    activityDate: string;
    trimester: number;
}

export interface CreateActivityPayload extends ActivityPayload {
    activate?: boolean;
}