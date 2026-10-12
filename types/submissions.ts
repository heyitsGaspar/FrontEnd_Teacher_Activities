export interface BoardActivity {
    id: string;
    title: string;
    /** Formato yyyy-MM-dd */
    activityDate: string;
    subjectName: string;
    active: boolean;
}

export interface BoardSubmission {
    id: string;
    createdAt: string;
}

export interface BoardStudent {
    id: string;
    name: string;
    code: string;
    /** activityId -> entrega. Si no existe, está pendiente. */
    submissions: Record<string, BoardSubmission>;
}

export interface SubmissionBoardData {
    activities: BoardActivity[];
    students: BoardStudent[];
}

export interface Submission {
    id: string;
    childId: string;
    childName: string;
    childCode: string;
    activityId: string;
    activityTitle: string;
    createdAt: string;
}