import type { CSSProperties } from "react";

type SubmissionStatus = "Entregada" | "Revisada" | "Pendiente";

type Submission = {
    id: string;
    student: string;
    activity: string;
    group: string;
    dueDate: string;
    status: SubmissionStatus;
    score?: string;
};

const submissions: Submission[] = [
    {
        id: "ACT-104",
        student: "Ana García",
        activity: "Collage de otoño",
        group: "Preescolar 3",
        dueDate: "03 oct 2026",
        status: "Entregada",
        score: "9/10",
    },
    {
        id: "ACT-118",
        student: "Mateo López",
        activity: "Cuento ilustrado",
        group: "Primero A",
        dueDate: "05 oct 2026",
        status: "Revisada",
        score: "8.5/10",
    },
    {
        id: "ACT-122",
        student: "Sofía Ramírez",
        activity: "Experimento de plantas",
        group: "Segundo B",
        dueDate: "07 oct 2026",
        status: "Pendiente",
    },
    {
        id: "ACT-130",
        student: "Diego Torres",
        activity: "Mapa de mi comunidad",
        group: "Tercero A",
        dueDate: "09 oct 2026",
        status: "Entregada",
        score: "10/10",
    },
];

const summary = [
    { label: "Total entregadas", value: "24" },
    { label: "Por revisar", value: "6" },
    { label: "Promedio", value: "8.9" },
];

const statusColors: Record<SubmissionStatus, string> = {
    Entregada: "#dcfce7",
    Revisada: "#dbeafe",
    Pendiente: "#fee2e2",
};

const statusTextColors: Record<SubmissionStatus, string> = {
    Entregada: "#166534",
    Revisada: "#1d4ed8",
    Pendiente: "#991b1b",
};

const styles: Record<string, CSSProperties> = {
    page: {
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "32px 20px",
    },
    container: {
        maxWidth: "1100px",
        margin: "0 auto",
    },
    header: {
        marginBottom: "24px",
    },
    eyebrow: {
        fontSize: "12px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#475569",
        fontWeight: 700,
        marginBottom: "10px",
    },
    title: {
        fontSize: "36px",
        margin: 0,
        fontWeight: 700,
    },
    subtitle: {
        marginTop: "10px",
        color: "#475569",
        fontSize: "16px",
    },
    summaryRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "28px",
    },
    summaryCard: {
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
        border: "1px solid #e2e8f0",
    },
    summaryLabel: {
        color: "#64748b",
        fontSize: "13px",
        marginBottom: "8px",
    },
    summaryValue: {
        fontSize: "28px",
        fontWeight: 700,
        margin: 0,
    },
    section: {
        background: "#ffffff",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
        border: "1px solid #e2e8f0",
    },
    sectionHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        marginBottom: "18px",
        flexWrap: "wrap",
    },
    sectionTitle: {
        fontSize: "22px",
        margin: 0,
    },
    filterTag: {
        background: "#eff6ff",
        color: "#1d4ed8",
        border: "1px solid #bfdbfe",
        padding: "8px 12px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
    },
    list: {
        display: "grid",
        gap: "14px",
    },
    card: {
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "18px",
        background: "#f8fafc",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        gap: "12px",
        alignItems: "flex-start",
        marginBottom: "14px",
    },
    id: {
        margin: "0 0 6px 0",
        color: "#64748b",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.04em",
    },
    name: {
        margin: 0,
        fontSize: "20px",
    },
    badge: {
        borderRadius: "999px",
        padding: "7px 12px",
        fontSize: "12px",
        fontWeight: 700,
        border: "1px solid transparent",
        whiteSpace: "nowrap",
    },
    details: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px",
    },
    detailItem: {
        background: "#ffffff",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        padding: "10px 12px",
    },
    label: {
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "#64748b",
        marginBottom: "6px",
        display: "block",
    },
    value: {
        margin: 0,
        fontWeight: 600,
        fontSize: "15px",
    },
};

export default function SubmissionsPage() {
    return (
        <main style={styles.page}>
            <div style={styles.container}>
                <header style={styles.header}>
                    <div style={styles.eyebrow}>Panel docente</div>
                    <h1 style={styles.title}>Sección de actividades entregadas</h1>
                    <p style={styles.subtitle}>
                        Revisa el estado de las tareas enviadas por los estudiantes y sus resultados.
                    </p>
                </header>

                <section style={styles.summaryRow}>
                    {summary.map((item) => (
                        <article key={item.label} style={styles.summaryCard}>
                            <div style={styles.summaryLabel}>{item.label}</div>
                            <p style={styles.summaryValue}>{item.value}</p>
                        </article>
                    ))}
                </section>

                <section style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Actividades recientes</h2>
                        <span style={styles.filterTag}>Hoy • 4 registros</span>
                    </div>

                    <div style={styles.list}>
                        {submissions.map((submission) => (
                            <article key={submission.id} style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <div>
                                        <p style={styles.id}>{submission.id}</p>
                                        <h3 style={styles.name}>{submission.student}</h3>
                                    </div>

                                    <span
                                        style={{
                                            ...styles.badge,
                                            background: statusColors[submission.status],
                                            color: statusTextColors[submission.status],
                                            borderColor: statusTextColors[submission.status] + "22",
                                        }}
                                    >
                                        {submission.status}
                                    </span>
                                </div>

                                <div style={styles.details}>
                                    <div style={styles.detailItem}>
                                        <span style={styles.label}>Actividad</span>
                                        <p style={styles.value}>{submission.activity}</p>
                                    </div>

                                    <div style={styles.detailItem}>
                                        <span style={styles.label}>Grado</span>
                                        <p style={styles.value}>{submission.group}</p>
                                    </div>

                                    <div style={styles.detailItem}>
                                        <span style={styles.label}>Fecha entrega</span>
                                        <p style={styles.value}>{submission.dueDate}</p>
                                    </div>

                                    <div style={styles.detailItem}>
                                        <span style={styles.label}>Calificación</span>
                                        <p style={styles.value}>{submission.score ?? "Sin nota"}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
