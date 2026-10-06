const actividades = [
    {
        titulo: 'Arte y creatividad',
        horario: '09:00 - 10:00',
        descripcion: 'Pintura libre con témpera y recortes de papel para estimular la imaginación.',
        nivel: 'Preescolar',
    },
    {
        titulo: 'Exploración sensorial',
        horario: '10:15 - 11:00',
        descripcion: 'Juegos con texturas, sonidos y materiales naturales para desarrollar la percepción.',
        nivel: 'Primero',
    },
    {
        titulo: 'Movimiento y coordinación',
        horario: '11:15 - 12:00',
        descripcion: 'Circuito de equilibrio, saltos y coordinación motriz fina con música.',
        nivel: 'Todos',
    },
    {
        titulo: 'Lectura compartida',
        horario: '14:00 - 15:00',
        descripcion: 'Sesión de cuento interactivo con preguntas, dramatización y vocabulario.',
        nivel: 'Segundo',
    },
];

export default function ActividadesPage() {
    return (
        <main style={styles.page}>
            <div style={styles.container}>
                <header style={styles.header}>
                    <p style={styles.eyebrow}>Educación infantil</p>
                    <h1 style={styles.title}>Actividades</h1>
                    <p style={styles.subtitle}>
                        Programación semanal para promover aprendizaje, creatividad y bienestar de los niños.
                    </p>
                </header>

                <section style={styles.grid}>
                    {actividades.map((actividad) => (
                        <article key={actividad.titulo} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <span style={styles.badge}>{actividad.nivel}</span>
                                <span style={styles.time}>{actividad.horario}</span>
                            </div>

                            <h2 style={styles.cardTitle}>{actividad.titulo}</h2>
                            <p style={styles.description}>{actividad.descripcion}</p>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7ff 0%, #eefaf4 100%)',
        color: '#1f2937',
        fontFamily: 'Arial, sans-serif',
        padding: '40px 20px',
    },
    container: {
        maxWidth: '1100px',
        margin: '0 auto',
    },
    header: {
        marginBottom: '32px',
    },
    eyebrow: {
        margin: 0,
        color: '#2563eb',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontSize: '12px',
    },
    title: {
        margin: '12px 0 10px',
        fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
        lineHeight: 1.1,
    },
    subtitle: {
        margin: 0,
        maxWidth: '700px',
        fontSize: '1.05rem',
        color: '#4b5563',
        lineHeight: 1.6,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
    },
    card: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '18px',
        padding: '20px',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '16px',
        flexWrap: 'wrap',
    },
    badge: {
        background: '#dbeafe',
        color: '#1d4ed8',
        padding: '6px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 700,
    },
    time: {
        color: '#475569',
        fontSize: '13px',
        fontWeight: 600,
    },
    cardTitle: {
        margin: '0 0 10px',
        fontSize: '1.35rem',
        color: '#111827',
    },
    description: {
        margin: 0,
        color: '#4b5563',
        lineHeight: 1.6,
        fontSize: '0.98rem',
    },
} as const;
